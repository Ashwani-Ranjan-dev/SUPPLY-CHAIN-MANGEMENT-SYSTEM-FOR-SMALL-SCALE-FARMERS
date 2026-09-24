import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getFarmerPayments , getPaymentById , updatePaymentStatus} from "../controllers/paymentController.js";

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

// Update Payment Status
router.patch(
    "/:id/status",
    protect,
    updatePaymentStatus
)


export default router;