import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    getFarmerPayments,
    getPaymentById,
    markPaymentAsPaid,
    createPaymentOrder,
    verifyPayment
} from "../controllers/paymentController.js";

const router = express.Router();


// ======================================================
// FARMER PAYMENT HISTORY
// ======================================================

router.get(
    "/farmer",
    protect,
    getFarmerPayments
);


// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

router.post(
    "/verify",
    protect,
    verifyPayment
);


// ======================================================
// SINGLE PAYMENT
// ======================================================

router.get(
    "/:id",
    protect,
    getPaymentById
);


// ======================================================
// MANUAL PAYMENT STATUS UPDATE
// ======================================================

router.patch(
    "/:id/status",
    protect,
    markPaymentAsPaid
);

router.post(
    "/create-order",
    protect,
    createPaymentOrder
);


export default router;