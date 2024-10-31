import { pool } from "../db.config.js";

const now = new Date();

export const addMissionToStore = async (data) => {
    const conn = await pool.getConnection();
    try {
        if (data.deadline < now) {
            throw new Error(
                "잘못된 데드라인입니다. 데드라인은 현재 시간 이후여야 합니다."
            );
        }

        const [result] = await pool.query(
            `INSERT INTO mission (store_id, reward, deadline, mission_spec, created_at) VALUES (?, ?, ?, ?, ?);`,
            [data.storeId, data.reward, data.deadline, data.missionSpec, now]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

export const addUserMissionOngoing = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [confirm] = await pool.query(
            `SELECT EXISTS(SELECT 1 FROM member_mission WHERE status = "ongoing" AND member_id = ? AND mission_id = ?) AS alreadyOngoing; `,
            [data.memberId, data.missionId]
        );

        if (confirm[0].alreadyOngoing) {
            return null;
        }
        const [result] = await pool.query(
            `INSERT INTO member_mission (member_id, mission_id, status, created_at) VALUES (?, ?, ?, ?);`,
            [data.memberId, data.missionId, "ongoing", now]
        );

        return result.insertId;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

export const getMissionFromStore = async (missionId) => {
    const conn = await pool.getConnection();

    try {
        const [user] = await pool.query(
            `SELECT * FROM mission WHERE id = ?;`,
            missionId
        );

        if (user.length == 0) {
            return null;
        }

        return user;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

export const getUserMission = async (userMissionId) => {
    const conn = await pool.getConnection();

    try {
        const [user] = await pool.query(
            `SELECT * FROM member_mission WHERE id = ?;`,
            [userMissionId]
        );

        if (user.length == 0) {
            return null;
        }

        return user;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};
