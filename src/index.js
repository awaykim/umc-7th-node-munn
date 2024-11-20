import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleStoreAdd } from "./controllers/store.controller.js";
import {
    handleReviewWrite,
    handleListStoreReviews,
    handleUserReivew,
} from "./controllers/review.controller.js";
import {
    handleMissionAdd,
    handleUserMissionOngiong,
    handleListStoreMissions,
    hanldeListUserOngoingMissions,
    handleCompleteOngoingMission,
} from "./controllers/mission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    res.success = (success) => {
        return res.json({ resultType: "SUCCESS", error: null, success });
    };

    res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
        return res.json({
            resultType: "FAIL",
            error: { errorCode, reason, data },
            success: null,
        });
    };

    next();
});

app.use(cors()); // CORS 설정
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // JSON 본문 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 본문 파싱

// 기본 응답
app.get("/", (req, res) => {
    res.send("서버 시작됨");
});

// API 엔드포인트 설정
app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/store/add", handleStoreAdd);
app.post("/api/v1/store/:store_id/review", handleReviewWrite);
app.post("/api/v1/store/mission/add", handleMissionAdd);
app.post("/api/v1/user/:user_id/mission/ongoing", handleUserMissionOngiong);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/user/:userId/reviews", handleUserReivew);
app.get("/api/v1/user/:storeId/missions", handleListStoreMissions);
app.get("/api/v1/user/:userId/missions/ongoing", hanldeListUserOngoingMissions);
app.patch(
    "/api/v1/user/:userId/missions/complete",
    handleCompleteOngoingMission
);

// 전역 오류 처리 미들웨어
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).error({
        errorCode: err.errorCode || "unknown",
        reason: err.reason || err.message || null,
        data: null,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
