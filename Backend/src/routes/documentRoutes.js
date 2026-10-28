
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    downloadDealContract,
    downloadDealInvoice,
    downloadPooledDealContract,
    downloadPooledDealInvoice,
} from "../controllers/documentController.js";

const router = express.Router();

router.get(
    "/deals/:dealId/contract",
    protect,
    downloadDealContract
);

router.get(
    "/deals/:dealId/invoice",
    protect,
    downloadDealInvoice
);

router.get(
    "/pooled-deals/:pooledDealId/contract",
    protect,
    downloadPooledDealContract
);

router.get(
    "/pooled-deals/:pooledDealId/invoice",
    protect,
    downloadPooledDealInvoice
);

export default router;
