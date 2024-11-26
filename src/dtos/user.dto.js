import { hashPassword } from "../services/auth.service.js";

export const bodyToUser = async (body) => {
    const birth = new Date(body.birth);

    // 비밀번호 해싱 처리
    const hashedPassword = await hashPassword(body.password);
    
    return {
        email: body.email,
        name: body.name,
        gender: body.gender,
        birth,
        address: body.address || "",
        specAddress: body.specAddress || "",
        phoneNum: body.phoneNum,
        preferences: body.preferences,
        password: hashedPassword,
    };
};

// 사용자에게 유저 정보를 전달하는 객체
export const responseFromUser = ({ user, preferences }) => {
    const preferFoods = preferences.map(
        (preference) => preference.foodCategory.name
    );

    return {
        email: user.email,
        name: user.name,
        preferCategory: preferFoods,
    };
};

export const bodyToLogin = (body) => {
    return {
        email: body.email,
        password: body.password,
    };
};
