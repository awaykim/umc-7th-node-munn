export const bodyUserReview = (body, storeId) => {
    return {
        memberId: body.memberId,
        storeId: storeId,
        reviewBody: body.reviewBody,
        rating: body.rating,
        reviewImages: body.reviewImages,
    };
};

export const responseAddReview = ({
    review,
    storeId,
    memberId,
    reviewImages,
}) => {
    return {
        storeId: storeId,
        rating: review.rating,
        body: review.body,
        reviewImages, 
    };
};


export const responseFromReviews = (reviews) => {
    return {
        data: reviews.map((review) => ({
            memberId: review.member.id, // member의 id
            storeId: review.store.id, // store의 id
            body: review.body, // review의 body
            rating: review.rating, // review의 rating
        })),
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null, // 마지막 review의 id를 cursor로 사용
        },
    };
};
