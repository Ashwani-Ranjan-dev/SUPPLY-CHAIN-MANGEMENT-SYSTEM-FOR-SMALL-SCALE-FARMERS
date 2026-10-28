import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    RefreshCw,
    Truck,
    MapPin,
    Package,
    CalendarDays,
    User,
    Phone,
    CheckCircle2,
    AlertCircle,
    Clock,
    LoaderCircle,
    Navigation,
    Save,
    Leaf,
    Handshake,
    Sparkles,
    ArrowRight,
    Check,
    Boxes,
} from "lucide-react";

import {
    getFarmerPooledDeliveries,
    updatePooledDeliveryStatus,
} from "../../services/pooledDeliveryServices";

const STATUS_FLOW = [
    "NOT_ASSIGNED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
];

const STATUS_STYLES = {
    NOT_ASSIGNED: "bg-gray-100 text-gray-700 ring-gray-200",
    ASSIGNED: "bg-purple-50 text-purple-700 ring-purple-200",
    PICKED_UP: "bg-amber-50 text-amber-700 ring-amber-200",
    IN_TRANSIT: "bg-blue-50 text-blue-700 ring-blue-200",
    DELIVERED: "bg-green-50 text-green-700 ring-green-200",
    CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

const STATUS_LABELS = {
    NOT_ASSIGNED: "Not Assigned",
    ASSIGNED: "Assigned",
    PICKED_UP: "Picked Up",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const formatDate = (date) => {
    if (!date) return "Not scheduled";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not scheduled";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getId = (value) => {
    if (!value) return "";

    return String(
        typeof value === "object" ? value._id || "" : value
    );
};

const getInputDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getToday = () => getInputDate(new Date());

const FarmerPooledDeliveries = () => {
    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [forms, setForms] = useState({});

    // --------------------------------------------------
    // Fetch pooled deliveries
    // --------------------------------------------------
    const loadDeliveries = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result = await getFarmerPooledDeliveries();
            const data = result?.data ?? result;

            if (!Array.isArray(data)) {
                throw new Error(
                    "The server returned an unexpected delivery response."
                );
            }

            setDeliveries(data);
        } catch (err) {
            console.error("Error loading pooled deliveries:", err);

            setError(
                err?.response?.data?.message ||
                    err.message ||
                    "Unable to load pooled deliveries."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDeliveries();
    }, [loadDeliveries]);

    // --------------------------------------------------
    // Form state
    // --------------------------------------------------
    const updateForm = (deliveryId, field, value) => {
        setForms((previous) => ({
            ...previous,
            [deliveryId]: {
                ...(previous[deliveryId] || {}),
                [field]: value,
            },
        }));
    };

    // --------------------------------------------------
    // Update delivery status
    // --------------------------------------------------
    const handleUpdate = async (delivery) => {
        const deliveryId = delivery._id;
        const form = forms[deliveryId] || {};
        const currentStatus = delivery.status || "NOT_ASSIGNED";

        if (updatingId) return;

        const currentIndex = STATUS_FLOW.indexOf(currentStatus);

        if (currentIndex === -1) {
            setError(
                `Delivery cannot be advanced from status ${currentStatus}.`
            );
            return;
        }

        if (currentStatus === "DELIVERED") {
            setError("This delivery has already been completed.");
            return;
        }

        if (currentStatus === "CANCELLED") {
            setError("A cancelled delivery cannot be updated.");
            return;
        }

        const nextStatus = STATUS_FLOW[currentIndex + 1];

        if (!nextStatus) {
            setError("No further delivery status is available.");
            return;
        }

        const partnerName = (
            form.partnerName ??
            delivery.deliveryPartner?.name ??
            ""
        ).trim();

        const partnerPhone = (
            form.partnerPhone ??
            delivery.deliveryPartner?.phone ??
            ""
        ).trim();

        if (nextStatus === "ASSIGNED" && !partnerName) {
            setError("Enter the delivery partner's name before assigning.");
            return;
        }

        if (nextStatus === "ASSIGNED" && !partnerPhone) {
            setError(
                "Enter the delivery partner's phone number before assigning."
            );
            return;
        }

        setUpdatingId(deliveryId);
        setError("");
        setSuccess("");

        try {
            const payload = {
                status: nextStatus,
                partnerName,
                partnerPhone,
                estimatedDeliveryDate:
                    form.estimatedDeliveryDate ??
                    getInputDate(delivery.estimatedDeliveryDate),
                notes: (
                    form.notes ??
                    delivery.notes ??
                    ""
                ).trim(),
            };

            const result = await updatePooledDeliveryStatus(
                deliveryId,
                payload
            );

            setSuccess(
                result?.message ||
                    `Delivery updated to ${STATUS_LABELS[nextStatus]}.`
            );

            await loadDeliveries(true);
        } catch (err) {
            console.error("Error updating pooled delivery:", err);

            setError(
                err?.response?.data?.message ||
                    err.message ||
                    "Unable to update pooled delivery."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // --------------------------------------------------
    // Statistics
    // --------------------------------------------------
    const activeCount = deliveries.filter(
        (delivery) =>
            !["DELIVERED", "CANCELLED"].includes(delivery.status)
    ).length;

    const completedCount = deliveries.filter(
        (delivery) => delivery.status === "DELIVERED"
    ).length;

    const cancelledCount = deliveries.filter(
        (delivery) => delivery.status === "CANCELLED"
    ).length;

    // --------------------------------------------------
    // Loading screen
    // --------------------------------------------------
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f8f3] p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="h-10 w-44 animate-pulse rounded-xl bg-gray-200" />

                    <div className="h-48 animate-pulse rounded-3xl bg-green-100" />

                    <div className="grid gap-4 sm:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
                            />
                        ))}
                    </div>

                    <div className="h-72 animate-pulse rounded-2xl bg-white shadow-sm" />

                    <p className="animate-pulse text-center text-sm text-gray-500">
                        Preparing your delivery dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f8f3] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Back button */}
                <button
                    type="button"
                    onClick={() => navigate("/farmer/dashboard")}
                    className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-green-300 hover:bg-green-50 hover:text-green-800"
                >
                    <ArrowLeft
                        size={18}
                        className="transition-transform duration-300 group-hover:-translate-x-1"
                    />
                    Back to Dashboard
                </button>

                {/* Hero header */}
                <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 p-6 text-white shadow-xl sm:p-8 lg:p-10">
                    {/* Decorative elements */}
                    <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full border-[32px] border-white/5" />
                    <div className="pointer-events-none absolute -bottom-24 right-32 -z-10 h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-green-50 backdrop-blur-sm">
                                <Leaf size={15} />
                                KRISHICONNECT
                                <span className="h-1 w-1 rounded-full bg-lime-300" />
                                FARMER PORTAL
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                Pooled Deliveries
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-green-50 sm:text-base">
                                One harvest, shared journeys. Manage your
                                pooled orders, coordinate delivery partners,
                                and keep every shipment moving.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-green-800 shadow-md">
                                    <Boxes size={17} />
                                    {deliveries.length}{" "}
                                    {deliveries.length === 1
                                        ? "delivery"
                                        : "deliveries"}
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
                                    <Handshake size={17} />
                                    Shared logistics
                                </div>
                            </div>
                        </div>

                        <div className="hidden shrink-0 items-center justify-center lg:flex">
                            <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-3 hover:scale-105">
                                <Truck
                                    size={76}
                                    strokeWidth={1.2}
                                    className="text-lime-200"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="flex animate-[fadeIn_.3s_ease-out] items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
                    >
                        <AlertCircle
                            size={21}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div className="flex-1 leading-6">{error}</div>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            className="rounded-lg px-2 py-1 font-semibold text-red-700 transition hover:bg-red-100"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Success message */}
                {success && (
                    <div
                        role="status"
                        className="flex animate-[fadeIn_.3s_ease-out] items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm"
                    >
                        <CheckCircle2
                            size={21}
                            className="mt-0.5 shrink-0 text-green-600"
                        />

                        <div className="flex-1 leading-6">{success}</div>

                        <button
                            type="button"
                            onClick={() => setSuccess("")}
                            className="rounded-lg px-2 py-1 font-semibold text-green-700 transition hover:bg-green-100"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Statistics */}
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Deliveries"
                        value={deliveries.length}
                        subtitle="All pooled shipments"
                        icon={Package}
                        color="text-blue-700"
                        bg="bg-blue-50"
                        border="border-blue-100"
                        delay="0ms"
                    />

                    <StatCard
                        title="Active Deliveries"
                        value={activeCount}
                        subtitle="Still in progress"
                        icon={Truck}
                        color="text-amber-700"
                        bg="bg-amber-50"
                        border="border-amber-100"
                        delay="80ms"
                    />

                    <StatCard
                        title="Successfully Delivered"
                        value={completedCount}
                        subtitle="Completed shipments"
                        icon={CheckCircle2}
                        color="text-green-700"
                        bg="bg-green-50"
                        border="border-green-100"
                        delay="160ms"
                    />
                </section>

                {cancelledCount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <AlertCircle size={16} className="text-red-500" />
                        {cancelledCount} cancelled{" "}
                        {cancelledCount === 1 ? "delivery" : "deliveries"}
                    </div>
                )}

                {/* Section heading and refresh */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-800">
                                <Navigation size={19} />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                                Your delivery activity
                            </h2>
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Track progress and update your delivery details.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadDeliveries(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        {refreshing ? "Refreshing..." : "Refresh deliveries"}
                    </button>
                </div>

                {/* Empty state */}
                {deliveries.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-green-200 bg-white px-5 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 transition-transform duration-300 hover:scale-105">
                            <Truck size={36} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            Your delivery journey starts here
                        </h2>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-500">
                            Deliveries associated with your accepted pooled
                            contributions will appear here after payment has
                            been confirmed.
                        </p>

                        <button
                            type="button"
                            onClick={() => loadDeliveries(true)}
                            disabled={refreshing}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg disabled:opacity-60"
                        >
                            <RefreshCw
                                size={17}
                                className={refreshing ? "animate-spin" : ""}
                            />
                            Check for deliveries
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {deliveries.map((delivery, index) => {
                            const form = forms[delivery._id] || {};

                            const deal =
                                delivery.pooledDeal &&
                                typeof delivery.pooledDeal === "object"
                                    ? delivery.pooledDeal
                                    : {};

                            const lot =
                                delivery.pooledLot &&
                                typeof delivery.pooledLot === "object"
                                    ? delivery.pooledLot
                                    : {};

                            const buyer =
                                delivery.buyer &&
                                typeof delivery.buyer === "object"
                                    ? delivery.buyer
                                    : {};

                            const currentStatus =
                                delivery.status || "NOT_ASSIGNED";

                            const currentIndex =
                                STATUS_FLOW.indexOf(currentStatus);

                            const terminal = [
                                "DELIVERED",
                                "CANCELLED",
                            ].includes(currentStatus);

                            const nextStatus =
                                currentIndex >= 0
                                    ? STATUS_FLOW[currentIndex + 1]
                                    : null;

                            const statusIndex = Math.max(currentIndex, 0);
                            const progress =
                                currentStatus === "CANCELLED"
                                    ? 0
                                    : currentIndex >= 0
                                    ? (statusIndex / (STATUS_FLOW.length - 1)) * 100
                                    : 0;

                            return (
                                <section
                                    key={delivery._id}
                                    style={{
                                        animationDelay: `${Math.min(
                                            index * 80,
                                            400
                                        )}ms`,
                                    }}
                                    className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg motion-safe:animate-[fadeIn_.45s_ease-out_both]"
                                >
                                    {/* Delivery card header */}
                                    <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-white via-white to-green-50/70 p-5 sm:p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="flex min-w-0 items-start gap-4">
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800 shadow-sm transition-transform duration-300 hover:rotate-3 hover:scale-105">
                                                    <Package size={27} />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="mb-1 flex flex-wrap items-center gap-2">
                                                        <span className="text-xs font-semibold uppercase tracking-wider text-green-700">
                                                            Shipment #{index + 1}
                                                        </span>

                                                        {currentStatus ===
                                                            "IN_TRANSIT" && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                                                                On the move
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                                                        {delivery.crop ||
                                                            lot.crop ||
                                                            "Pooled Produce"}
                                                    </h3>

                                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <Package
                                                                size={15}
                                                                className="text-green-700"
                                                            />
                                                            {delivery.quantity ?? 0}{" "}
                                                            {delivery.unit ||
                                                                lot.unit ||
                                                                ""}
                                                        </span>

                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin
                                                                size={15}
                                                                className="text-green-700"
                                                            />
                                                            {delivery.pickupLocation ||
                                                                lot.location ||
                                                                "Pickup unavailable"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${
                                                    STATUS_STYLES[currentStatus] ||
                                                    STATUS_STYLES.NOT_ASSIGNED
                                                }`}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {STATUS_LABELS[currentStatus] ||
                                                    currentStatus.replaceAll(
                                                        "_",
                                                        " "
                                                    )}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-400">
                                            <span className="break-all">
                                                Delivery ID: {delivery._id}
                                            </span>

                                            {getId(
                                                deal._id || delivery.pooledDeal
                                            ) && (
                                                <span className="break-all">
                                                    Pooled Deal:{" "}
                                                    {getId(
                                                        deal._id ||
                                                            delivery.pooledDeal
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-6 p-5 sm:p-6">
                                        {/* Delivery progress */}
                                        <div>
                                            <div className="mb-4 flex items-center justify-between gap-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">
                                                        Delivery timeline
                                                    </h4>
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Follow every step from
                                                        assignment to arrival.
                                                    </p>
                                                </div>

                                                {!terminal && (
                                                    <span className="shrink-0 text-sm font-bold text-green-700">
                                                        {Math.round(progress)}%
                                                    </span>
                                                )}
                                            </div>

                                            {!terminal && (
                                                <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                                {STATUS_FLOW.map(
                                                    (status, stepIndex) => {
                                                        const isDone =
                                                            currentIndex >= 0 &&
                                                            stepIndex <=
                                                                currentIndex;

                                                        const isCurrent =
                                                            status ===
                                                            currentStatus;

                                                        return (
                                                            <div
                                                                key={status}
                                                                className={`relative rounded-2xl border p-3 transition-all duration-300 ${
                                                                    isCurrent
                                                                        ? "border-green-300 bg-green-50 shadow-sm"
                                                                        : isDone
                                                                        ? "border-green-100 bg-green-50/50"
                                                                        : "border-gray-100 bg-gray-50"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300 ${
                                                                        isDone
                                                                            ? "bg-green-600 text-white"
                                                                            : "bg-gray-200 text-gray-500"
                                                                    }`}
                                                                >
                                                                    {isDone ? (
                                                                        <Check
                                                                            size={18}
                                                                            strokeWidth={2.5}
                                                                        />
                                                                    ) : (
                                                                        <Clock
                                                                            size={17}
                                                                        />
                                                                    )}
                                                                </div>

                                                                <p
                                                                    className={`text-xs font-bold leading-5 ${
                                                                        isDone
                                                                            ? "text-green-800"
                                                                            : "text-gray-500"
                                                                    }`}
                                                                >
                                                                    {STATUS_LABELS[
                                                                        status
                                                                    ]}
                                                                </p>

                                                                {isCurrent && (
                                                                    <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-wide text-green-700">
                                                                        Current
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            {currentStatus === "CANCELLED" && (
                                                <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                                                    <AlertCircle
                                                        size={19}
                                                        className="mt-0.5 shrink-0"
                                                    />
                                                    <p>
                                                        This delivery is
                                                        cancelled and cannot
                                                        be advanced.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Buyer and destination details */}
                                        <div className="grid gap-4 lg:grid-cols-2">
                                            <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-colors duration-200 hover:border-green-200 sm:p-5">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                        <User size={20} />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">
                                                            Buyer information
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            Order contact
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="font-semibold text-gray-800">
                                                    {buyer.name || "Buyer"}
                                                </p>

                                                {buyer.phone ? (
                                                    <a
                                                        href={`tel:${buyer.phone}`}
                                                        className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-green-700"
                                                    >
                                                        <Phone size={14} />
                                                        {buyer.phone}
                                                    </a>
                                                ) : (
                                                    <p className="mt-2 text-sm text-gray-400">
                                                        Phone unavailable
                                                    </p>
                                                )}

                                                {buyer.village && (
                                                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin size={14} />
                                                        {buyer.village}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="rounded-2xl border border-gray-100 bg-white p-4 transition-colors duration-200 hover:border-green-200 sm:p-5">
                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                                        <Navigation size={20} />
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-900">
                                                            Delivery destination
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            Drop-off information
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="text-sm leading-6 text-gray-700">
                                                    {delivery.deliveryLocation ||
                                                        "Destination unavailable"}
                                                </p>

                                                <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
                                                    <CalendarDays
                                                        size={16}
                                                        className="shrink-0 text-green-700"
                                                    />
                                                    <span>
                                                        Estimated arrival:{" "}
                                                        <strong className="text-gray-800">
                                                            {formatDate(
                                                                delivery.estimatedDeliveryDate
                                                            )}
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delivery update form */}
                                        {!terminal && nextStatus && (
                                            <div className="overflow-hidden rounded-2xl border border-green-100 bg-gradient-to-br from-green-50/80 to-white">
                                                <div className="border-b border-green-100 px-4 py-4 sm:px-5">
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white shadow-sm">
                                                                <Truck size={20} />
                                                            </div>

                                                            <div>
                                                                <h4 className="font-bold text-gray-900">
                                                                    Update shipment
                                                                </h4>
                                                                <p className="mt-0.5 text-xs text-gray-500">
                                                                    Keep delivery
                                                                    details accurate.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2 text-xs font-semibold text-green-800">
                                                            <ArrowRight
                                                                size={15}
                                                            />
                                                            Next:{" "}
                                                            {STATUS_LABELS[
                                                                nextStatus
                                                            ]}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <FormField
                                                            label="Delivery partner name"
                                                            htmlFor={`partner-name-${delivery._id}`}
                                                        >
                                                            <input
                                                                id={`partner-name-${delivery._id}`}
                                                                type="text"
                                                                autoComplete="name"
                                                                value={
                                                                    form.partnerName ??
                                                                    delivery
                                                                        .deliveryPartner
                                                                        ?.name ??
                                                                    ""
                                                                }
                                                                onChange={(event) =>
                                                                    updateForm(
                                                                        delivery._id,
                                                                        "partnerName",
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Enter partner name"
                                                                className="form-input"
                                                            />
                                                        </FormField>

                                                        <FormField
                                                            label="Delivery partner phone"
                                                            htmlFor={`partner-phone-${delivery._id}`}
                                                        >
                                                            <input
                                                                id={`partner-phone-${delivery._id}`}
                                                                type="tel"
                                                                autoComplete="tel"
                                                                value={
                                                                    form.partnerPhone ??
                                                                    delivery
                                                                        .deliveryPartner
                                                                        ?.phone ??
                                                                    ""
                                                                }
                                                                onChange={(event) =>
                                                                    updateForm(
                                                                        delivery._id,
                                                                        "partnerPhone",
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Enter contact number"
                                                                className="form-input"
                                                            />
                                                        </FormField>

                                                        <FormField
                                                            label="Estimated delivery date"
                                                            htmlFor={`eta-${delivery._id}`}
                                                        >
                                                            <input
                                                                id={`eta-${delivery._id}`}
                                                                type="date"
                                                                min={getToday()}
                                                                value={
                                                                    form.estimatedDeliveryDate ??
                                                                    getInputDate(
                                                                        delivery.estimatedDeliveryDate
                                                                    )
                                                                }
                                                                onChange={(event) =>
                                                                    updateForm(
                                                                        delivery._id,
                                                                        "estimatedDeliveryDate",
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="form-input"
                                                            />
                                                        </FormField>

                                                        <FormField
                                                            label="Delivery notes"
                                                            htmlFor={`notes-${delivery._id}`}
                                                        >
                                                            <input
                                                                id={`notes-${delivery._id}`}
                                                                type="text"
                                                                value={
                                                                    form.notes ??
                                                                    delivery.notes ??
                                                                    ""
                                                                }
                                                                onChange={(event) =>
                                                                    updateForm(
                                                                        delivery._id,
                                                                        "notes",
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Optional delivery instructions"
                                                                className="form-input"
                                                            />
                                                        </FormField>
                                                    </div>

                                                    <div className="mt-5 flex flex-col gap-3 border-t border-green-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                                        <p className="text-xs leading-5 text-gray-500">
                                                            Review the details
                                                            before confirming
                                                            this status update.
                                                        </p>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleUpdate(
                                                                    delivery
                                                                )
                                                            }
                                                            disabled={
                                                                updatingId !==
                                                                null
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {updatingId ===
                                                            delivery._id ? (
                                                                <>
                                                                    <LoaderCircle
                                                                        size={17}
                                                                        className="animate-spin"
                                                                    />
                                                                    Updating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save
                                                                        size={17}
                                                                    />
                                                                    Confirm{" "}
                                                                    {
                                                                        STATUS_LABELS[
                                                                            nextStatus
                                                                        ]
                                                                    }
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Delivered state */}
                                        {currentStatus === "DELIVERED" && (
                                            <div className="flex items-start gap-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-sm">
                                                    <CheckCircle2 size={24} />
                                                </div>

                                                <div>
                                                    <p className="font-bold text-green-900">
                                                        Delivery completed
                                                    </p>

                                                    <p className="mt-1 text-sm leading-6 text-green-800">
                                                        This shipment has reached
                                                        its completed status.
                                                    </p>

                                                    <p className="mt-2 text-xs text-green-700">
                                                        Delivered at:{" "}
                                                        {formatDate(
                                                            delivery.deliveredAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}

                {/* Bottom note */}
                <div className="flex flex-col gap-4 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                            <Sparkles size={20} />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900">
                                Every delivery counts
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-gray-500">
                                Keep partner information and delivery progress
                                up to date for smoother pooled logistics.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/farmer/dashboard")}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
                    >
                        <ArrowLeft size={16} />
                        Dashboard
                    </button>
                </div>
            </div>

            {/* Reusable input styling */}
            <style>{`
                .form-input {
                    width: 100%;
                    border: 1px solid #d1d5db;
                    border-radius: 0.75rem;
                    background: #fff;
                    padding: 0.75rem 0.875rem;
                    font-size: 0.875rem;
                    color: #111827;
                    outline: none;
                    transition: border-color 180ms ease, box-shadow 180ms ease;
                }

                .form-input::placeholder {
                    color: #9ca3af;
                }

                .form-input:focus {
                    border-color: #16a34a;
                    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>
        </div>
    );
};

// --------------------------------------------------
// Reusable statistic card
// --------------------------------------------------
const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    bg,
    border,
    delay = "0ms",
}) => (
    <div
        style={{ animationDelay: delay }}
        className={`rounded-2xl border ${border} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md motion-safe:animate-[fadeIn_.45s_ease-out_both]`}
    >
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                    {value}
                </p>

                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </div>

            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bg} ${color} transition-transform duration-300 hover:rotate-6 hover:scale-110`}
            >
                <Icon size={23} />
            </div>
        </div>
    </div>
);

// --------------------------------------------------
// Reusable form field
// --------------------------------------------------
const FormField = ({ label, htmlFor, children }) => (
    <div>
        <label
            htmlFor={htmlFor}
            className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
            {label}
        </label>

        {children}
    </div>
);

export default FarmerPooledDeliveries;
