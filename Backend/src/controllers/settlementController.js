import mongoose from "mongoose";

import Settlement from "../models/SettlementSchema.js";
import Deal from "../models/DealSchema.js";
import Payment from "../models/PaymentSchema.js";
import Delivery from "../models/DeliverySchema.js";
import { LedgerEntry } from "../models/LedgerEntrySchema.js";

import {
    recordSettlementLedgerEvent,
} from "../utils/settlementService.js";

export const confirmFarmerSettlement = async (req, res) => {
    try {
        const farmerId = req.user.id;
        const { dealId, reference } = req.body;

        // Only farmers can confirm receipt of settlement.
        if (req.user.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can confirm receipt of settlement.",
            });
        }

        // Validate the deal ID.
        if (!mongoose.Types.ObjectId.isValid(dealId)) {
            return res.status(400).json({
                success: false,
                message: "A valid deal ID is required.",
            });
        }

        // Find the deal.
        const deal = await Deal.findById(dealId);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Deal not found.",
            });
        }

        // A farmer can only confirm their own deal.
        if (String(deal.farmer) !== String(farmerId)) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot confirm settlement for this deal.",
            });
        }

        // Only completed deals qualify for settlement confirmation.
        if (deal.status !== "COMPLETED") {
            return res.status(400).json({
                success: false,
                message:
                    "The deal must be completed before settlement confirmation.",
            });
        }

        // Find the payment associated with this farmer and deal.
        const payment = await Payment.findOne({
            deal: deal._id,
            farmer: farmerId,
        });

        if (!payment || payment.status !== "PAID") {
            return res.status(400).json({
                success: false,
                message: "A verified, paid transaction is required.",
            });
        }

        // Confirm that delivery has been completed.
        const delivery = await Delivery.findOne({
            deal: deal._id,
        });

        if (!delivery || delivery.status !== "DELIVERED") {
            return res.status(400).json({
                success: false,
                message:
                    "The delivery must be completed before settlement confirmation.",
            });
        }

        // Recover an existing settlement if a previous request
        // saved it but failed before recording its ledger event.
        let settlement = await Settlement.findOne({
            deal: deal._id,
        });

        if (settlement) {
            if (String(settlement.farmer) !== String(farmerId)) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot access this settlement.",
                });
            }
        } else {
            try {
                settlement = await Settlement.create({
                    deal: deal._id,
                    payment: payment._id,
                    farmer: farmerId,
                    buyer: deal.buyer,
                    amount: payment.amount,
                    currency: payment.currency || "INR",
                    status: "SETTLED",
                    reference:
                        typeof reference === "string"
                            ? reference.trim().slice(0, 150) || null
                            : null,
                    confirmedBy: farmerId,
                    settledAt: new Date(),
                });
            } catch (error) {
                // Handle concurrent requests attempting to create
                // the same settlement.
                if (error.code === 11000) {
                    settlement = await Settlement.findOne({
                        deal: deal._id,
                    });

                    if (!settlement) {
                        throw error;
                    }

                    // Verify ownership of the recovered settlement.
                    if (
                        String(settlement.farmer) !==
                        String(farmerId)
                    ) {
                        return res.status(403).json({
                            success: false,
                            message:
                                "You cannot access this settlement.",
                        });
                    }
                } else {
                    throw error;
                }
            }
        }

        // Check whether this settlement already has a ledger event.
        const existingLedgerEvent = await LedgerEntry.findOne({
            eventType: "SETTLEMENT_RECORDED",
            entityType: "SETTLEMENT",
            entityId: settlement._id,
        });

        // Record the event only if it does not already exist.
        if (!existingLedgerEvent) {
            await recordSettlementLedgerEvent({
                settlement,
                actorId: farmerId,
                dealId: settlement.deal,
                paymentId: settlement.payment,
            });
        }

        return res.status(200).json({
            success: true,
            message: existingLedgerEvent
                ? "Settlement was already recorded and its ledger event exists."
                : "Settlement confirmation recorded in the ledger.",
            settlement: {
                id: settlement._id,
                dealId: settlement.deal,
                paymentId: settlement.payment,
                amount: settlement.amount,
                currency: settlement.currency,
                status: settlement.status,
                reference: settlement.reference,
                settledAt: settlement.settledAt,
            },
        });
    } catch (error) {
        console.error("Confirm farmer settlement error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Unable to confirm settlement. If the settlement record was saved, retry the request to recover its ledger event.",
        });
    }
};
