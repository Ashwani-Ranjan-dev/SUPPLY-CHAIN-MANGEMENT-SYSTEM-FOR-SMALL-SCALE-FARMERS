import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    generatePooledLots,
    getOpenPooledLots,
    getPooledLotById
 } from "../controllers/PoolingController.js";

 const router = express.Router();

router.post(
    "/generate",
    protect,
    generatePooledLots
);

router.get(
    "/",
    protect,
    getOpenPooledLots
);

router.get(
    "/:id",
    protect,
    getPooledLotById
);


export default router;