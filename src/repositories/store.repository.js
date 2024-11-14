import { prisma } from "../db.config.js";

// Store 데이터 삽입
export const addStore = async (data) => {
    try {
        const createdStore = await prisma.store.create({
            data: {
                name: data.name,
                address: data.address,
                telNum: data.telNum,
                createdAt: new Date(), // 현재 시간
                region: {
                    connect: { id: data.regionId }, // regionId로 연결
                },
                foodCategory: {
                    connect: { id: data.foodCategoryId }, // foodCategoryId로 연결
                },
                status: "active",
            },
        });
        return createdStore.id; // 생성된 store의 id 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 사용자 정보 얻기
export const getStore = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { region: true, foodCategory: true },  // region과 foodCategory 포함
    });

    if (!store) {
      return null;
    }

    return store;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};


// Store의 지역 정보 조회
export const getRegion = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { region: true },  // region 정보만 선택
    });

    return store?.region;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};


// Store의 음식 카테고리 정보 조회
export const getFoodCategory = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { foodCategory: true },  // foodCategory 정보만 선택
    });

    return store?.foodCategory;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  }
};
