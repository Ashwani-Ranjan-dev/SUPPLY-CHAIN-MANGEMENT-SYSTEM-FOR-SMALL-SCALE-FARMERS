
import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Truck,
    Package,
    MapPin,
    CalendarDays,
    User,
    Phone,
    CheckCircle2,
    Clock,
    AlertCircle,
    LoaderCircle,
    Navigation,
} from "lucide-react";

import { getBuyerPooledDeliveries } from "../../services/pooledDeliveryServices";

const STATUS_STEPS = [
    "NOT_ASSIGNED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
];

const STATUS_LABELS = {
    NOT_ASSIGNED: "Not assigned",
    ASSIGNED: "Assigned",
    PICKED_UP: "Picked up",
    IN_TRANSIT: "In transit",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const getId = (value) => {
    if (!value) return "";
    return String(typeof value === "object" ? value._id : value);
};

const formatDate = (date) => {
    if (!date) return "Not scheduled";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Not scheduled";
    }

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatQuantity = (delivery) =>
    `${delivery.quantity ?? 0} ${delivery.unit ?? ""}`.trim();

const statusStyles = {
    NOT_ASSIGNED: "bg-gray-100 text-gray-700",
    ASSIGNED: "bg-blue-100 text-blue-700",
    PICKED_UP: "bg-indigo-100 text-indigo-700",
    IN_TRANSIT: "bg-amber-100 text-amber-800",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function BuyerPooledDeliveries() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadDeliveries = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result = await getBuyerPooledDeliveries();

            const records = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : Array.isArray(result?.deliveries)
                        ? result.deliveries
                        : [];

            setDeliveries(records);
        } catch (err) {
            setError(err.message || "Unable to load pooled deliveries.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDeliveries();
    }, [loadDeliveries]);

    const stats = {
        total: deliveries.length,
        inProgress: deliveries.filter((delivery) =>
            ["ASSIGNED", "PICKED_UP", "IN_TRANSIT"].includes(delivery.status)
        ).length,
        delivered: deliveries.filter(
            (delivery) => delivery.status === "DELIVERED"
        ).length,
        awaitingAssignment: deliveries.filter(
            (delivery) => delivery.status === "NOT_ASSIGNED"
        ).length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 py-24 text-gray-600">
                    <LoaderCircle className="animate-spin" size={24} />
                    <span>Loading your pooled deliveries...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-green-700">
                            <Truck size={24} />
                            <span className="text-sm font-semibold">
                                KRISHICONNECT / POOLED ORDERS
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Pooled Deliveries
                        </h1>

                        <p className="mt-2 text-sm text-gray-600">
                            Track delivery progress for your accepted and paid pooled deals.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadDeliveries(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={18}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold">
                                Could not load pooled deliveries
                            </p>
                            <p className="mt-1 text-sm">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => loadDeliveries(true)}
                            className="text-sm font-semibold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        {
                            label: "Total Deliveries",
                            value: stats.total,
                            icon: Package,
                            color: "text-green-700",
                            bg: "bg-green-50",
                        },
                        {
                            label: "In Progress",
                            value: stats.inProgress,
                            icon: Truck,
                            color: "text-blue-700",
                            bg: "bg-blue-50",
                        },
                        {
                            label: "Awaiting Assignment",
                            value: stats.awaitingAssignment,
                            icon: Clock,
                            color: "text-amber-700",
                            bg: "bg-amber-50",
                        },
                        {
                            label: "Delivered",
                            value: stats.delivered,
                            icon: CheckCircle2,
                            color: "text-emerald-700",
                            bg: "bg-emerald-50",
                        },
                    ].map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {stat.label}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>

                                    <div className={`rounded-xl p-3 ${stat.bg}`}>
                                        <Icon className={stat.color} size={24} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Delivery List */}
                {!error && deliveries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                            <Truck size={30} className="text-green-700" />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            No pooled deliveries yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                            Once an accepted pooled deal has been paid for and
                            a delivery is created, it will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {deliveries.map((delivery) => {
                            const status = delivery.status || "NOT_ASSIGNED";
                            const currentStep = STATUS_STEPS.indexOf(status);
                            const deal =
                                delivery.pooledDeal &&
                                typeof delivery.pooledDeal === "object"
                                    ? delivery.pooledDeal
                                    : null;

                            const lot =
                                delivery.pooledLot &&
                                typeof delivery.pooledLot === "object"
                                    ? delivery.pooledLot
                                    : null;

                            const partner = delivery.deliveryPartner || {};
                            const isCancelled = status === "CANCELLED";

                            return (
                                <article
                                    key={delivery._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* Card Header */}
                                    <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-xl bg-green-50 p-3">
                                                <Package
                                                    size={23}
                                                    className="text-green-700"
                                                />
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">
                                                    {delivery.crop ||
                                                        lot?.crop ||
                                                        "Pooled crop order"}
                                                </h2>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Delivery ID:{" "}
                                                    {String(delivery._id).slice(-8).toUpperCase()}
                                                </p>

                                                <p className="mt-1 text-sm text-gray-600">
                                                    Quantity: {formatQuantity(delivery)}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[status] || statusStyles.NOT_ASSIGNED}`}
                                        >
                                            {STATUS_LABELS[status] || status}
                                        </span>
                                    </div>

                                    <div className="space-y-6 p-5">
                                        {/* Progress */}
                                        {isCancelled ? (
                                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                                This pooled delivery has been cancelled.
                                            </div>
                                        ) : (
                                            <div>
                                                <h3 className="mb-4 text-sm font-semibold text-gray-800">
                                                    Delivery Progress
                                                </h3>

                                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                                                    {STATUS_STEPS.map((step, index) => {
                                                        const completed =
                                                            currentStep >= index;
                                                        const isCurrent =
                                                            currentStep === index;

                                                        return (
                                                            <div
                                                                key={step}
                                                                className="flex items-start gap-2 sm:flex-col sm:items-center sm:text-center"
                                                            >
                                                                <div
                                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                                                        completed
                                                                            ? "bg-green-600 text-white"
                                                                            : "bg-gray-100 text-gray-400"
                                                                    }`}
                                                                >
                                                                    {completed ? (
                                                                        <CheckCircle2 size={19} />
                                                                    ) : (
                                                                        <span className="text-sm font-semibold">
                                                                            {index + 1}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    <p
                                                                        className={`text-sm font-semibold ${
                                                                            isCurrent
                                                                                ? "text-green-700"
                                                                                : completed
                                                                                    ? "text-gray-800"
                                                                                    : "text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {STATUS_LABELS[step]}
                                                                    </p>

                                                                    {isCurrent && (
                                                                        <p className="mt-1 text-xs text-green-700">
                                                                            Current stage
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Delivery Details */}
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <MapPin
                                                        size={19}
                                                        className="text-green-700"
                                                    />
                                                    <h3 className="font-semibold text-gray-900">
                                                        Delivery Destination
                                                    </h3>
                                                </div>

                                                <p className="text-sm text-gray-700">
                                                    {delivery.deliveryLocation ||
                                                        "Destination not provided"}
                                                </p>

                                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                                    <Navigation size={16} />
                                                    <span>
                                                        Pickup:{" "}
                                                        {delivery.pickupLocation ||
                                                            lot?.location ||
                                                            "Not available"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <Truck
                                                        size={19}
                                                        className="text-green-700"
                                                    />
                                                    <h3 className="font-semibold text-gray-900">
                                                        Delivery Partner
                                                    </h3>
                                                </div>

                                                {partner.name || partner.phone ? (
                                                    <div className="space-y-2 text-sm text-gray-700">
                                                        <p className="flex items-center gap-2">
                                                            <User size={16} />
                                                            {partner.name || "Name not provided"}
                                                        </p>

                                                        {partner.phone && (
                                                            <p className="flex items-center gap-2">
                                                                <Phone size={16} />
                                                                {partner.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        A delivery partner has not
                                                        been assigned yet.
                                                    </p>
                                                )}

                                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                                    <CalendarDays size={16} />
                                                    <span>
                                                        Estimated delivery:{" "}
                                                        {formatDate(
                                                            delivery.estimatedDeliveryDate
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deal and delivery information */}
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                            <span className="rounded-lg border border-gray-200 px-3 py-2">
                                                Deal status:{" "}
                                                <strong>
                                                    {deal?.status || "Unavailable"}
                                                </strong>
                                            </span>

                                            <span className="rounded-lg border border-gray-200 px-3 py-2">
                                                Payment:{" "}
                                                <strong>
                                                    {delivery.paymentStatus || "Unavailable"}
                                                </strong>
                                            </span>

                                            <span className="rounded-lg border border-gray-200 px-3 py-2">
                                                Created:{" "}
                                                <strong>
                                                    {formatDate(delivery.createdAt)}
                                                </strong>
                                            </span>
                                        </div>

                                        {delivery.notes && (
                                            <div className="rounded-xl border border-gray-200 p-4">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    Delivery Notes
                                                </p>
                                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                                                    {delivery.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
