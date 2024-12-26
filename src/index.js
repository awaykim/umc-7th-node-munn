import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import protectedRouter from "./routes/protected.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy, kakaoStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";
import {
    handleUserSignUp,
    handleUserLogin,
    handleSocialSignUp,
} from "./controllers/user.controller.js";
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

passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

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

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        },
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, // ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);



app.use(passport.initialize());
app.use(passport.session());


app.use("/api", protectedRouter);

// 기본 응답
app.get("/", (req, res) => {
    // #swagger.ignore = true
    console.log(req.user);
    res.send("Hello World!");
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
app.post("/api/v1/login", handleUserLogin);
app.post("/complete-signup", handleSocialSignUp);

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

// Swagger

app.use(
    "/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(
        {},
        {
            swaggerOptions: {
                url: "/openapi.json",
            },
        }
    )
);

app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
    "/oauth2/callback/google",
    passport.authenticate("google", {
        failureRedirect: "/oauth2/login/google",
        failureMessage: true,
    }),
    (req, res) => res.redirect("/complete-signup")
);

app.get("/oauth2/login/kakao", passport.authenticate("kakao"));
app.get(
    "/oauth2/callback/kakao",
    passport.authenticate("kakao", {
        failureRedirect: "/oauth2/login/kakao",
        failureMessage: true,
    }),
    (req, res) => res.redirect("/complete-signup")
);


app.get("/openapi.json", async (req, res, next) => {
    // #swagger.ignore = true
    const options = {
        openapi: "3.0.0",
        disableLogs: true,
        writeOutputFile: false,
    };
    const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
    const routes = ["./src/index.js"];
    const doc = {
        info: {
            title: "UMC 7th",
            description: "UMC 7th Node.js 테스트 프로젝트입니다.",
        },
        host: "localhost:3000",
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
