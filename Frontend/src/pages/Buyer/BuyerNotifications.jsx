
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Bell,
    Check,
    CheckCheck,
    RefreshCw,
    AlertCircle,
    Inbox,
    Handshake,
    CreditCard,
    Truck,
    Sprout,
    Info,
} from "lucide-react";

import {getBuyerNotifications } from "../../services/notificationServices";

const API_URL = import.meta.env.VITE_API_URL;

const getNotificationIcon = (type) => {
    switch (type) {
        case "DEAL_OFFER":
        case "DEAL_ACCEPTED":
        case "DEAL_REJECTED":
            return Handshake;
        case "PAYMENT_RECEIVED":
            return CreditCard;
        case "DELIVERY_UPDATED":
            return Truck;
        case "PRODUCE":
            return Sprout;
        default:
            return Info;
    }
};

const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Date unavailable";
    }

    return parsedDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const BuyerNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const [markingId, setMarkingId] = useState(null);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchNotifications = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");
        setActionError("");
        setSuccessMessage("");

        try {
            const data = await getBuyerNotifications();
            setNotifications(data.notifications || []);
        } catch (err) {
            setError(err.message || "Unable to load notifications.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const unreadCount = useMemo(
        () => notifications.filter((item) => !item.read).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        if (filter === "UNREAD") {
            return notifications.filter((item) => !item.read);
        }

        return notifications;
    }, [notifications, filter]);

    const markAsRead = async (notificationId) => {
        setMarkingId(notificationId);
        setActionError("");
        setSuccessMessage("");

        try {
            const response = await fetch(
                `${API_URL}/notifications/${notificationId}/read`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to mark notification as read."
                );
            }

            setNotifications((current) =>
                current.map((item) =>
                    item._id === notificationId
                        ? { ...item, read: true }
                        : item
                )
            );

            setSuccessMessage("Notification marked as read.");
        } catch (err) {
            setActionError(
                err.message || "Unable to update notification."
            );
        } finally {
            setMarkingId(null);
        }
    };

    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        setMarkingAll(true);
        setActionError("");
        setSuccessMessage("");

        try {
            const response = await fetch(
                `${API_URL}/notifications/read-all`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to mark all notifications as read."
                );
            }

            setNotifications((current) =>
                current.map((item) => ({ ...item, read: true }))
            );

            setSuccessMessage("All notifications marked as read.");
        } catch (err) {
            setActionError(
                err.message || "Unable to update notifications."
            );
        } finally {
            setMarkingAll(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-20 animate-pulse rounded-2xl bg-white" />
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-28 animate-pulse rounded-2xl bg-white"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-green-700">
                        Buyer Portal
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Notifications
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Stay updated on your deals, payments, and deliveries.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => fetchNotifications(true)}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={markAllAsRead}
                        disabled={markingAll || unreadCount === 0}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCheck size={16} />
                        {markingAll ? "Updating..." : "Mark all read"}
                    </button>
                </div>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
                        <div>
                            <p className="font-semibold text-red-800">
                                Unable to load notifications
                            </p>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchNotifications()}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            )}

            {actionError && (
                <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {actionError}
                </div>
            )}

            {successMessage && (
                <div role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Notifications</p>
                        <Bell className="text-blue-600" size={21} />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {notifications.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Unread</p>
                        <Inbox className="text-amber-600" size={21} />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {unreadCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Read</p>
                        <CheckCheck className="text-green-600" size={21} />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {notifications.length - unreadCount}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                {[
                    { label: "All", value: "ALL" },
                    { label: `Unread (${unreadCount})`, value: "UNREAD" },
                ].map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => setFilter(option.value)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            filter === option.value
                                ? "bg-green-600 text-white"
                                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {!error && filteredNotifications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                        <Bell size={30} />
                    </div>

                    <h2 className="mt-5 text-lg font-bold text-gray-900">
                        {filter === "UNREAD"
                            ? "You're all caught up"
                            : "No notifications yet"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        {filter === "UNREAD"
                            ? "You have no unread notifications. New deal, payment, and delivery updates will appear here."
                            : "Updates about your deals, payments, and deliveries will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => {
                        const Icon = getNotificationIcon(notification.type);

                        return (
                            <article
                                key={notification._id}
                                className={`rounded-2xl border bg-white p-4 shadow-sm transition sm:p-5 ${
                                    notification.read
                                        ? "border-gray-100"
                                        : "border-green-200 bg-green-50/30"
                                }`}
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                            notification.read
                                                ? "bg-gray-100 text-gray-600"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >
                                        <Icon size={21} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="font-semibold text-gray-900">
                                                {notification.title}
                                            </h2>

                                            {!notification.read && (
                                                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                                                    NEW
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            {notification.message}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            {formatDate(notification.createdAt)}
                                        </p>
                                    </div>

                                    {!notification.read && (
                                        <button
                                            type="button"
                                            onClick={() => markAsRead(notification._id)}
                                            disabled={markingId === notification._id}
                                            title="Mark as read"
                                            aria-label={`Mark ${notification.title} as read`}
                                            className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:border-green-300 hover:text-green-700 disabled:opacity-50"
                                        >
                                            <Check size={15} />
                                            <span className="hidden sm:inline">
                                                {markingId === notification._id
                                                    ? "Saving..."
                                                    : "Mark read"}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BuyerNotifications;
