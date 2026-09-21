import express from "express";
import {protect} from "../middleware/authMiddleware.js";
import { getFarmerLedger } from "../controllers/ledgerController.js";

const router = express.Router();

router.get(
    "/farmer",
    protect,
    getFarmerLedger
);

export default router;
