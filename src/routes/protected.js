// routes/protected.js
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// 보호된 라우트
router.get("/protected-route", authenticateToken, (req, res) => {
    res.status(200).json({
        message: "You have access to this route!",
        user: req.user,
    });
});

export default router;
