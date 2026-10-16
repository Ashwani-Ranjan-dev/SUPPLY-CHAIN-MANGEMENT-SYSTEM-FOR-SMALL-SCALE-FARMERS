
import mongoose from "mongoose";

const pooledDealContributionSchema = new mongoose.Schema(
    {
        produce: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Produce",
            required: true,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0.1,
        },
        expectedPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        offeredAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        responseStatus: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "REJECTED"],
            default: "PENDING",
        },
    },
    { _id: false }
);

const pooledDealSchema = new mongoose.Schema(
    {
        pooledLot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PooledLot",
            required: true,
            index: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        contributions: {
            type: [pooledDealContributionSchema],
            required: true,
            validate: {
                validator: (items) =>
                    Array.isArray(items) && items.length >= 2,
                message:
                    "A pooled deal must include at least two produce contributions.",
            },
        },
        quantity: {
            type: Number,
            required: true,
            min: 0.1,
        },
        unit: {
            type: String,
            enum: ["KG", "QUINTAL", "TON"],
            required: true,
        },
        offeredPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        message: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED",
                "CANCELLED",
                "COMPLETED",
            ],
            default: "PENDING",
            index: true,
        },
    },
    { timestamps: true }
);

pooledDealSchema.index({
    buyer: 1,
    pooledLot: 1,
    status: 1,
});

const PooledDeal = mongoose.model(
    "PooledDeal",
    pooledDealSchema
);

export default PooledDeal;
