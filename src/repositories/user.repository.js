import { prisma } from "../db.config.js";

// Repository를 통해 DB에 접근
const now = new Date();

// User 데이터 삽입
export const addUser = async (data) => {
    const user = await prisma.member.findFirst({
        where: { email: data.email },
    });
    if (user) {
        return null;
    }

    const created = await prisma.member.create({ data: data });
    return created.id;
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
    const user = await prisma.member.findFirstOrThrow({
        where: { id: userId },
    });
    return user;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (memberId, foodCategoryId) => {
    await prisma.userFavorCategory.create({
        data: {
            memberId: memberId, // 수정된 부분
            foodCategoryId: foodCategoryId,
        },
    });
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (memberId) => {
    const preferences = await prisma.userFavorCategory.findMany({
        select: {
            id: true,
            memberId: true, // 수정된 부분
            foodCategoryId: true,
            foodCategory: true,
        },
        where: { memberId: memberId }, // 수정된 부분
        orderBy: { foodCategoryId: "asc" },
    });

    return preferences;
};
