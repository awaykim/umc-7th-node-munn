import { bodyUserReview } from "../dtos/review.dto.js";
import {
    writeReview,
    listStoreReviews,
    listUserReviews,
} from "../services/review.service.js";
import { StatusCodes } from "http-status-codes";

export const handleReviewWrite = async (req, res, next) => {
    /*
#swagger.summary = "리뷰 생성 API"
#swagger.description = "리뷰를 생성합니다. 리뷰 본문과 이미지 URL 목록을 포함할 수 있습니다."
#swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "object",
                required: ["memberId", "reviewBody", "rating"], 
                properties: {
                    memberId: { 
                        type: "integer", 
                        example: 2, 
                        description: "리뷰를 작성한 멤버의 ID" 
                    },
                    reviewBody: { 
                        type: "string", 
                        example: "프리즈마테스트", 
                        description: "리뷰 본문" 
                    },
                    rating: { 
                        type: "number", 
                        format: "float", 
                        example: 4.5, 
                        description: "리뷰 평점 (0.0 ~ 5.0)" 
                    },
                    reviewImages: { 
                        type: "array", 
                        items: { 
                            type: "string", 
                            example: "example/img1" 
                        },
                        description: "리뷰와 관련된 이미지 URL 목록" 
                    }
                }
            }
        }
    }
};
#swagger.responses[200] = {
    description: "리뷰 생성 성공 응답",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    storeId: { 
                        type: "integer", 
                        example: 2, 
                        description: "리뷰 작성 가게"
                    },
                    rating: { 
                        type: "number", 
                        example: 4.5, 
                        description: "작성된 리뷰의 평점" 
                    },
                    body: { 
                        type: "string", 
                        example: "테스트", 
                        description: "작성된 리뷰 본문" 
                    },
                    reviewImages: { 
                        type: "array", 
                        items: { 
                            type: "string", 
                            example: "example/img1" 
                        },
                        description: "작성된 리뷰와 연결된 이미지 URL 목록" 
                    }
                }
            }
        }
    }
};
#swagger.responses[400] = {
    description: "잘못된 요청으로 인해 리뷰 생성 실패",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                        type: "object",
                        properties: {
                            errorCode: { type: "string", example: "R001" },
                            reason: { type: "string", example: "Invalid memberId" }
                        }
                    }
                }
            }
        }
    }
};
*/

    const storeId = parseInt(req.params.store_id);
    console.log("사용자가 storeId: ", storeId, "에 리뷰를 추가합니다.");
    console.log("body : ", storeId, " - ", req.body);

    const review = await writeReview(bodyUserReview(req.body, storeId));

    // res.status(StatusCodes.OK).json({ result: review });
    res.status(StatusCodes.OK).success(review);
};

export const handleListStoreReviews = async (req, res, next) => {
    /*
#swagger.summary = "가게에 대한 리뷰 목록 조회 API"
#swagger.parameters['storeId'] = {
    in: 'path',
    required: true,
    description: '리뷰를 조회할 가게의 ID',
    schema: {
        type: 'integer',
        example: 1
    }
};
#swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이징을 위한 커서 값 (선택 사항)',
    schema: {
        type: 'string',
        example: '10'
    }
};
#swagger.responses[200] = {
    description: "리뷰 목록 조회 성공",
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
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        memberId: { type: "integer", example: 2 },
                                        storeId: { type: "integer", example: 1 },
                                        body: { type: "string", example: "정말 좋은 식당입니다. 테스트 원투쓰리" },
                                        rating: { type: "number", nullable: true, example: 4.5 }
                                    }
                                }
                            },
                            pagination: {
                                type: "object",
                                properties: {
                                    cursor: { type: "integer", nullable: true, example: 5 }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
#swagger.responses[400] = {
    description: "잘못된 요청 또는 파라미터 오류",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                        type: "object",
                        properties: {
                            errorCode: { type: "string", example: "R002" },
                            reason: { type: "string", example: "Invalid storeId" }
                        }
                    },
                    success: { type: "object", nullable: true, example: null }
                }
            }
        }
    }
};
*/

    const reviews = await listStoreReviews(
        parseInt(req.params.storeId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(reviews);
};

export const handleUserReivew = async (req, res, next) => {
    /*
#swagger.summary = "사용자의 리뷰 목록 조회 API"
#swagger.parameters['userId'] = {
    in: 'path',
    required: true,
    description: '리뷰를 조회할 사용자 ID',
    schema: {
        type: 'integer',
        example: 1
    }
};
#swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이징을 위한 커서 값 (선택 사항)',
    schema: {
        type: 'string',
        example: '10'
    }
};
#swagger.responses[200] = {
    description: "리뷰 목록 조회 성공",
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
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        memberId: { type: "integer", example: 2 },
                                        storeId: { type: "integer", example: 1 },
                                        body: { type: "string", example: "정말 좋은 식당입니다. 테스트 원투쓰리" },
                                        rating: { type: "number", nullable: true, example: 4.5 }
                                    }
                                }
                            },
                            pagination: {
                                type: "object",
                                properties: {
                                    cursor: { type: "integer", nullable: true, example: 5 }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
#swagger.responses[400] = {
    description: "잘못된 요청 또는 파라미터 오류",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                        type: "object",
                        properties: {
                            errorCode: { type: "string", example: "R003" },
                            reason: { type: "string", example: "Invalid storeId" }
                        }
                    },
                    success: { type: "object", nullable: true, example: null }
                }
            }
        }
    }
};
*/

    const reviews = await listUserReviews(
        parseInt(req.params.userId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(reviews);
};
