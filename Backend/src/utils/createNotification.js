import Notification from "../models/NotificationSchema.js";

const createNotification = async ({
    recipient,
    type,
    title,
    message,
    entityType = "SYSTEM",
    entityId = null,
}) => {
    try {
        return await Notification.create({
            recipient,
            type,
            title,
            message,
            entityType,
            entityId,
        });
    } catch (error) {
        console.error(
            "Create notification error:",
            error
        );

        return null;
    }
};

export default createNotification;