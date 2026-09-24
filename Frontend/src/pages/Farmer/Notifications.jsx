import React, { useEffect, useState } from "react";
import {
    Bell,
    CheckCheck,
    Circle,
    RefreshCw,
    AlertCircle,
    BellRing,
    CreditCard,
    Truck,
} from "lucide-react";

import {
    getFarmerNotifications,
    markNotificationAsRead,
} from "../../services/notificationServices.js";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --------------------------------------------------
    // Fetch Notifications
    // --------------------------------------------------
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getFarmerNotifications();

            // Supports both:
            // response.data.notifications
            // response.notifications
            // response.data
            const data =
                response?.data?.notifications ||
                response?.notifications ||
                response?.data ||
                [];

            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching notifications:", err);

            setError(
                err?.response?.data?.message ||
                    "Failed to load notifications. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------------------------
    // Initial Fetch
    // --------------------------------------------------
    useEffect(() => {
        fetchNotifications();
    }, []);

    // --------------------------------------------------
    // Filter Notifications
    // --------------------------------------------------
    const filteredNotifications = notifications.filter((notification) => {
        if (filter === "UNREAD") {
            return !notification.read;
        }

        if (filter === "READ") {
            return notification.read;
        }

        return true;
    });

    // --------------------------------------------------
    // Mark Notification As Read
    // --------------------------------------------------
    const handleMarkAsRead = async (notification) => {
        if (notification.read) return;

        try {
            await markNotificationAsRead(notification._id);

            setNotifications((current) =>
                current.map((item) =>
                    item._id === notification._id
                        ? { ...item, read: true }
                        : item
                )
            );
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    // --------------------------------------------------
    // Mark All As Read
    // --------------------------------------------------
    const handleMarkAllAsRead = async () => {
        const unreadNotifications = notifications.filter(
            (notification) => !notification.read
        );

        if (unreadNotifications.length === 0) return;

        try {
            await Promise.all(
                unreadNotifications.map((notification) =>
                    markNotificationAsRead(notification._id)
                )
            );

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read: true,
                }))
            );
        } catch (err) {
            console.error("Error marking all notifications as read:", err);

            // Refresh from backend if any request fails.
            fetchNotifications();
        }
    };

    // --------------------------------------------------
    // Notification Icon
    // --------------------------------------------------
    const getNotificationIcon = (notification) => {
        const type = String(
            notification?.type ||
                notification?.notificationType ||
                ""
        ).toLowerCase();

        const title = String(notification?.title || "").toLowerCase();

        if (
            type.includes("payment") ||
            title.includes("payment")
        ) {
            return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <CreditCard size={21} />
                </div>
            );
        }

        if (
            type.includes("delivery") ||
            type.includes("transport") ||
            title.includes("delivery")
        ) {
            return (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Truck size={21} />
                </div>
            );
        }

        return (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <BellRing size={21} />
            </div>
        );
    };

    // --------------------------------------------------
    // Format Time
    // --------------------------------------------------
    const formatTime = (dateValue) => {
        if (!dateValue) return "";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const now = new Date();
        const difference = now.getTime() - date.getTime();

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes} ${
                minutes === 1 ? "minute" : "minutes"
            } ago`;
        }

        if (hours < 24) {
            return `${hours} ${
                hours === 1 ? "hour" : "hours"
            } ago`;
        }

        if (days === 1) {
            return "Yesterday";
        }

        if (days < 7) {
            return `${days} days ago`;
        }

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year:
                date.getFullYear() !== now.getFullYear()
                    ? "numeric"
                    : undefined,
        });
    };

    // --------------------------------------------------
    // Loading Skeleton
    // --------------------------------------------------
    const NotificationSkeleton = () => {
        return (
            <div className="animate-pulse border-b border-gray-100 p-5 last:border-b-0">
                <div className="flex gap-4">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200" />

                    <div className="min-w-0 flex-1 space-y-3">
                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                        <div className="h-3 w-4/5 rounded bg-gray-200" />
                        <div className="h-3 w-24 rounded bg-gray-200" />
                    </div>
                </div>
            </div>
        );
    };

    // --------------------------------------------------
    // Unread Count
    // --------------------------------------------------
    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* ------------------------------------------ */}
                {/* Header */}
                {/* ------------------------------------------ */}
                <div className="mb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <Bell size={22} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Notifications
                                </h1>

                                <p className="mt-1 text-sm text-gray-500 sm:text-base">
                                    Stay updated about your farming
                                    activities
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={fetchNotifications}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />
                                <span className="hidden sm:inline">
                                    Refresh
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={
                                    loading || unreadCount === 0
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                <CheckCheck size={17} />
                                <span className="hidden sm:inline">
                                    Mark all
                                </span>
                                <span className="sm:hidden">
                                    All
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ------------------------------------------ */}
                {/* Main Card */}
                {/* ------------------------------------------ */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* -------------------------------------- */}
                    {/* Filter Tabs */}
                    {/* -------------------------------------- */}
                    <div className="border-b border-gray-200 px-4 sm:px-6">
                        <div className="flex items-center gap-6">
                            {[
                                {
                                    label: "All",
                                    value: "ALL",
                                },
                                {
                                    label: "Unread",
                                    value: "UNREAD",
                                },
                                {
                                    label: "Read",
                                    value: "READ",
                                },
                            ].map((tab) => {
                                const isActive =
                                    filter === tab.value;

                                const count =
                                    tab.value === "UNREAD"
                                        ? unreadCount
                                        : tab.value === "ALL"
                                        ? notifications.length
                                        : notifications.filter(
                                              (item) =>
                                                  item.read
                                          ).length;

                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() =>
                                            setFilter(tab.value)
                                        }
                                        className={`relative flex items-center gap-2 py-4 text-sm font-medium transition ${
                                            isActive
                                                ? "text-green-600"
                                                : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    >
                                        {tab.label}

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${
                                                isActive
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {count}
                                        </span>

                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-green-600" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* -------------------------------------- */}
                    {/* Error State */}
                    {/* -------------------------------------- */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                                <AlertCircle size={27} />
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                Something went wrong
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-gray-500">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchNotifications}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
                            >
                                <RefreshCw size={17} />
                                Try again
                            </button>
                        </div>
                    )}

                    {/* -------------------------------------- */}
                    {/* Loading State */}
                    {/* -------------------------------------- */}
                    {loading && (
                        <div>
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                        </div>
                    )}

                    {/* -------------------------------------- */}
                    {/* Empty State */}
                    {/* -------------------------------------- */}
                    {!loading &&
                        !error &&
                        filteredNotifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                    <Bell size={30} />
                                </div>

                                <h2 className="text-lg font-semibold text-gray-900">
                                    {filter === "UNREAD"
                                        ? "You're all caught up!"
                                        : filter === "READ"
                                        ? "No read notifications"
                                        : "No notifications yet"}
                                </h2>

                                <p className="mt-2 max-w-md text-sm text-gray-500">
                                    {filter === "UNREAD"
                                        ? "You don't have any unread notifications at the moment."
                                        : filter === "READ"
                                        ? "Notifications that you have read will appear here."
                                        : "You'll see updates about offers, payments, deliveries and other farming activities here."}
                                </p>

                                {filter !== "ALL" && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFilter("ALL")
                                        }
                                        className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                                    >
                                        View all notifications
                                    </button>
                                )}
                            </div>
                        )}

                    {/* -------------------------------------- */}
                    {/* Notification List */}
                    {/* -------------------------------------- */}
                    {!loading &&
                        !error &&
                        filteredNotifications.length > 0 && (
                            <div>
                                {filteredNotifications.map(
                                    (notification) => (
                                        <button
                                            key={
                                                notification._id
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification
                                                )
                                            }
                                            className={`group relative flex w-full gap-4 border-b border-gray-100 p-5 text-left transition last:border-b-0 hover:bg-gray-50 sm:p-6 ${
                                                !notification.read
                                                    ? "bg-green-50/30"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {/* Unread indicator */}
                                            {!notification.read && (
                                                <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-green-600" />
                                            )}

                                            {/* Icon */}
                                            {getNotificationIcon(
                                                notification
                                            )}

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3
                                                        className={`text-sm sm:text-base ${
                                                            notification.read
                                                                ? "font-medium text-gray-800"
                                                                : "font-semibold text-gray-900"
                                                        }`}
                                                    >
                                                        {notification.title ||
                                                            "Notification"}
                                                    </h3>

                                                    {!notification.read && (
                                                        <span className="mt-1 flex shrink-0 items-center gap-1.5">
                                                            <Circle
                                                                size={
                                                                    9
                                                                }
                                                                fill="currentColor"
                                                                className="text-green-600"
                                                            />
                                                            <span className="sr-only">
                                                                Unread
                                                            </span>
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="mt-1.5 text-sm leading-6 text-gray-500">
                                                    {notification.message ||
                                                        notification.description ||
                                                        "You have a new notification."}
                                                </p>

                                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                                    <span>
                                                        {formatTime(
                                                            notification.createdAt ||
                                                                notification.created_at ||
                                                                notification.date
                                                        )}
                                                    </span>

                                                    {!notification.read && (
                                                        <>
                                                            <span>
                                                                •
                                                            </span>

                                                            <span className="font-medium text-green-600">
                                                                Unread
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;