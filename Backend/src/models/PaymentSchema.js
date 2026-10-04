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


        /*
         * Razorpay order created by our backend.
         */
        razorpayOrderId: {
            type: String,
            trim: true,
            default: "",
        },

        /*
         * Razorpay payment ID returned
         * after the buyer completes payment.
         */
        razorpayPaymentId: {
            type: String,
            trim: true,
            default: "",
        },

        /*
         * Signature returned by Razorpay.
         * Used by backend to verify payment.
         */
        razorpaySignature: {
            type: String,
            trim: true,
            default: "",
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