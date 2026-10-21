
import mongoose from "mongoose";

const pooledPaymentSchema = new mongoose.Schema(
    {
        pooledDeal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PooledDeal",
            required: true,
            unique: true,
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },

        currency: {
            type: String,
            default: "INR",
            enum: ["INR"],
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "PROCESSING",
                "PAID",
                "FAILED",
                "REFUNDED",
            ],
            default: "PENDING",
        },

        razorpayOrderId: {
            type: String,
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        transactionId: {
            type: String,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent the same Razorpay payment from being assigned
// to multiple pooled payment records.
pooledPaymentSchema.index(
    { razorpayPaymentId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            razorpayPaymentId: { $type: "string" },
        },
    }
);

const PooledPayment = mongoose.model(
    "PooledPayment",
    pooledPaymentSchema
);

export default PooledPayment;
