import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bell,
    BellRing,
    Check,
    CheckCheck,
    Circle,
    CreditCard,
    Leaf,
    RefreshCw,
    AlertCircle,
    Truck,
    Handshake,
    Clock3,
    Sprout,
    ChevronRight,
    Inbox,
} from "lucide-react";

import {
    getFarmerNotifications,
    markNotificationAsRead,
} from "../../services/notificationServices.js";

const Notifications = () => {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [markingAll, setMarkingAll] = useState(false);
    const [markingIds, setMarkingIds] = useState([]);

    // --------------------------------------------------
    // Fetch Notifications
    // --------------------------------------------------
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getFarmerNotifications();

            const data =
                response?.data?.notifications ??
                response?.notifications ??
                response?.data ??
                response ??
                [];

            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching notifications:", err);

            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load notifications. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // --------------------------------------------------
    // Counts and Filters
    // --------------------------------------------------
    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const readCount = notifications.length - unreadCount;

    const filteredNotifications = notifications.filter((notification) => {
        if (filter === "UNREAD") return !notification.read;
        if (filter === "READ") return notification.read;

        return true;
    });

    // --------------------------------------------------
    // Mark One Notification as Read
    // --------------------------------------------------
    const handleMarkAsRead = async (notification) => {
        if (notification.read || markingIds.includes(notification._id)) {
            return;
        }

        try {
            setMarkingIds((current) => [...current, notification._id]);

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

            setError(
                err?.response?.data?.message ||
                    "Unable to mark notification as read. Please try again."
            );
        } finally {
            setMarkingIds((current) =>
                current.filter((id) => id !== notification._id)
            );
        }
    };

    // --------------------------------------------------
    // Mark All Notifications as Read
    // --------------------------------------------------
    const handleMarkAllAsRead = async () => {
        const unreadNotifications = notifications.filter(
            (notification) => !notification.read
        );

        if (unreadNotifications.length === 0 || markingAll) return;

        setMarkingAll(true);
        setError("");

        try {
            const results = await Promise.allSettled(
                unreadNotifications.map((notification) =>
                    markNotificationAsRead(notification._id)
                )
            );

            const successfulIds = unreadNotifications
                .filter(
                    (_, index) => results[index].status === "fulfilled"
                )
                .map((notification) => notification._id);

            setNotifications((current) =>
                current.map((notification) =>
                    successfulIds.includes(notification._id)
                        ? { ...notification, read: true }
                        : notification
                )
            );

            if (results.some((result) => result.status === "rejected")) {
                setError(
                    "Some notifications could not be marked as read. Please try again."
                );
            }
        } catch (err) {
            console.error("Error marking all notifications as read:", err);

            setError("Unable to update notifications. Please try again.");
        } finally {
            setMarkingAll(false);
        }
    };

    // --------------------------------------------------
    // Notification Category
    // --------------------------------------------------
    const getNotificationCategory = (notification) => {
        const type = String(
            notification?.type ||
                notification?.notificationType ||
                ""
        ).toLowerCase();

        const title = String(notification?.title || "").toLowerCase();
        const content = String(
            notification?.message || notification?.description || ""
        ).toLowerCase();

        const combined = `${type} ${title} ${content}`;

        if (
            combined.includes("payment") ||
            combined.includes("paid") ||
            combined.includes("transaction")
        ) {
            return {
                label: "Payment",
                icon: CreditCard,
                iconClass: "bg-emerald-100 text-emerald-700",
                badgeClass: "bg-emerald-50 text-emerald-700",
            };
        }

        if (
            combined.includes("delivery") ||
            combined.includes("transport") ||
            combined.includes("shipment")
        ) {
            return {
                label: "Delivery",
                icon: Truck,
                iconClass: "bg-blue-100 text-blue-700",
                badgeClass: "bg-blue-50 text-blue-700",
            };
        }

        if (
            combined.includes("deal") ||
            combined.includes("offer") ||
            combined.includes("buyer") ||
            combined.includes("accepted") ||
            combined.includes("rejected")
        ) {
            return {
                label: "Deal update",
                icon: Handshake,
                iconClass: "bg-violet-100 text-violet-700",
                badgeClass: "bg-violet-50 text-violet-700",
            };
        }

        return {
            label: "Farm update",
            icon: Sprout,
            iconClass: "bg-green-100 text-green-700",
            badgeClass: "bg-green-50 text-green-700",
        };
    };

    // --------------------------------------------------
    // Relative Time
    // --------------------------------------------------
    const formatTime = (dateValue) => {
        if (!dateValue) return "Recently";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "Recently";

        const now = new Date();
        const difference = now.getTime() - date.getTime();

        if (difference < 0) {
            return "Just now";
        }

        const minutes = Math.floor(difference / 60000);
        const hours = Math.floor(difference / 3600000);
        const days = Math.floor(difference / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        }

        if (hours < 24) {
            return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        }

        if (days === 1) return "Yesterday";

        if (days < 7) return `${days} days ago`;

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    };

    const formatFullDate = (dateValue) => {
        if (!dateValue) return "";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    // --------------------------------------------------
    // Loading Skeleton
    // --------------------------------------------------
    const NotificationSkeleton = () => (
        <div className="flex animate-pulse gap-4 border-b border-gray-100 p-5 sm:p-6">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-gray-200" />

            <div className="min-w-0 flex-1 space-y-3">
                <div className="h-4 w-2/5 rounded bg-gray-200" />
                <div className="h-3 w-4/5 rounded bg-gray-200" />
                <div className="h-3 w-1/3 rounded bg-gray-200" />
            </div>
        </div>
    );

    // --------------------------------------------------
    // Render
    // --------------------------------------------------
    return (
        <div className="min-h-screen bg-[#f6f8f4] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Back Navigation */}
                <button
                    type="button"
                    onClick={() => navigate("/farmer/dashboard")}
                    className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                {/* Page Header */}
                <div className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 p-6 text-white shadow-lg sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner">
                                <BellRing size={28} />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-100">
                                    <Leaf size={14} />
                                    KrishiConnect
                                </div>

                                <h1 className="text-2xl font-bold sm:text-3xl">
                                    Your Notifications
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
                                    Keep track of buyer offers, payments,
                                    deliveries, and important farming updates.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                                <Bell size={22} />
                            </div>

                            <div>
                                <p className="text-2xl font-bold">
                                    {loading ? "—" : unreadCount}
                                </p>
                                <p className="text-xs text-green-100">
                                    Unread updates
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    All notifications
                                </p>
                                <p className="mt-2 text-2xl font-bold text-gray-900">
                                    {loading ? "—" : notifications.length}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                <Inbox size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Unread updates
                                </p>
                                <p className="mt-2 text-2xl font-bold text-green-700">
                                    {loading ? "—" : unreadCount}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                <BellRing size={23} />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Read updates
                                </p>
                                <p className="mt-2 text-2xl font-bold text-blue-700">
                                    {loading ? "—" : readCount}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <CheckCheck size={23} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Panel */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-col gap-4 border-b border-gray-200 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Activity center
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Your latest account and farming updates
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={fetchNotifications}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>

                            <button
                                type="button"
                                onClick={handleMarkAllAsRead}
                                disabled={loading || unreadCount === 0 || markingAll}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {markingAll ? (
                                    <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                    <CheckCheck size={16} />
                                )}
                                {markingAll ? "Updating..." : "Mark all read"}
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="overflow-x-auto border-b border-gray-100 px-4 sm:px-6">
                        <div className="flex min-w-max items-center gap-6">
                            {[
                                { label: "All updates", value: "ALL" },
                                { label: "Unread", value: "UNREAD" },
                                { label: "Read", value: "READ" },
                            ].map((tab) => {
                                const isActive = filter === tab.value;

                                const count =
                                    tab.value === "UNREAD"
                                        ? unreadCount
                                        : tab.value === "READ"
                                        ? readCount
                                        : notifications.length;

                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => setFilter(tab.value)}
                                        className={`relative flex items-center gap-2 py-4 text-sm font-semibold transition ${
                                            isActive
                                                ? "text-green-700"
                                                : "text-gray-500 hover:text-gray-800"
                                        }`}
                                    >
                                        {tab.label}

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${
                                                isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {count}
                                        </span>

                                        {isActive && (
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-green-700" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:mx-6">
                            <AlertCircle
                                size={20}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-red-800">
                                    Notification update
                                </p>
                                <p className="mt-1 text-sm text-red-700">
                                    {error}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                                className="text-sm font-semibold text-red-700 hover:text-red-900"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div>
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                            <NotificationSkeleton />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading &&
                        !error &&
                        filteredNotifications.length === 0 && (
                            <div className="flex flex-col items-center px-6 py-16 text-center">
                                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                                    {filter === "UNREAD" ? (
                                        <Check size={32} />
                                    ) : (
                                        <Bell size={30} />
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-gray-900">
                                    {filter === "UNREAD"
                                        ? "You're all caught up!"
                                        : filter === "READ"
                                        ? "No read notifications"
                                        : "No notifications yet"}
                                </h3>

                                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    {filter === "UNREAD"
                                        ? "There are no unread updates right now. New farming activity will appear here."
                                        : filter === "READ"
                                        ? "Notifications you have read will appear here."
                                        : "Updates about deals, payments, deliveries, and your farming activities will appear here."}
                                </p>

                                {filter !== "ALL" && (
                                    <button
                                        type="button"
                                        onClick={() => setFilter("ALL")}
                                        className="mt-5 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                                    >
                                        View all notifications
                                    </button>
                                )}
                            </div>
                        )}

                    {/* Notification List */}
                    {!loading && filteredNotifications.length > 0 && (
                        <div>
                            {filteredNotifications.map((notification) => {
                                const category =
                                    getNotificationCategory(notification);

                                const CategoryIcon = category.icon;

                                const isMarking = markingIds.includes(
                                    notification._id
                                );

                                const dateValue =
                                    notification.createdAt ||
                                    notification.created_at ||
                                    notification.date;

                                return (
                                    <div
                                        key={notification._id}
                                        className={`group relative flex gap-3 border-b border-gray-100 p-4 transition last:border-b-0 sm:gap-4 sm:p-6 ${
                                            !notification.read
                                                ? "bg-green-50/50 hover:bg-green-50"
                                                : "bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        {!notification.read && (
                                            <span className="absolute bottom-0 left-0 top-0 w-1 bg-green-600" />
                                        )}

                                        {/* Category Icon */}
                                        <div
                                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${category.iconClass}`}
                                        >
                                            <CategoryIcon size={22} />
                                        </div>

                                        {/* Notification Content */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.badgeClass}`}
                                                >
                                                    {category.label}
                                                </span>

                                                {!notification.read && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                                                        <Circle
                                                            size={7}
                                                            fill="currentColor"
                                                        />
                                                        Unread
                                                    </span>
                                                )}
                                            </div>

                                            <h3
                                                className={`mt-2 text-sm sm:text-base ${
                                                    notification.read
                                                        ? "font-semibold text-gray-800"
                                                        : "font-bold text-gray-950"
                                                }`}
                                            >
                                                {notification.title ||
                                                    "Farm notification"}
                                            </h3>

                                            <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                                                {notification.message ||
                                                    notification.description ||
                                                    "You have a new notification."}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                                                <span
                                                    className="inline-flex items-center gap-1.5"
                                                    title={formatFullDate(dateValue)}
                                                >
                                                    <Clock3 size={13} />
                                                    {formatTime(dateValue)}
                                                </span>

                                                {notification.read && (
                                                    <span className="inline-flex items-center gap-1 text-blue-600">
                                                        <CheckCheck size={14} />
                                                        Read
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mark as Read */}
                                        {!notification.read && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleMarkAsRead(notification)
                                                }
                                                disabled={isMarking}
                                                aria-label={`Mark ${
                                                    notification.title ||
                                                    "notification"
                                                } as read`}
                                                title="Mark as read"
                                                className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-xl border border-green-200 bg-white text-green-700 transition hover:bg-green-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isMarking ? (
                                                    <RefreshCw
                                                        size={17}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Check size={19} />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer */}
                    {!loading && notifications.length > 0 && (
                        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <span>
                                Showing {filteredNotifications.length} of{" "}
                                {notifications.length} notifications
                            </span>

                            <button
                                type="button"
                                onClick={() => navigate("/farmer/dashboard")}
                                className="inline-flex items-center gap-1 self-start font-semibold text-green-700 transition hover:text-green-900 sm:self-auto"
                            >
                                Return to dashboard
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Helpful Footer Note */}
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50/70 p-4">
                    <Sprout
                        size={20}
                        className="mt-0.5 shrink-0 text-green-700"
                    />
                    <p className="text-sm leading-6 text-green-900">
                        <span className="font-semibold">
                            Stay connected with your farm.
                        </span>{" "}
                        Check notifications regularly for buyer responses,
                        payment confirmations, and delivery updates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
