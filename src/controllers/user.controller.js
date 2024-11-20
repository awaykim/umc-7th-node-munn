import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    try {
        // DTO로 전달 객체로 변환 후 userSignUp 기능 호출
        const user = await userSignUp(bodyToUser(req.body));

        // 성공 시 JSON 응답을 전송
        res.status(StatusCodes.OK).success(user);
    } catch (err) {
        // 오류 발생 시 오류 정보를 담아 next()로 전달
        next({
            errorCode: err.errorCode || "user_signup_failed",
            reason: err.message || "User signup failed",
            data: err.data || null,
        });
    }
};
