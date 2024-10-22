import { pool } from "../db.config.js";

// Repository를 통해 DB에 접근
const now = new Date();

// User 데이터 삽입
export const addUser = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirm[0].isExistEmail) {
      return null;
    }
    
    const [result] = await pool.query(
      `INSERT INTO member (email, name, gender, birth, address, spec_address, phone_num, status, social_type, point, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.gender,
        data.birth,
        data.address,
        data.specAddress,
        data.phoneNum,
        "active",
        "customer",
        0,
        now,
      ]
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

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM member WHERE id = ?;`, userId);


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

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO food_prefer (category_id, member_id, created_at) VALUES (?, ?, ?);`,
      [foodCategoryId, userId, now]
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
export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT fp.id, fp.category_id, fp.member_id, fcl.name " +
        "FROM food_prefer fp JOIN food_category fcl on fp.category_id = fcl.id " +
        "WHERE fp.member_id = ? ORDER BY fp.category_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
