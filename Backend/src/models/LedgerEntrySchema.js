
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ledgerEntrySchema = new Schema(
    {
        sequence: {
            type: Number,
            required: true,
            unique: true,
            min: 1,
        },

        eventType: {
            type: String,
            required: true,
            enum: [
                "DEAL_CREATED",
                "DEAL_ACCEPTED",
                "DEAL_REJECTED",
                "PAYMENT_VERIFIED",
                "DELIVERY_CONFIRMED",
                "SETTLEMENT_RECORDED",
            ],
        },

        entityType: {
            type: String,
            required: true,
            enum: ["DEAL", "PAYMENT", "DELIVERY", "SETTLEMENT"],
        },

        entityId: {
            type: Schema.Types.ObjectId,
            required: true,
        },

        dealId: {
            type: Schema.Types.ObjectId,
            ref: "Deal",
            default: null,
        },

        paymentId: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            default: null,
        },

        deliveryId: {
            type: Schema.Types.ObjectId,
            ref: "Delivery",
            default: null,
        },

        actor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        details: {
            type: Schema.Types.Mixed,
            default: {},
            required: true,
        },

        occurredAt: {
            type: Date,
            required: true,
            default: Date.now,
        },

        previousHash: {
            type: String,
            required: true,
        },

        recordHash: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

ledgerEntrySchema.index({ dealId: 1, sequence: 1 });
ledgerEntrySchema.index({ paymentId: 1, sequence: 1 });
ledgerEntrySchema.index({ deliveryId: 1, sequence: 1 });

const ledgerCounterSchema = new Schema({
    _id: {
        type: String,
        default: "global",
    },

    sequence: {
        type: Number,
        default: 0,
        min: 0,
    },
});

export const LedgerEntry =
    models.LedgerEntry ||
    model("LedgerEntry", ledgerEntrySchema);

export const LedgerCounter =
    models.LedgerCounter ||
    model("LedgerCounter", ledgerCounterSchema);
