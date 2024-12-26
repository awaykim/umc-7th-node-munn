import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToLogin, bodySocialSignUp } from "../dtos/user.dto.js";
import {
    userSignUp,
    validateUserLogin,
    updateUserProfile,
} from "../services/user.service.js";
import { generateToken } from "../services/auth.service.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        
        const userData = await bodyToUser(req.body);
        const user = await userSignUp(usrData);
        
        // const token = generateToken({ id: user.id, email: user.email });

        // 성공 응답 전송
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            success: {
                // token,
                user: {
                    email: user.email,
                    name: user.name,
                    preferCategory: user.preferCategory,
                },
            },
        });
    } catch (err) {
        next({
            errorCode: err.errorCode || "user_signup_failed",
            reason: err.message || "User signup failed",
            data: err.data || null,
        });
    }
};

export const handleUserLogin = async (req, res, next) => {
    try {
        
        const user = await validateUserLogin(bodyToLogin(req.body));
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                resultType: "FAIL",
                error: {
                    errorCode: "AUTH001",
                    reason: "Invalid email or password",
                },
            });
        }

        // JWT 생성
        // const token = generateToken({ id: user.id, email: user.email });

        // 성공 응답 전송
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            success: {
                // token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            },
        });
    } catch (err) {
        next({
            errorCode: err.errorCode || "login_failed",
            reason: err.message || "Login failed",
        });
    }
};

export const handleSocialSignUp = async (req, res, next) => {
    try {
        // 세션에서 사용자 정보를 가져오기
        const sessionUser = req.session?.passport?.user;

        // 세션에 사용자 정보가 없는 경우 오류 처리
        if (!sessionUser || !sessionUser.email) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                resultType: "FAIL",
                error: {
                    errorCode: "AUTH002",
                    reason: "Session expired or invalid. Please log in again.",
                },
            });
        }

        
        // 클라이언트로부터 전달받은 소셜 로그인 데이터에서 필요한 정보 추출
        const userData = bodySocialSignUp(req.body);

        // 세션에서 이메일 가져와서 사용자 데이터에 추가
        userData.email = sessionUser.email;
        console.log(userData);
        // 사용자 정보를 업데이트하거나 새로 생성
        const updatedUser = await updateUserProfile(userData);
        
        
        console.log("updated: ", updatedUser);
        // 사용자 업데이트가 성공하면, 응답으로 업데이트된 사용자 정보 반환
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            success: {
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    preferCategory: updatedUser.preferCategory,
                },
            },
        });
    } catch (err) {
        // 오류 처리
        next({
            errorCode: err.errorCode || "social_signup_failed",
            reason: err.message || "Social sign up failed",
            data: err.data || null,
        });
    }
};
