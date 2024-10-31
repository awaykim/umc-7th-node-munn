import { pool } from "../db.config.js";

// Repository를 통해 DB에 접근
const now = new Date();

// Review 데이터 삽입
export const addReview = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await pool.query(
            `INSERT INTO review (member_id, store_id, body, rating, created_at) VALUES (?, ?, ?, ?, ?);`,
            [data.memberId, data.storeId, data.reviewBody, data.rating, now]
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

export const getReview = async (reviewId) => {
    const conn = await pool.getConnection();

    try {
        const [review] = await pool.query(
            `SELECT * FROM review WHERE id = ?;`,
            reviewId
        );

        if (review.length == 0) {
            return null;
        }

        return review;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

export const attachReviewPhoto = async (reviewId, storeId, reviewImage) => {
    const conn = await pool.getConnection();

    try {
        await pool.query(
            `INSERT INTO review_image (review_id, store_id, image_url, created_at) VALUES (?, ?, ?, ?);`,
            [reviewId, storeId, reviewImage, now]
        );

        return;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};

// 사용자 선호 카테고리 반환
export const getReviewImagesByReviewId = async (reviewId) => {
    const conn = await pool.getConnection();

    try {
        const [reviewImages] = await pool.query(
            `SELECT review.id, ri.id, ri.image_url 
            FROM review_image ri 
            JOIN review ON ri.review_id = review.id 
            WHERE review.id = ? 
            ORDER BY ri.id ASC;`,
            [reviewId]
        );

        return reviewImages;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};
