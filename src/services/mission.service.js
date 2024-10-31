import { responseMissionToStore } from "../dtos/mission.dto.js";
import {
    addMissionToStore,
    getMissionFromStore,
} from "../repositories/mission.repository.js";

export const newMission = async (data) => {
    const joinMissionId = await addMissionToStore ({
        storeId: data.storeId,
        reward: data.reward,
        deadline: data.deadline,
        missionSpec: data.missionSpec,
    });

    const missionData = await getMissionFromStore(joinMissionId);
    const mission = missionData[0];

    return responseMissionToStore({ mission });
};
