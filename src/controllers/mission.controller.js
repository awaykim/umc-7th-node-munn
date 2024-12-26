import { StatusCodes } from "http-status-codes";
import {
    bodyMissionToStore,
    bodyUserMissionOngiong,
} from "../dtos/mission.dto.js";
import {
    newMission,
    newUserMission,
    listStoreMissions,
    listUserOngoingMissions,
    CompleteOngoingMission,
} from "../services/mission.service.js";

// 가게에 미션을 추가하는 컨트롤러
export const handleMissionAdd = async (req, res, next) => {
    /*
#swagger.summary = "가게 미션 추가 API"
#swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "object",
                required: ["storeId", "reward", "deadline", "missionSpec"],
                properties: {
                    storeId: { type: "integer", example: 11 },
                    reward: { type: "integer", example: 3000 },
                    deadline: { type: "string", format: "date", example: "2024-11-30" },
                    missionSpec: { type: "string", example: "가게에 미션 추가하기 테스트" }
                }
            }
        }
    }
};
#swagger.responses[200] = {
    description: "가게 미션 추가 성공",
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
                            storeId: { type: "integer", example: 11 },
                            reward: { type: "integer", example: 3000 },
                            deadline: { type: "string", format: "date-time", example: "2024-11-30T00:00:00.000Z" },
                            missionSpec: { type: "string", example: "가게에 미션 추가하기 테스트" }
                        }
                    }
                }
            }
        }
    }
};
#swagger.responses[400] = {
    description: "가게 미션 추가 실패",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                        type: "object",
                        properties: {
                            errorCode: { type: "string", example: "M001" },
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

    console.log("가게에 미션을 추가합니다.");
    console.log("body : ", req.body);

    // 미션 생성 서비스 호출
    const missionData = bodyMissionToStore(req.body);
    const mission = await newMission(missionData);

    // 성공적으로 생성된 미션을 응답으로 반환
    res.status(StatusCodes.OK).success(mission);
};

// 사용자의 진행 중인 미션에 추가하는 컨트롤러
export const handleUserMissionOngiong = async (req, res, next) => {
    /*
#swagger.summary = "멤버에게 진행 중인 미션 추가 API"
#swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "object",
                required: ["missionId"],
                properties: {
                    missionId: { type: "integer", example: 2 }
                }
            }
        }
    }
};
#swagger.responses[200] = {
    description: "멤버 진행 중 미션 추가 성공",
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
                            id: { type: "integer", example: 6 },
                            memberId: { type: "integer", example: 11 },
                            missionId: { type: "integer", example: 2 },
                            status: { type: "string", example: "ongoing" }
                        }
                    }
                }
            }
        }
    }
};
#swagger.responses[400] = {
    description: "멤버 진행 중 미션 추가 실패",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "FAIL" },
                    error: {
                        type: "object",
                        properties: {
                            errorCode: { type: "string", example: "M002" },
                            reason: { type: "string", example: "Mission not found" }
                        }
                    },
                    success: { type: "object", nullable: true, example: null }
                }
            }
        }
    }
};
*/

    const memberId = parseInt(req.params.user_id);
    console.log("사용자 : ", memberId, "의 진행 중인 미션에 추가합니다.");
    console.log("body : ", req.body);

    // 진행 중인 미션 추가 서비스 호출
    const userMissionData = bodyUserMissionOngiong(req.body, memberId);
    const userMission = await newUserMission(userMissionData);

    // 성공적으로 미션에 추가된 사용자 정보를 응답으로 반환
    // res.status(StatusCodes.CREATED).json({ result: userMission });
    res.status(StatusCodes.OK).success(userMission);
};

export const handleListStoreMissions = async (req, res, next) => {
    /*
#swagger.summary = "가게에 대한 미션 목록 조회 API"
#swagger.parameters['storeId'] = {
    in: 'path',
    required: true,
    description: '미션을 조회할 가게의 ID',
    schema: {
        type: 'integer',
        example: 10
    }
};
#swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이징을 위한 커서 값 (선택 사항)',
    schema: {
        type: 'string',
        example: '5'
    }
};
#swagger.responses[200] = {
    description: "미션 목록 조회 성공",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { type: "string", example: "SUCCESS" },
                    error: { type: "null", example: null },
                    success: {
                        type: "object",
                        properties: {
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer", example: 1 },
                                        storeId: { type: "integer", example: 10 },
                                        reward: { type: "integer", example: 3000 },
                                        deadline: { type: "string", format: "date-time", example: "2024-11-07T09:00:00.000Z" },
                                        missionSpec: { type: "string", example: "가게에 미션 추가하기 테스트" }
                                    }
                                }
                            },
                            pagination: {
                                type: "object",
                                properties: {
                                    cursor: { type: "integer", example: 5 }
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
                            errorCode: { type: "string", example: "M003" },
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

    const missions = await listStoreMissions(
        parseInt(req.params.storeId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    // res.status(StatusCodes.OK).json({ result: missions });
    res.status(StatusCodes.OK).success(missions);
};

export const hanldeListUserOngoingMissions = async (req, res, next) => {
    /*
#swagger.summary = "진행 중인 미션 목록 조회 API"
#swagger.description = "특정 사용자가 진행 중인 미션들의 목록을 조회합니다."
#swagger.parameters['userId'] = {
    in: 'path',
    description: '사용자의 고유 ID',
    required: true,
    schema: {
        type: 'integer',
        example: 1
    }
}
#swagger.responses[200] = {
    description: "진행 중인 미션 목록 조회 성공",
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
                                        id: { type: "integer", example: 2 },
                                        mission: {
                                            type: "object",
                                            properties: {
                                                id: { type: "integer", example: 1 },
                                                storeId: { type: "integer", example: 10 },
                                                reward: { type: "integer", example: 3000 },
                                                deadline: { type: "string", format: "date-time", example: "2024-11-07T09:00:00.000Z" },
                                                missionSpec: { type: "string", example: "가게에 미션 추가하기 테스트" }
                                            }
                                        }
                                    }
                                }
                            },
                            pagination: {
                                type: "object",
                                properties: {
                                    cursor: { type: "integer", example: 2 }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
#swagger.responses[404] = {
    description: "사용자를 찾을 수 없음",
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
                            reason: { type: "string", example: "User not found" }
                        }
                    },
                    success: { type: "object", nullable: true, example: null }
                }
            }
        }
    }
};
*/

    const ongoingMissions = await listUserOngoingMissions(
        parseInt(req.params.userId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(ongoingMissions);
};

export const handleCompleteOngoingMission = async (req, res, next) => {
    /*
#swagger.summary = "진행 중인 미션 완료 API"
#swagger.description = "특정 사용자의 진행 중인 미션을 완료로 변경합니다."
#swagger.parameters['userId'] = {
    in: 'path',
    description: '사용자의 고유 ID',
    required: true,
    schema: {
        type: 'integer',
        example: 10
    }
}
#swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "object",
                required: ["missionId"],
                properties: {
                    missionId: { type: "integer", example: 1 }
                }
            }
        }
    }
};
#swagger.responses[200] = {
    description: "진행 중인 미션 완료 성공",
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
                            id: { type: "integer", example: 2 },
                            memberId: { type: "integer", example: 10 },
                            missionId: { type: "integer", example: 1 },
                            status: { type: "string", example: "complete" }
                        }
                    }
                }
            }
        }
    }
};
#swagger.responses[400] = {
    description: "잘못된 요청 (예: 미션이 존재하지 않음)",
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
                            reason: { type: "string", example: "Mission not found" }
                        }
                    },
                    success: { type: "object", nullable: true, example: null }
                }
            }
        }
    }
};
*/

    const memberId = parseInt(req.params.userId);
    const missionData = bodyUserMissionOngiong(req.body, memberId);
    const completedMission = await CompleteOngoingMission(missionData);

    res.status(StatusCodes.OK).success(completedMission);
};
