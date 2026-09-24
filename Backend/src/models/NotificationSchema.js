import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: [
                "DEAL_OFFER",
                "DEAL_ACCEPTED",
                "DEAL_REJECTED",
                "PAYMENT_RECEIVED",
                "DELIVERY_UPDATED",
                "SYSTEM",
            ],
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        entityType: {
            type: String,
            enum: [
                "DEAL",
                "PAYMENT",
                "DELIVERY",
                "PRODUCE",
                "SYSTEM",
            ],
            default: "SYSTEM",
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },

        read: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({
    recipient: 1,
    read: 1,
    createdAt: -1,
});

const Notification = mongoose.model(
    "Notification",
    notificationSchema
);

export default Notification;