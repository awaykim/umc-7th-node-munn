import { StatusCodes } from "http-status-codes";
import {
    bodyMissionToStore,
    bodyUserMissionOngiong,
} from "../dtos/mission.dto.js";
import { newMission, newUserMission } from "../services/mission.service.js";

export const handleMissionAdd = async (req, res, next) => {
    console.log("가게에 미션을 추가합니다.");
    console.log("body : ", req.body);

    const mission = await newMission(bodyMissionToStore(req.body));
    res.status(StatusCodes.OK).json({ result: mission });
};

export const handleUserMissionOngiong = async (req, res, next) => {
    const memberId = req.params.user_id;
    console.log("사용자 : ", memberId, "의 진행 중인 미션에 추가합니다.");
    console.log("body : ", req.body);

    const userMission = await newUserMission(
        bodyUserMissionOngiong(req.body, memberId)
    );
    res.status(StatusCodes.OK).json({ result: userMission });
};
