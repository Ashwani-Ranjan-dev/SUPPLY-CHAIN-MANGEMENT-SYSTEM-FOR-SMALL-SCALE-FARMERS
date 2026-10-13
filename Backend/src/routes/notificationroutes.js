import express from "express";

import {protect} from "../middleware/authMiddleware.js";

import {
    getFarmerNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getBuyerNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();


// Get farmer notifications
router.get(
    "/farmer",
    protect,
    getFarmerNotifications
);

// Get Buyer notifications
router.get(
    "/buyer",
    protect,
    getBuyerNotifications
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