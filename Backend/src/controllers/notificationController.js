import Notification from "../models/NotificationSchema.js";
import User from "../models/userSchema.js";

/*
 * Get all notifications for the logged-in farmer
 */
export const getFarmerNotifications = async (req, res) => {
    try {
        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can access notifications.",
            });
        }

        const notifications = await Notification.find({
            recipient: farmer._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        console.error(
            "Get farmer notifications error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load notifications.",
        });
    }
};


/*
 * Get unread notification count
 */
export const getUnreadNotificationCount = async (
    req,
    res
) => {
    try {
        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can access notifications.",
            });
        }

        const unreadCount = await Notification.countDocuments({
            recipient: farmer._id,
            read: false,
        });

        return res.status(200).json({
            success: true,
            unreadCount,
        });
    } catch (error) {
        console.error(
            "Get unread notification count error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load unread notification count.",
        });
    }
};


/*
 * Mark one notification as read
 */
export const markNotificationAsRead = async (
    req,
    res
) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user.id,
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });
        }

        notification.read = true;

        await notification.save();

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            notification,
        });
    } catch (error) {
        console.error(
            "Mark notification as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to update notification.",
        });
    }
};


/*
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (
    req,
    res
) => {
    try {
        const result = await Notification.updateMany(
            {
                recipient: req.user.id,
                read: false,
            },
            {
                $set: {
                    read: true,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error(
            "Mark all notifications as read error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to update notifications.",
        });
    }
};