
import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createPooledPaymentOrder,
    verifyPooledPayment,
} from "../controllers/pooledPaymentController.js";

const router = express.Router();

router.post(
    "/create-order",
    protect,
    createPooledPaymentOrder
);

router.post(
    "/verify",
    protect,
    verifyPooledPayment
);

export default router;
