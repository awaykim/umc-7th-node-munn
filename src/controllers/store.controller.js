import { StatusCodes } from "http-status-codes";
import { bodyNewStore } from "../dtos/store.dto.js";
import { newStore } from "../services/store.service.js";

// 클라이언트의 요청을 받아 서비스에 전달

export const handleStoreAdd = async (req, res, next) => {
    /*  
#swagger.summary = "새로운 가게 추가 API";
#swagger.description = "새로운 가게 데이터를 생성합니다.";
#swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "object",
                required: ["name", "regionId", "telNum", "foodCategoryId"],
                properties: {
                    name: { type: "string", example: "김밥천국" },
                    regionId: { type: "integer", example: 1 },
                    address: { type: "string", example: "서울특별시 종로구" },
                    telNum: { type: "string", example: "02-1234-5678" },
                    foodCategoryId: { type: "integer", example: 10 },
                }
            }
        }
    }
};
*/

    /*
#swagger.responses[200] = {
    description: "새로운 가게 생성 성공 응답",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    name: { type: "string", example: "김밥천국" },
                    address: { type: "string", example: "서울특별시 종로구" },
                    region: { 
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 1 },
                            name: { type: "string", example: "서울특별시" }
                        }
                    },
                    foodCategory: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 10 },
                            name: { type: "string", example: "한식" }
                        }
                    }
                }
            }
        }
    }
};
*/

    /*
#swagger.responses[400] = {
    description: "유효하지 않은 요청 데이터",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                        type: "object",
                        properties: {
                            errorCode: { type: "string", example: "E001" },
                            reason: { type: "string", example: "Invalid regionId" },
                        }
                    }
                }
            }
        }
    }
};
*/

    console.log("가게를 추가합니다.");
    console.log("body : ", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    // dto로 전달 객체로 바꾼 data를 통해 newStoreAt 기능 호출하여 store 생성 -> Service
    try {
        const store = await newStore(bodyNewStore(req.body));
        res.status(StatusCodes.OK).success(store);
    } catch (err) {
        next({
            errorCode: err.errorCode || "user_signup_failed",
            reason: err.message || "User signup failed",
            data: err.data || null,
        });
    }
};
