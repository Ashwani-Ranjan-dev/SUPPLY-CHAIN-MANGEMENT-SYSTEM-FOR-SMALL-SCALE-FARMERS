import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    getFarmerPayments,
    getPaymentById,
    markPaymentAsPaid,
    createPaymentOrder,
    verifyPayment,
    getBuyerPayments
} from "../controllers/paymentController.js";;


const router = express.Router();

// FARMER PAYMENT HISTORY
router.get(
    "/farmer",
    protect,
    getFarmerPayments
);

//BUYER PAYMENT HISTORY
router.get(
    "/buyer",
    protect,
    getBuyerPayments
)

// VERIFY RAZORPAY PAYMENT
router.post(
    "/verify",
    protect,
    verifyPayment
);



// SINGLE PAYMENT
router.get(
    "/:id",
    protect,
    getPaymentById
);

// MANUAL PAYMENT STATUS UPDATE
router.patch(
    "/:id/status",
    protect,
    markPaymentAsPaid
);

// CREATE PAYMENT ROUTE
router.post(
    "/create-order",
    protect,
    createPaymentOrder
);


export default router;