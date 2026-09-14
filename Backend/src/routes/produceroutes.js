import express from "express";

import {protect } from "../middleware/authMiddleware.js";

import {
    createProduce,
    getMyProduce,
    getProduceById,
    updateProduce,
    deleteProduce
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

router.get(
    "/:id",
    protect,
    getProduceById
);

router.put(
    "/:id",
    protect,
    updateProduce
);

router.delete(
    "/:id",
    protect,
    deleteProduce
);

export default router;