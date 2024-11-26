import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToLogin } from "../dtos/user.dto.js";
import { userSignUp, validateUserLogin } from "../services/user.service.js";
import { generateToken } from "../services/auth.service.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        const userData = await bodyToUser(req.body);
        const user = await userSignUp(usrData);
        
        
        const token = generateToken({ id: user.id, email: user.email });

        // 성공 응답 전송
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            success: {
                token,
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
        const token = generateToken({ id: user.id, email: user.email });

        // 성공 응답 전송
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            success: {
                token,
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
