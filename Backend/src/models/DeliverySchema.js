import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
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

        produce: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Produce",
            required: true,
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
        },

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
            ],
            default: "PENDING",
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

const Delivery = mongoose.model(
    "Delivery",
    deliverySchema
);

export default Delivery;