import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { getBuyerRecommendations } from "../controllers/buyerRecommendationController.js";


import {
    getBuyerDashboard,
    getBuyerProfile,
    updateBuyerProfile,
} from "../controllers/buyerController.js";


const router = express.Router();



// BUYER DASHBOARD

router.get(
    "/dashboard",
    protect,
    getBuyerDashboard
);

//BUYER PROFILE
router.get(
    "/profile",
    protect,
    getBuyerProfile
);

// Update Buyer Profile
router.put(
    "/profile",
    protect,
    updateBuyerProfile
);

// BUYER PRODUCE RECOMMENDATIONS
router.get(
    "/recommendations",
    protect,
    getBuyerRecommendations
);
export default router;