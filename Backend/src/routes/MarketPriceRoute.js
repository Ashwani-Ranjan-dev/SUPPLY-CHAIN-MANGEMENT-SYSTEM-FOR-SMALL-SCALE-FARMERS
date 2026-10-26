import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    getMarketPrice, searchMarketPrices, syncMarketPrices, getMarketPriceHistory,
    getMarketPriceStates, getCurrentMarketPrices, getMarketPriceSyncStatus
} from "../controllers/MarketPriceController.js";

const router = express.Router();

router.get(
    "/",
    protect,
    getMarketPrice
);

router.get(
    "/search",
    protect,
    searchMarketPrices
);

router.post(
    "/sync",
    protect,
    syncMarketPrices
);

router.get(
    "/history",
    protect,
    getMarketPriceHistory
);

router.get(
    "/states",
    protect,
    getMarketPriceStates
);

router.get("/current",
    protect,
    getCurrentMarketPrices
);

router.get(
    "/sync/status",
    protect,
    getMarketPriceSyncStatus
);
export default router;