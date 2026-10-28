
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    getFarmerLedger,
    verifyLedgerIntegrityController,
} from "../controllers/ledgerController.js";

const router = express.Router();

// Existing farmer transaction ledger
router.get("/farmer", protect, getFarmerLedger);

// Verify the SHA-256 hash chain
router.get("/verify", protect, verifyLedgerIntegrityController);

export default router;
