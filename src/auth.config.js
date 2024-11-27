import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { prisma } from "./db.config.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const user = await prisma.member.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }

    const created = await prisma.member.create({
        data: {
            email,
            name: profile.displayName,
            gender: "추후 수정",
            birth: new Date(1970, 0, 1),
            address: "추후 수정",
            specAddress: "추후 수정",
            phoneNum: "추후 수정",
            password: null,
        },
    });

    return { id: created.id, email: created.email, name: created.name };
};


export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.KAKAO_ID,
        callbackURL: "http://localhost:3000/oauth2/callback/kakao",
        scope: ["account_email", "profile_nickname"],
        state: true,
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            const email = profile._json.kakao_account.email; // 이메일 추출
            const nickname = profile._json.properties.nickname; // 닉네임 추출

            // 검증 및 사용자 생성
            const user = await kakaoVerify(email, nickname);

            // 성공적으로 인증되었을 경우 사용자 정보 반환
            cb(null, user);
        } catch (err) {
            cb(err); // 에러 발생 시 에러 반환
        }
    }
);


const kakaoVerify = async (email, nickname) => {
    if (!email) {
        throw new Error(`Email not found: ${email}`);
    }

    // DB에서 사용자 검색
    let user = await prisma.member.findFirst({ where: { email } });

    if (user) {
        // 기존 사용자 반환
        return { id: user.id, email: user.email, name: user.name };
    }

    // 새로운 사용자 생성
    user = await prisma.member.create({
        data: {
            email,
            name: nickname || "Unknown", // 닉네임이 없을 경우 기본값 설정
            gender: "추후 수정", // 기본값 설정
            birth: new Date(1970, 0, 1), // 기본값 설정
            address: "추후 수정", // 기본값 설정
            specAddress: "추후 수정", // 기본값 설정
            phoneNum: "추후 수정", // 기본값 설정
            password: null, // 패스워드 미설정
        },
    });

    // 생성된 사용자 반환
    return { id: user.id, email: user.email, name: user.name };
};
