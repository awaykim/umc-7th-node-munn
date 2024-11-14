export const bodyUserReview = (body, storeId) => {
    return {
        memberId: body.memberId,
        storeId: storeId,
        reviewBody: body.reviewBody,
        rating: body.rating,
        reviewImages: body.reviewImages,
    };
};

export const responseAddReview = ({ review, storeId, memberId, reviewImages }) => {
    console.log("리뷰 - dto: ", review);
    console.log("이미지 - dto ", reviewImages)
    return {
        id: review.id,
        memberId: memberId,
        storeId: storeId,
        rating: review.rating,
        body: review.body,
        reviewImages: reviewImages,
    };
};

export const responseFromReviews = (reviews) => {
    return {
        data: reviews,
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null,
        },
    };
};
