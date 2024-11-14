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
    const missions = await listStoreMissions(
        parseInt(req.params.storeId), 
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    // res.status(StatusCodes.OK).json({ result: missions });
    res.status(StatusCodes.OK).success(missions);
}

export const hanldeListUserOngoingMissions = async (req, res, next) => {
    const ongoingMissions = await listUserOngoingMissions(
        parseInt(req.params.userId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    // res.status(StatusCodes.OK).json({ result: ongoingMissions });
    res.status(StatusCodes.OK).success(ongoingMissions);
}; 

export const handleCompleteOngoingMission = async (req, res, next) => {
    const memberId = parseInt(req.params.userId);
    const missionData = bodyUserMissionOngiong(req.body, memberId);
    const completedMission = await CompleteOngoingMission(missionData);

    // res.status(StatusCodes.CREATED).json({ result: completedMission });
    res.status(StatusCodes.OK).success(completedMission);

}; 

