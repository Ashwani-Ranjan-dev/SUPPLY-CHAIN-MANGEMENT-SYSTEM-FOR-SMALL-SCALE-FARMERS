import express from "express";

import {
    getCurrentUser,
    logout,
    sendOtp,
    verifyOtp,
    sendLoginOtp,
    verifyLoginOtp
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/send-otp",
    sendOtp,
);

router.post(
    "/verify-otp",
    verifyOtp,
);

router.get(
    "/me",
    protect,
    getCurrentUser
);

router.post(
    "/logout",
    logout
);

router.post(
    "/send-login-otp",
    sendLoginOtp
);

router.post(
    "/verify-login-otp",
    verifyLoginOtp
);
export default router;