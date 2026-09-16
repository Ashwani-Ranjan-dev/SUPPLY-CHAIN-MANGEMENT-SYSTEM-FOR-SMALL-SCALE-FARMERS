import express from "express";

import {protect} from "../middleware/authMiddleware.js";

import { getMarketPrice , searchMarketPrices } from "../controllers/MarketPriceController.js";

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

export default router;