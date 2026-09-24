const API_URL = import.meta.env.VITE_API_URL;


/*
 * Get all farmer notifications
 */
export const getFarmerNotifications = async () => {
    const response = await fetch(
        `${API_URL}/notifications/farmer`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to load notifications."
        );
    }

    return data;
};


/*
 * Get unread notification count
 */
export const getUnreadNotificationCount = async () => {
    const response = await fetch(
        `${API_URL}/notifications/unread-count`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to load unread notifications."
        );
    }

    return data;
};


/*
 * Mark one notification as read
 */
export const markNotificationAsRead = async (
    id
) => {
    const response = await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to mark notification as read."
        );
    }

    return data;
};


/*
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
    const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to mark notifications as read."
        );
    }

    return data;
};