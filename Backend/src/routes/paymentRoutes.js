import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getFarmerPayments , getPaymentById } from "../controllers/paymentController.js";

const router = express.Router();

// Farmer Payment History
router.get(
    "/farmer",
    protect,
    getFarmerPayments
);

//Single Payment
router.get(
    "/:id",
    protect,
    getPaymentById
);

export default router;