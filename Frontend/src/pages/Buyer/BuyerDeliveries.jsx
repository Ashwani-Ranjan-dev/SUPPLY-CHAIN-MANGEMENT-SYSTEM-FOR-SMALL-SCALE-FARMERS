import { useCallback, useEffect, useState } from "react";
import {
    Truck,
    Package,
    MapPin,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    CreditCard,
    IndianRupee,
    Sprout,
    UserRound,
    CalendarDays,
    ArrowRight,
    Leaf,
    Clock3,
} from "lucide-react";

import { getBuyerDeliveries } from "../../services/deliveryServices";

const deliveryStages = [
    "NOT_ASSIGNED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "DELIVERED",
];

const statusStyles = {
    NOT_ASSIGNED: "bg-gray-100 text-gray-700 ring-gray-200",
    ASSIGNED: "bg-blue-50 text-blue-700 ring-blue-200",
    PICKED_UP: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    IN_TRANSIT: "bg-amber-50 text-amber-700 ring-amber-200",
    DELIVERED: "bg-green-50 text-green-700 ring-green-200",
    CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

const paymentStyles = {
    PAID: "bg-green-50 text-green-700 ring-green-200",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
};

const formatStatus = (status = "") =>
    status.replaceAll("_", " ");

const formatCurrency = (amount = 0) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const DeliveryBadge = ({ status }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset transition-transform duration-200 hover:scale-105 ${
            statusStyles[status] ||
            "bg-gray-100 text-gray-700 ring-gray-200"
        }`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${
                status === "DELIVERED"
                    ? "bg-green-500"
                    : status === "IN_TRANSIT"
                      ? "animate-pulse bg-amber-500"
                      : status === "CANCELLED"
                        ? "bg-red-500"
                        : "bg-current"
            }`}
        />
        {formatStatus(status)}
    </span>
);

const PaymentBadge = ({ status }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset transition-transform duration-200 hover:scale-105 ${
            paymentStyles[status] ||
            "bg-gray-100 text-gray-700 ring-gray-200"
        }`}
    >
        <CreditCard size={13} />
        {formatStatus(status || "PENDING")}
    </span>
);

const DeliveryProgress = ({ status }) => {
    if (status === "CANCELLED") {
        return (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700 animate-[deliveryFadeIn_0.5s_ease-out]">
                <AlertCircle size={20} className="shrink-0" />
                <div>
                    <p className="font-bold">Delivery cancelled</p>
                    <p className="mt-1 text-red-600">
                        This delivery has been cancelled.
                    </p>
                </div>
            </div>
        );
    }

    const currentIndex = deliveryStages.indexOf(status);

    return (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 sm:p-5">
            <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-100 p-2 text-green-700">
                        <Truck size={17} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">
                            Delivery journey
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-500">
                            Track your order progress
                        </p>
                    </div>
                </div>

                {status === "DELIVERED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                        <CheckCircle2 size={13} />
                        Completed
                    </span>
                ) : currentIndex >= 0 ? (
                    <span className="text-xs font-semibold text-gray-500">
                        Step {currentIndex + 1} of {deliveryStages.length}
                    </span>
                ) : null}
            </div>

            <div className="relative grid grid-cols-5 gap-1">
                <div className="absolute left-[10%] right-[10%] top-4 h-1 rounded-full bg-gray-200" />

                <div
                    className="absolute left-[10%] top-4 h-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700 ease-out"
                    style={{
                        width:
                            currentIndex > 0
                                ? `${(currentIndex / (deliveryStages.length - 1)) * 80}%`
                                : "0%",
                    }}
                />

                {deliveryStages.map((stage, index) => {
                    const completed =
                        currentIndex >= 0 && index <= currentIndex;

                    const isCurrent = index === currentIndex;

                    return (
                        <div
                            key={stage}
                            className="relative z-10 min-w-0 text-center"
                            style={{
                                animation: `deliveryFadeIn 0.45s ease-out ${
                                    index * 100
                                }ms both`,
                            }}
                        >
                            <div
                                className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                    completed
                                        ? "scale-105 border-green-600 bg-green-600 text-white shadow-md shadow-green-200"
                                        : "border-gray-200 bg-white text-gray-400"
                                } ${
                                    isCurrent
                                        ? "ring-4 ring-green-100"
                                        : ""
                                }`}
                            >
                                {completed && index === deliveryStages.length - 1 ? (
                                    <CheckCircle2 size={16} />
                                ) : completed ? (
                                    <CheckCircle2 size={15} />
                                ) : (
                                    <span className="text-xs font-bold">
                                        {index + 1}
                                    </span>
                                )}
                            </div>

                            <p
                                className={`mx-auto mt-3 max-w-20 break-words text-[9px] leading-4 sm:text-xs ${
                                    isCurrent
                                        ? "font-extrabold text-green-700"
                                        : completed
                                          ? "font-semibold text-gray-700"
                                          : "text-gray-400"
                                }`}
                            >
                                {formatStatus(stage)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const BuyerDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const fetchDeliveries = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const data = await getBuyerDeliveries();
            setDeliveries(data.deliveries || []);
        } catch (err) {
            setError(err.message || "Unable to load deliveries.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDeliveries();
    }, [fetchDeliveries]);

    const totalDeliveries = deliveries.length;

    const inTransit = deliveries.filter(
        (item) =>
            item.status === "IN_TRANSIT" ||
            item.status === "PICKED_UP"
    ).length;

    const delivered = deliveries.filter(
        (item) => item.status === "DELIVERED"
    ).length;

    const paid = deliveries.filter(
        (item) => item.paymentStatus === "PAID"
    ).length;

    const summaryCards = [
        {
            label: "Total Deliveries",
            value: totalDeliveries,
            icon: Package,
            color: "bg-blue-50 text-blue-600",
            accent: "from-blue-500 to-cyan-400",
            description: "All your orders",
        },
        {
            label: "In Transit",
            value: inTransit,
            icon: Truck,
            color: "bg-amber-50 text-amber-600",
            accent: "from-amber-500 to-orange-400",
            description: "Orders on the move",
        },
        {
            label: "Delivered",
            value: delivered,
            icon: CheckCircle2,
            color: "bg-green-50 text-green-600",
            accent: "from-green-500 to-emerald-400",
            description: "Successfully received",
        },
        {
            label: "Payments Completed",
            value: paid,
            icon: CreditCard,
            color: "bg-purple-50 text-purple-600",
            accent: "from-purple-500 to-pink-400",
            description: "Payments marked paid",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen space-y-7 bg-gray-50/70 p-4 sm:p-6 lg:p-8">
                <style>{`
                    @keyframes deliveryShimmer {
                        0% { background-position: -600px 0; }
                        100% { background-position: 600px 0; }
                    }
                    .delivery-skeleton {
                        background: linear-gradient(
                            90deg,
                            #f1f5f9 25%,
                            #e2e8f0 50%,
                            #f1f5f9 75%
                        );
                        background-size: 1200px 100%;
                        animation: deliveryShimmer 1.6s infinite linear;
                    }
                `}</style>

                <div className="space-y-3">
                    <div className="delivery-skeleton h-4 w-28 rounded" />
                    <div className="delivery-skeleton h-9 w-64 rounded-lg" />
                    <div className="delivery-skeleton h-4 w-80 max-w-full rounded" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                            <div className="delivery-skeleton h-4 w-32 rounded" />
                            <div className="delivery-skeleton mt-6 h-9 w-16 rounded" />
                            <div className="delivery-skeleton mt-3 h-3 w-36 rounded" />
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-gray-100 bg-white p-6"
                        >
                            <div className="delivery-skeleton h-6 w-48 rounded" />
                            <div className="delivery-skeleton mt-5 h-24 rounded-xl" />
                            <div className="delivery-skeleton mt-5 h-20 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-7 bg-gray-50/70 p-4 sm:p-6 lg:p-8">
            <style>{`
                @keyframes deliveryFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes deliverySlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes deliveryFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .delivery-enter {
                    animation: deliveryFadeIn 0.55s ease-out both;
                }

                .delivery-slide-in {
                    animation: deliverySlideIn 0.45s ease-out both;
                }

                .delivery-stat-card {
                    transition:
                        transform 250ms ease,
                        box-shadow 250ms ease,
                        border-color 250ms ease;
                }

                .delivery-stat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 16px 32px -18px rgba(22, 101, 52, 0.28);
                    border-color: #bbf7d0;
                }

                .delivery-card {
                    transition:
                        transform 250ms ease,
                        box-shadow 250ms ease,
                        border-color 250ms ease;
                }

                .delivery-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 18px 40px -24px rgba(15, 23, 42, 0.22);
                    border-color: #d1fae5;
                }

                @media (prefers-reduced-motion: reduce) {
                    .delivery-enter,
                    .delivery-slide-in,
                    .delivery-stat-card,
                    .delivery-card {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            {/* Page heading */}
            <section className="delivery-enter relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 p-6 text-white shadow-lg shadow-green-900/10 sm:p-8">
                <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-20 right-1/3 -z-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-2xl" />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-green-50 backdrop-blur-sm">
                            <Leaf size={14} />
                            Buyer Portal
                        </div>

                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                            My Deliveries
                        </h1>

                        <p className="mt-3 max-w-lg text-sm leading-6 text-green-50 sm:text-base">
                            Follow your farm-fresh orders from pickup to
                            doorstep. Every step, right here.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-green-50 sm:text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                                <Package size={15} />
                                {totalDeliveries} total orders
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                                <CheckCircle2 size={15} />
                                {delivered} delivered
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                        <div
                            className="hidden rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:block"
                            style={{
                                animation:
                                    "deliveryFloat 4s ease-in-out infinite",
                            }}
                        >
                            <Truck size={44} strokeWidth={1.5} />
                        </div>

                        <button
                            type="button"
                            onClick={() => fetchDeliveries(true)}
                            disabled={refreshing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-3 text-sm font-bold text-green-800 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <RefreshCw
                                size={16}
                                className={
                                    refreshing ? "animate-spin" : ""
                                }
                            />
                            {refreshing ? "Refreshing..." : "Refresh deliveries"}
                        </button>
                    </div>
                </div>
            </section>

            {/* Error state */}
            {error && (
                <div
                    role="alert"
                    className="delivery-slide-in flex flex-col gap-4 rounded-2xl border border-red-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
                            <AlertCircle size={21} />
                        </div>
                        <div>
                            <p className="font-bold text-red-800">
                                Could not load deliveries
                            </p>
                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fetchDeliveries()}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>
                </div>
            )}

            {/* Statistics */}
            <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Delivery overview
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            A quick look at your order activity
                        </p>
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 sm:inline-flex">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Live overview
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card, index) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="delivery-stat-card relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                style={{
                                    animation: `deliveryFadeIn 0.5s ease-out ${
                                        index * 100
                                    }ms both`,
                                }}
                            >
                                <div
                                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`}
                                />

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            {card.label}
                                        </p>
                                        <p className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900">
                                            {card.value}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-400">
                                            {card.description}
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-2xl p-3 transition duration-300 group-hover:rotate-3 ${card.color}`}
                                    >
                                        <Icon size={23} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Delivery list */}
            {!error && deliveries.length === 0 ? (
                <section className="delivery-enter relative overflow-hidden rounded-3xl border border-dashed border-green-200 bg-white px-6 py-14 text-center shadow-sm sm:py-16">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-50" />
                    <div className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-emerald-50" />

                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-emerald-50 text-green-700 shadow-inner">
                        <Truck
                            size={36}
                            strokeWidth={1.6}
                            style={{
                                animation:
                                    "deliveryFloat 3s ease-in-out infinite",
                            }}
                        />
                    </div>

                    <h2 className="relative mt-6 text-xl font-extrabold text-gray-900">
                        No deliveries yet
                    </h2>

                    <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                        Once a farmer accepts your deal and a delivery is
                        created, you can track its progress here. Your
                        upcoming orders will appear in this space.
                    </p>

                    <div className="relative mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                        <Sprout size={15} />
                        Your next delivery starts here
                    </div>
                </section>
            ) : (
                <section className="space-y-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Your orders
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                View order details and follow delivery progress
                            </p>
                        </div>

                        <span className="w-fit rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600">
                            {deliveries.length}{" "}
                            {deliveries.length === 1 ? "delivery" : "deliveries"}
                        </span>
                    </div>

                    {deliveries.map((delivery, index) => {
                        const crop =
                            delivery.produce?.crop || "Produce";
                        const farmer =
                            delivery.farmer?.name || "Farmer";
                        const amount =
                            delivery.deal?.totalAmount ?? 0;

                        return (
                            <article
                                key={delivery._id}
                                className="delivery-card overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                                style={{
                                    animation: `deliveryFadeIn 0.5s ease-out ${
                                        Math.min(index, 6) * 90
                                    }ms both`,
                                }}
                            >
                                {/* Card header */}
                                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 text-green-700 transition duration-300 hover:rotate-3 hover:scale-105">
                                            <Sprout size={28} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-extrabold text-gray-900">
                                                    {crop}
                                                </h3>
                                                <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                                    Order
                                                </span>
                                            </div>

                                            <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                                                <Package size={14} />
                                                <span className="font-semibold text-gray-700">
                                                    {delivery.quantity}{" "}
                                                    {delivery.unit}
                                                </span>
                                                <span className="text-gray-300">
                                                    •
                                                </span>
                                                <CalendarDays size={14} />
                                                {formatDate(delivery.createdAt)}
                                            </p>

                                            <p className="mt-2 break-all text-xs text-gray-400">
                                                ID: {delivery._id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                        <DeliveryBadge
                                            status={delivery.status}
                                        />
                                        <PaymentBadge
                                            status={delivery.paymentStatus}
                                        />
                                    </div>
                                </div>

                                {/* Delivery information */}
                                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition duration-200 hover:border-green-100 hover:bg-green-50/40">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                                                <UserRound size={17} />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Farmer details
                                            </p>
                                        </div>

                                        <p className="mt-4 font-bold text-gray-900">
                                            {farmer}
                                        </p>

                                        {delivery.farmer?.village && (
                                            <p className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                                                <MapPin
                                                    size={15}
                                                    className="mt-0.5 shrink-0"
                                                />
                                                {delivery.farmer.village}
                                            </p>
                                        )}

                                        {delivery.farmer?.phone && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                {delivery.farmer.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition duration-200 hover:border-green-100 hover:bg-green-50/40">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                                                <MapPin size={17} />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Delivery location
                                            </p>
                                        </div>

                                        <p className="mt-4 break-words font-bold text-gray-900">
                                            {delivery.deliveryLocation ||
                                                "Not specified"}
                                        </p>

                                        <div className="mt-3 border-t border-gray-200 pt-3">
                                            <p className="text-xs font-medium text-gray-400">
                                                PICKUP LOCATION
                                            </p>
                                            <p className="mt-1 break-words text-sm text-gray-600">
                                                {delivery.pickupLocation ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 transition duration-200 hover:border-green-100 hover:bg-green-50/40 sm:col-span-2 lg:col-span-1">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-lg bg-green-50 p-2 text-green-700">
                                                <IndianRupee size={17} />
                                            </div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Deal summary
                                            </p>
                                        </div>

                                        <p className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900">
                                            {formatCurrency(amount)}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 pt-3">
                                            <span className="text-xs text-gray-500">
                                                Deal status
                                            </span>
                                            {delivery.deal?.status ? (
                                                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-gray-700 ring-1 ring-gray-200">
                                                    {formatStatus(
                                                        delivery.deal.status
                                                    )}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    Unavailable
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Progress tracker */}
                                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                                    <DeliveryProgress
                                        status={delivery.status}
                                    />

                                    {delivery.deliveredAt && (
                                        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-sm text-green-800">
                                            <div className="rounded-xl bg-white p-2 text-green-600 shadow-sm">
                                                <CheckCircle2 size={19} />
                                            </div>
                                            <div>
                                                <p className="font-bold">
                                                    Order delivered successfully
                                                </p>
                                                <p className="mt-1 text-green-700">
                                                    Delivered on{" "}
                                                    {formatDate(
                                                        delivery.deliveredAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {delivery.notes && (
                                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-4">
                                            <div className="rounded-lg bg-white p-2 text-amber-600">
                                                <Clock3 size={17} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                                                    Delivery notes
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-amber-900">
                                                    {delivery.notes}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/60 px-5 py-3 sm:px-6">
                                    <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
                                        <Leaf
                                            size={14}
                                            className="text-green-600"
                                        />
                                        KrishiConnect
                                    </span>

                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                                        View progress
                                        <ArrowRight size={14} />
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </div>
    );
};

export default BuyerDeliveries;
