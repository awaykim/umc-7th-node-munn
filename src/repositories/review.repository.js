import { prisma } from "../db.config.js";

// Repository를 통해 DB에 접근
const now = new Date();

export const addReview = async (data) => {
    try {
        // storeId 확인 (store가 존재하는지 확인)
        const store = await prisma.store.findUnique({
            where: {
                id: data.storeId,
            },
        });

        if (!store) {
            return null; // store가 존재하지 않으면 null 반환
        }

        // 리뷰 데이터 삽입
        const review = await prisma.review.create({
            data: {
                memberId: data.memberId,
                storeId: data.storeId,
                body: data.reviewBody,
                rating: data.rating,
                createdAt: new Date(),
            },
        });

        return review.id; // 생성된 리뷰의 id 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

export const getReview = async (reviewId) => {
    try {
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId,
            },
            include: {
                reviewImages: true, // 리뷰와 함께 관련된 이미지도 가져오기
            },
        });

        if (!review) {
            return null; // 리뷰가 존재하지 않으면 null 반환
        }

        return review; // 리뷰 객체 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

export const attachReviewPhoto = async (reviewId, storeId, reviewImage) => {
    try {
        await prisma.reviewImage.create({
            data: {
                reviewId: reviewId,
                storeId: storeId,
                imageUrl: reviewImage,
                createdAt: new Date(),
            },
        });
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

// 사용자 선호 카테고리 반환
export const getReviewImagesByReviewId = async (reviewId) => {
    try {
        const reviewImages = await prisma.reviewImage.findMany({
            where: {
                reviewId: reviewId,
            },
            orderBy: {
                id: "asc", // ID 순으로 오름차순 정렬
            },
        });

        return reviewImages; // 리뷰 이미지 목록 반환
    } catch (err) {
        throw new Error(
            `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    }
};

export const getAllStoreReviews = async (storeId, cursor) => {
    const reviews = await prisma.review.findMany({
        select: { id: true, body: true, rating: true, store: true, member: true },
        where: { storeId: storeId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    return reviews;
}; 

export const getUserReviews = async (memberId, cursor) => {
    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            body: true,
            rating: true,
            createdAt: true,
            store: true,
            member: true,
            reviewImages: {
                select: {
                    imageUrl: true, 
                },
            },
        },
        where: { memberId: memberId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });

    

    return reviews;
}; 
