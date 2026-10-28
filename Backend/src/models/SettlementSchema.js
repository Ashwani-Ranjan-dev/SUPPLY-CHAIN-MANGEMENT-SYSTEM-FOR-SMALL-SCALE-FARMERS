
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const settlementSchema = new Schema(
    {
        deal: {
            type: Schema.Types.ObjectId,
            ref: "Deal",
            required: true,
            unique: true,
        },

        payment: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            required: true,
        },

        farmer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        buyer: {
            type: Schema.Types.ObjectId,
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
            required: true,
            default: "INR",
        },

        status: {
            type: String,
            enum: ["SETTLED"],
            required: true,
            default: "SETTLED",
        },

        reference: {
            type: String,
            trim: true,
            default: null,
        },

        confirmedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        settledAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Settlement =
    models.Settlement ||
    model("Settlement", settlementSchema);

export default Settlement;
