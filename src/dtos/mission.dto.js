export const bodyMissionToStore = (body) => {
    const deadline = new Date(body.deadline);
    return {
        storeId: body.storeId, // storeId는 store 모델과 관계
        reward: body.reward,
        deadline: deadline,
        missionSpec: body.missionSpec,
    };
};

export const bodyUserMissionOngiong = (body, memberId) => {
    return {
        memberId: memberId, // memberId는 member 모델과 관계
        missionId: body.missionId, // missionId는 mission 모델과 관계
    };
};

export const responseMissionToStore = ({ mission }) => {
    return {
        id: mission.id,
        storeId: mission.storeId,
        reward: mission.reward,
        deadline: mission.deadline,
        missionSpec: mission.missionSpec,
    };
};

export const responseUserMissionOngiong = (userMission, memberId) => {
    return {
        id: userMission.id,
        memberId: memberId, // memberId는 member와 관계되는 값
        missionId: userMission.missionId, // missionId는 mission 모델에서 가져온 값
        status: userMission.status, // mission 상태
    };
};
 