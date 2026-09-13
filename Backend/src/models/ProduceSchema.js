import mongoose from "mongoose";

const produceSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        crop: {
            type: String,
            required: true,
            trim: true,
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

        expectedPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        quality: {
            type: String,
            enum: [
                "STANDARD",
                "GOOD",
                "PREMIUM",
            ],
            default: "STANDARD",
        },

        availableFrom: {
            type: Date,
            required: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "ACTIVE",
                "SOLD",
                "INACTIVE",
            ],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true,
    }
);

const Produce = mongoose.model(
    "Produce",
    produceSchema
);

export default Produce;