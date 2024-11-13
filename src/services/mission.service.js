import {
    responseMissionToStore,
    responseUserMissionOngiong,
    responseFromMissions,
} from "../dtos/mission.dto.js";
import {
    addMissionToStore,
    getMissionFromStore,
    addUserMissionOngoing,
    getUserMission,
    getAllStoreMissions,
    getAllUserOngoinhMissions,
} from "../repositories/mission.repository.js";

export const newMission = async (data) => {
    const joinMissionId = await addMissionToStore({
        storeId: data.storeId,
        reward: data.reward,
        deadline: data.deadline,
        missionSpec: data.missionSpec,
    });

    const mission = await getMissionFromStore(joinMissionId);

    return responseMissionToStore({ mission });
};

export const newUserMission = async (data) => {
    const joinUserMissionId = await addUserMissionOngoing({
        memberId: data.memberId,
        missionId: data.missionId,
    });
    if (joinUserMissionId === null) {
        throw new Error("이미 진행 중인 미션입니다.");
    }
    const userMission = await getUserMission(joinUserMissionId);

    
    const memberId = data.memberId;

    return responseUserMissionOngiong(userMission, memberId);
};

export const listStoreMissions = async (storeId, cursor) => {
    const missions = await getAllStoreMissions(storeId, cursor);
    return responseFromMissions(missions);
};

export const listUserOngoingMissions = async (memberId, cursor) => {
    const ongoingMissions = await getAllUserOngoinhMissions(memberId, cursor);
    return responseFromMissions(ongoingMissions);
}