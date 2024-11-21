import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    email: { type: "string" },
                    name: { type: "string" },
                    gender: { type: "string" },
                    birth: { type: "string", format: "date" },
                    address: { type: "string" },
                    specAddress: { type: "string" },
                    phoneNum: { type: "string" },
                    preferences: { type: "array", items: { type: "number" } }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "회원 가입 성공 응답",
        content: {
            "application/json": {
                schema: {
                        type: "object",
                        properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object",
                            properties: {
                            email: { type: "string" },
                            name: { type: "string" },
                            preferCategory: { type: "array", items: { type: "string" } }
                            }
                        }
                    }
                }
            }
        }
    };
        #swagger.responses[400] = {
        description: "회원 가입 실패 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: {
                            type: "object",
                            properties: {
                                errorCode: { type: "string", example: "U001" },
                                reason: { type: "string" },
                                data: { type: "object", nullable: true }
                            }
                        },
                        success: { type: "object", nullable: true, example: null }
                    }
                }
            }
        }
    };

  */
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
