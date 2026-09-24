import express from "express";

import {protect} from "../middleware/authMiddleware.js";

import {
    getFarmerNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();


// Get farmer notifications
router.get(
    "/farmer",
    protect,
    getFarmerNotifications
);


// Get unread count
router.get(
    "/unread-count",
    protect,
    getUnreadNotificationCount
);


// Mark all as read
router.patch(
    "/read-all",
    protect,
    markAllNotificationsAsRead
);


// Mark one notification as read
router.patch(
    "/:id/read",
    protect,
    markNotificationAsRead
);

export default router;