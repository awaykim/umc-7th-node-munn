import { bodyUserReview } from "../dtos/review.dto.js";
import {
    writeReview,
    listStoreReviews,
    listUserReviews,
} from "../services/review.service.js";
import { StatusCodes } from "http-status-codes";

export const handleReviewWrite = async (req, res, next) => {
    const storeId = parseInt(req.params.store_id); 
    console.log("사용자가 storeId: ", storeId, "에 리뷰를 추가합니다.");
    console.log("body : ", storeId, " - ", req.body); 

    const review = await writeReview(bodyUserReview(req.body, storeId));

    res.status(StatusCodes.OK).json({ result: review });
};

export const handleListStoreReviews = async (req, res, next) => {
    const reviews = await listStoreReviews(
        parseInt(req.params.storeId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).json({ result: reviews });
};

export const handleUserReivew = async (req, res, next) => {
    const reviews = await listUserReviews(
        parseInt(req.params.userId),
        typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).json({ result: reviews });
};