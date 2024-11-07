import { StatusCodes } from "http-status-codes";
import {
    bodyMissionToStore,
    bodyUserMissionOngiong,
} from "../dtos/mission.dto.js";
import { newMission, newUserMission } from "../services/mission.service.js";

// 가게에 미션을 추가하는 컨트롤러
export const handleMissionAdd = async (req, res, next) => {
    try {
        console.log("가게에 미션을 추가합니다.");
        console.log("body : ", req.body);

        // 미션 생성 서비스 호출
        const missionData = bodyMissionToStore(req.body);
        const mission = await newMission(missionData);

        // 성공적으로 생성된 미션을 응답으로 반환
        res.status(StatusCodes.CREATED).json({ result: mission });
    } catch (error) {
        // 오류 발생 시, next()로 에러 핸들링 미들웨어로 전달
        console.error("미션 추가 실패: ", error);
        next(error);
    }
};

// 사용자의 진행 중인 미션에 추가하는 컨트롤러
export const handleUserMissionOngiong = async (req, res, next) => {
    try {
        const memberId = parseInt(req.params.user_id);
        console.log("사용자 : ", memberId, "의 진행 중인 미션에 추가합니다.");
        console.log("body : ", req.body);

        // 진행 중인 미션 추가 서비스 호출
        const userMissionData = bodyUserMissionOngiong(req.body, memberId);
        const userMission = await newUserMission(userMissionData);

        // 성공적으로 미션에 추가된 사용자 정보를 응답으로 반환
        res.status(StatusCodes.CREATED).json({ result: userMission });
    } catch (error) {
        // 오류 발생 시, next()로 에러 핸들링 미들웨어로 전달
        console.error("사용자 미션 추가 실패: ", error);
        next(error);
    }
};
