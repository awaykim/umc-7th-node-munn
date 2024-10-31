import { StatusCodes } from "http-status-codes";
import { bodyMissionToStore } from "../dtos/mission.dto.js";
import { newMission } from "../services/mission.service.js";

// 클라이언트의 요청을 받아 서비스에 전달

export const handleMissionAdd = async (req, res, next) => {
    console.log("가게에 미션을 추가합니다.");
    console.log("body : ", req.body); 

    const mission = await newMission(bodyMissionToStore(req.body));
    res.status(StatusCodes.OK).json({ result: mission });
};
