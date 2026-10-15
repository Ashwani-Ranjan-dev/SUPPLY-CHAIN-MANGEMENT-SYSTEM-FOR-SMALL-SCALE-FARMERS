
import mongoose from "mongoose";

// Each entry tracks one farmer's original produce listing.
const pooledProduceSchema = new mongoose.Schema(
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
    },
    { _id: false }
);

const pooledLotSchema = new mongoose.Schema(
    {
        crop: {
            type: String,
            required: true,
            trim: true,
        },

        unit: {
            type: String,
            enum: ["KG", "QUINTAL", "TON"],
            required: true,
        },

        location: {
            type: String,
            required: true,
            trim: true,
        },

        quality: {
            type: String,
            enum: ["STANDARD", "GOOD", "PREMIUM"],
            required: true,
        },

        listings: {
            type: [pooledProduceSchema],
            required: true,
            validate: {
                validator: function (listings) {
                    if (!Array.isArray(listings) || listings.length < 2) {
                        return false;
                    }

                    const produceIds = listings.map(
                        (listing) => String(listing.produce)
                    );

                    return new Set(produceIds).size === produceIds.length;
                },
                message:
                    "A pooled lot requires at least two distinct produce listings.",
            },
        },

        totalQuantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0.1,
        },

        earliestAvailableFrom: {
            type: Date,
            required: true,
        },

        latestAvailableFrom: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["OPEN", "COMMITTED", "CANCELLED", "EXPIRED"],
            default: "OPEN",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Calculate the pooled quantity from the listing records.

pooledLotSchema.pre("validate", function () {
    if (Array.isArray(this.listings)) {
        this.totalQuantity = this.listings.reduce(
            (total, listing) => total + Number(listing.quantity || 0),
            0
        );
    }
});

// Indexes help filter compatible lots efficiently.
pooledLotSchema.index({
    crop: 1,
    unit: 1,
    location: 1,
    quality: 1,
    status: 1,
});

const PooledLot = mongoose.model(
    "PooledLot",
    pooledLotSchema
);

export default PooledLot;
