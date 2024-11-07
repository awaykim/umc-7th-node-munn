import { prisma } from "../db.config.js"; // Prisma client import

const now = new Date();

export const addMissionToStore = async (data) => {
    try {
        if (data.deadline < now) {
            throw new Error(
                "잘못된 데드라인입니다. 데드라인은 현재 시간 이후여야 합니다."
            );
        }

        const mission = await prisma.mission.create({
            data: {
                storeId: data.storeId,
                reward: data.reward,
                deadline: data.deadline,
                missionSpec: data.missionSpec,
                createdAt: now,
            },
        });

        return mission.id; // 새로운 mission의 ID를 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

export const addUserMissionOngoing = async (data) => {
    try {
        // 이미 진행 중인 미션이 있는지 확인
        const ongoingMission = await prisma.memberMission.findFirst({
            where: {
                status: "ongoing",
                memberId: data.memberId,
                missionId: data.missionId,
            },
        });

        if (ongoingMission) {
            return null; // 이미 진행 중인 미션이 있으면 null 반환
        }

        const userMission = await prisma.memberMission.create({
            data: {
                memberId: data.memberId,
                missionId: data.missionId,
                status: "ongoing",
                createdAt: now,
            },
        });

        return userMission.id; // 새로운 user mission의 ID 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

export const getMissionFromStore = async (missionId) => {
    try {
        const mission = await prisma.mission.findUnique({
            where: {
                id: missionId,
            },
        });

        if (!mission) {
            return null; // 미션이 없으면 null 반환
        }

        return mission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

export const getUserMission = async (userMissionId) => {
    try {
        const userMission = await prisma.memberMission.findUnique({
            where: {
                id: userMissionId,
            },
        });

        if (!userMission) {
            return null; // 유저 미션이 없으면 null 반환
        }

        return userMission;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};
