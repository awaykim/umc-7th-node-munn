import { pool } from "../db.config.js";

// Repository를 통해 DB에 접근
const now = new Date();

// Store 데이터 삽입
export const addStore = async (data) => {
  const conn = await pool.getConnection();
  try {


    const [result] = await pool.query(
      `INSERT INTO store (name, address, tel_num, created_at, category_id, region_id, status) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.name,
        data.address,
        data.telNum,
        now,
        data.foodCategoryId,
        data.regionId,
        "active"
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


export const getStore = async (StoreId) => {
  const conn = await pool.getConnection();

  try {
    const [store] = await conn.query(
      `SELECT * FROM store WHERE id = ?;`,
      [StoreId]
    );

    if (store.length == 0) {
      return null;
    }
    console.log("getStore: ", store)
    return store;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};


export const getRegion = async (StoreId) => {
  const conn = await pool.getConnection();

  try {
    const [region] = await conn.query(
      `SELECT store.region_id, region.name ` +
      `FROM store JOIN region ON store.region_id = region.id ` +
      `WHERE store.id = ?`,
      [StoreId]
    );
    return region;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const getFoodCategory = async (StoreId) => {
    const conn = await pool.getConnection();

    try {
        const [foodCategory] = await conn.query(
            `SELECT store.category_id, fc.name ` +
                `FROM store JOIN food_category fc on store.category_id = fc.id ` +
                `WHERE store.id = ?`,
            [StoreId]
        );
        return foodCategory;
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
};
