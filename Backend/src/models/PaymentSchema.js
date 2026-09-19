import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        deal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deal",
            required: true,
            unique: true,
        },

        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            default: "INR",
        },

        method: {
            type: String,
            enum: [
                "UPI",
                "CARD",
                "NET_BANKING",
                "CASH",
                "OTHER",
            ],
            default: "OTHER",
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

        transactionId: {
            type: String,
            trim: true,
            default: "",
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

const Payment = mongoose.model(
    "Payment",
    paymentSchema
);

export default Payment;