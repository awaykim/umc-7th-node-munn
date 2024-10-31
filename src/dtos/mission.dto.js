export const bodyMissionToStore = (body) => {
    return {
        storeId: body.storeId,
        reward: body.reward,
        deadline: body.deadline,
        missionSpec: body.missionSpec
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