
import mongoose from "mongoose";

const pooledDeliverySchema = new mongoose.Schema(
    {
        // One pooled delivery per pooled deal.
        pooledDeal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PooledDeal",
            required: true,
            unique: true,
        },

        pooledLot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PooledLot",
            required: true,
        },

        buyer: {
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

        pickupLocation: {
            type: String,
            required: true,
            trim: true,
        },

        deliveryLocation: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: [
                "NOT_ASSIGNED",
                "ASSIGNED",
                "PICKED_UP",
                "IN_TRANSIT",
                "DELIVERED",
                "CANCELLED",
            ],
            default: "NOT_ASSIGNED",
            index: true,
        },

        // This is copied from the verified payment record.
        // It is not a substitute for checking PooledPayment.
        paymentStatus: {
            type: String,
            enum: ["PAID"],
            default: "PAID",
            required: true,
        },

        deliveryPartner: {
            name: {
                type: String,
                trim: true,
                default: "",
            },
            phone: {
                type: String,
                trim: true,
                default: "",
            },
        },

        estimatedDeliveryDate: {
            type: Date,
            default: null,
        },

        deliveredAt: {
            type: Date,
            default: null,
        },
        // Records buyer confirmation after delivery.
        buyerConfirmedAt: {
            type: Date,
            default: null,
        },

        buyerConfirmed: {
            type: Boolean,
            default: false,
            index: true,
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

pooledDeliverySchema.index({
    buyer: 1,
    status: 1,
});

const PooledDelivery = mongoose.model(
    "PooledDelivery",
    pooledDeliverySchema
);

export default PooledDelivery;
