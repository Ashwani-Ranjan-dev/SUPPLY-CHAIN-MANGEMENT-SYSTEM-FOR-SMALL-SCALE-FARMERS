import express from "express";

import {protect} from "../middleware/authMiddleware.js";

import { getMarketPrice , searchMarketPrices , syncMarketPrices , getMarketPriceHistory} from "../controllers/MarketPriceController.js";

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

export default router;