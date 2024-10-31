import { bodyUserReview } from "../dtos/review.dto.js";
import { writeReivew } from "../services/review.service.js";
import { StatusCodes } from "http-status-codes";

export const handleReviewWrite = async (req, res, next) => {
    const storeId = req.params.store_id; 
    console.log("사용자가 storeId: ", storeId, "에 리뷰를 추가합니다.");
    console.log("body : ", storeId, " - ", req.body); 

    const review = await writeReivew(bodyUserReview(req.body, storeId));

    res.status(StatusCodes.OK).json({ result: review });
};
