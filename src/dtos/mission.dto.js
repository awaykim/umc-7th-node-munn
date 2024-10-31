export const bodyMissionToStore = (body) => {
    const deadline = new Date(body.deadline);
    return {
        storeId: body.storeId,
        reward: body.reward,
        deadline: deadline,
        missionSpec: body.missionSpec
    };
};

export const bodyUserMissionOngiong = (body, memberId) => {
    return {
        memberId: memberId,
        missionId: body.missionId,
    };
};

export const responseMissionToStore = ({ mission }) => {
    return {
        id: mission.id,
        storeId: mission.store_id,
        reward: mission.reward,
        deadline: mission.deadline,
        missionSpec: mission.mission_spec,
    };
}

export const responseUserMissionOngiong = (userMission, memberId) => {
    return {
        id: userMission.id,
        memberId: memberId,
        missionId: userMission.mission_id,
        status: userMission.status,
    };
};
