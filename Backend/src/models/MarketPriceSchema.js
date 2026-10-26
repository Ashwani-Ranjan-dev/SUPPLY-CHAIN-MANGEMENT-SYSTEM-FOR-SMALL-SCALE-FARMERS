
import mongoose from "mongoose";

const MarketPriceSchema = new mongoose.Schema(
    {
        crop: {
            type: String,
            required: true,
            trim: true,
        },

        market: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        state: {
            type: String,
            trim: true,
            default: "",
        },

        district: {
            type: String,
            trim: true,
            default: "",
        },

        variety: {
            type: String,
            trim: true,
            default: "",
        },

        grade: {
            type: String,
            trim: true,
            default: "",
        },

        unit: {
            type: String,
            enum: ["KG", "QUINTAL", "TON"],
            default: "QUINTAL",
        },

        minPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        maxPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        modalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // Date reported by the mandi data source.
        priceDate: {
            type: Date,
            default: null,
        },

        source: {
            type: String,
            enum: ["MANUAL", "DATA_GOV_IN"],
            default: "MANUAL",
        },
    },
    {
        timestamps: true,
    }
);

MarketPriceSchema.index({
    crop: 1,
    market: 1,
    location: 1,
    priceDate: -1,
});

const MarketPrice = mongoose.model(
    "MarketPrice",
    MarketPriceSchema
);

export default MarketPrice;
