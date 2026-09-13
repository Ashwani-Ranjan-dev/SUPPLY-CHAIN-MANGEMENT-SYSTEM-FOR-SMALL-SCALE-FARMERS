import express from "express";

import {protect } from "../middleware/authMiddleware.js";

import {
    createProduce,
} from "../controllers/produceControllers.js";

const router = express.Router();

router.post(
    "/",
    protect,
    createProduce
);

export default router;