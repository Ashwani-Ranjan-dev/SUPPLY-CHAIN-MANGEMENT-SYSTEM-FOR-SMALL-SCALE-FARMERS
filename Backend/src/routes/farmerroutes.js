import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { getfarmerDashboard,
    getFarmerProfile,
    updateFarmerProfile
} from "../controllers/farmercontroller.js";

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    getfarmerDashboard
);

router.get(
    "/profile",
    protect,
    getFarmerProfile
);

router.put(
    "/profile",
    protect,
    updateFarmerProfile
);

export default router;