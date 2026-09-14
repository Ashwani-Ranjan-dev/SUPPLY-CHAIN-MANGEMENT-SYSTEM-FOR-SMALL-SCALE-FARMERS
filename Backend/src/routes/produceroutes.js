import express from "express";

import {protect } from "../middleware/authMiddleware.js";

import {
    createProduce,
    getMyProduce
} from "../controllers/produceControllers.js";

const router = express.Router();

router.post(
    "/",
    protect,
    createProduce
);

router.get(
    "/my",
    protect,
    getMyProduce
);

export default router;