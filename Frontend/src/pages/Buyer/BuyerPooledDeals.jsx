
import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Package,
    MapPin,
    Users,
    IndianRupee,
    Clock,
    CheckCircle2,
    AlertCircle,
    CreditCard,
    LoaderCircle,
} from "lucide-react";

import { getBuyerPooledDeals } from "../../services/pooledDealServices";
import {
    createPooledPaymentOrder,
    verifyPooledPayment,
} from "../../services/pooledPaymentServices";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const responseStyles = {
    PENDING: "text-amber-700 bg-amber-50",
    ACCEPTED: "text-green-700 bg-green-50",
    REJECTED: "text-red-700 bg-red-50",
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const BuyerPooledDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // Payment state
    const [payingDealId, setPayingDealId] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState({});
    const [paymentError, setPaymentError] = useState("");
    const [paymentErrorDealId, setPaymentErrorDealId] = useState(null);

    // Load buyer's pooled deals
    const loadDeals = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result = await getBuyerPooledDeals();

            const data = result.data ?? result;
            setDeals(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Unable to load pooled deals.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDeals();
    }, [loadDeals]);

    // Dashboard statistics
    const totalOffers = deals.length;

    const acceptedOffers = deals.filter(
        (deal) => deal.status === "ACCEPTED"
    ).length;

    const pendingOffers = deals.filter(
        (deal) => deal.status === "PENDING"
    ).length;

    // Handle Razorpay pooled-deal payment
    const handlePooledPayment = async (deal) => {
        if (deal.status !== "ACCEPTED") {
            setPaymentError(
                "Payment is available only for accepted pooled deals."
            );
            setPaymentErrorDealId(deal._id);
            return;
        }

        if (payingDealId) {
            return;
        }

        setPayingDealId(deal._id);
        setPaymentError("");
        setPaymentErrorDealId(null);

        try {
            // Step 1: Create an order on the backend
            const orderResult = await createPooledPaymentOrder(deal._id);

            const order = orderResult.data ?? orderResult;

            if (!order.orderId || !order.paymentId || !order.key) {
                throw new Error(
                    "The server returned incomplete payment details."
                );
            }

            // Step 2: Load Razorpay Checkout if needed
            if (!window.Razorpay) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement("script");

                    script.src =
                        "https://checkout.razorpay.com/v1/checkout.js";
                    script.async = true;
                    script.onload = resolve;
                    script.onerror = () =>
                        reject(
                            new Error(
                                "Unable to load Razorpay Checkout. Please try again."
                            )
                        );

                    document.body.appendChild(script);
                });
            }

            if (!window.Razorpay) {
                throw new Error("Razorpay Checkout could not be initialized.");
            }

            // Step 3: Open checkout and verify payment on the backend
            await new Promise((resolve, reject) => {
                let settled = false;

                const resolveOnce = () => {
                    if (settled) return;
                    settled = true;
                    resolve();
                };

                const rejectOnce = (err) => {
                    if (settled) return;
                    settled = true;
                    reject(err);
                };

                const checkout = new window.Razorpay({
                    key: order.key,
                    amount: order.amount,
                    currency: order.currency || "INR",
                    name: "KrishiConnect",
                    description: `Pooled deal ${deal._id}`,
                    order_id: order.orderId,

                    handler: async (razorpayResponse) => {
                        try {
                            const verificationResult =
                                await verifyPooledPayment({
                                    pooledPaymentId: order.paymentId,
                                    razorpay_order_id:
                                        razorpayResponse.razorpay_order_id,
                                    razorpay_payment_id:
                                        razorpayResponse.razorpay_payment_id,
                                    razorpay_signature:
                                        razorpayResponse.razorpay_signature,
                                });

                            const verified =
                                verificationResult.data ??
                                verificationResult;

                            if (
                                verified.success === false ||
                                verified.payment?.status === "FAILED"
                            ) {
                                throw new Error(
                                    verified.message ||
                                        "Payment verification failed."
                                );
                            }

                            // Only mark success after server verification
                            setPaymentSuccess((previous) => ({
                                ...previous,
                                [deal._id]: true,
                            }));

                            setPaymentError("");
                            setPaymentErrorDealId(null);

                            resolveOnce();
                        } catch (err) {
                            rejectOnce(err);
                        }
                    },

                    modal: {
                        ondismiss: () => {
                            rejectOnce(
                                new Error("Payment checkout was closed.")
                            );
                        },
                    },

                    theme: {
                        color: "#16a34a",
                    },
                });

                checkout.on("payment.failed", (response) => {
                    rejectOnce(
                        new Error(
                            response.error?.description ||
                                "Razorpay payment failed."
                        )
                    );
                });

                checkout.open();
            });

            // Step 4: Refresh deals after successful verification
            await loadDeals(true);
        } catch (err) {
            setPaymentError(
                err.message || "Unable to complete pooled payment."
            );
            setPaymentErrorDealId(deal._id);
        } finally {
            setPayingDealId(null);
        }
    };

    // Initial loading skeleton
    if (loading) {
        return (
            <div className="space-y-5 p-4 sm:p-6">
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

                <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-24 animate-pulse rounded-2xl bg-gray-100"
                        />
                    ))}
                </div>

                <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Page heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            KRISHICONNECT / MARKETPLACE
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            My Pooled Deals
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Track your pooled offers and farmer responses.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadDeals(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Load error */}
                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0"
                        />

                        <div className="flex-1">
                            <p className="font-semibold">
                                Could not load pooled deals
                            </p>

                            <p className="mt-1">{error}</p>

                            <button
                                type="button"
                                onClick={() => loadDeals()}
                                className="mt-2 font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total Offers"
                        value={totalOffers}
                        icon={Package}
                        color="text-blue-600"
                        bg="bg-blue-50"
                    />

                    <StatCard
                        title="Awaiting Responses"
                        value={pendingOffers}
                        icon={Clock}
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />

                    <StatCard
                        title="Accepted Offers"
                        value={acceptedOffers}
                        icon={CheckCircle2}
                        color="text-green-600"
                        bg="bg-green-50"
                    />
                </div>

                {/* Empty state */}
                {!error && deals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <Package size={27} />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-gray-900">
                            No pooled offers yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Explore pooled produce and submit an offer to
                            farmers. Your offers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {deals.map((deal) => {
                            const lot =
                                deal.pooledLot &&
                                typeof deal.pooledLot === "object"
                                    ? deal.pooledLot
                                    : {};

                            const contributions = deal.contributions || [];

                            return (
                                <section
                                    key={deal._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* Deal heading */}
                                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {lot.crop || "Pooled Produce"}
                                            </h2>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={15} />
                                                    {lot.location ||
                                                        "Location unavailable"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users size={15} />
                                                    {contributions.length}{" "}
                                                    contributions
                                                </span>
                                            </div>

                                            <p className="mt-2 break-all text-xs text-gray-400">
                                                Offer ID: {deal._id}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                                                statusStyles[deal.status] ||
                                                statusStyles.PENDING
                                            }`}
                                        >
                                            {deal.status || "PENDING"}
                                        </span>
                                    </div>

                                    {/* Deal metrics */}
                                    <div className="grid gap-4 border-b border-gray-100 bg-gray-50/70 p-5 sm:grid-cols-3">
                                        <Metric
                                            label="Total quantity"
                                            value={`${deal.quantity ?? 0} ${
                                                deal.unit || lot.unit || ""
                                            }`}
                                        />

                                        <Metric
                                            label="Offered price / unit"
                                            value={formatCurrency(
                                                deal.offeredPrice
                                            )}
                                        />

                                        <Metric
                                            label="Total offer amount"
                                            value={formatCurrency(
                                                deal.totalAmount
                                            )}
                                            highlight
                                        />
                                    </div>

                                    {/* Farmer responses */}
                                    <div className="p-5">
                                        <h3 className="mb-4 text-sm font-bold text-gray-900">
                                            Farmer responses
                                        </h3>

                                        {contributions.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No contribution details
                                                available.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {contributions.map(
                                                    (contribution, index) => {
                                                        const farmer =
                                                            contribution.farmer &&
                                                            typeof contribution.farmer ===
                                                                "object"
                                                                ? contribution.farmer
                                                                : {};

                                                        const responseStatus =
                                                            contribution.responseStatus ||
                                                            "PENDING";

                                                        return (
                                                            <div
                                                                key={`${
                                                                    contribution
                                                                        .produce
                                                                        ?._id ||
                                                                    contribution.produce ||
                                                                    index
                                                                }-${index}`}
                                                                className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                            >
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">
                                                                        {farmer.name ||
                                                                            `Farmer ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {
                                                                            contribution.quantity
                                                                        }{" "}
                                                                        {deal.unit ||
                                                                            lot.unit ||
                                                                            ""}{" "}
                                                                        contribution
                                                                    </p>

                                                                    {farmer.village && (
                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            {
                                                                                farmer.village
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <span
                                                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                                        responseStyles[
                                                                            responseStatus
                                                                        ] ||
                                                                        responseStyles.PENDING
                                                                    }`}
                                                                >
                                                                    {
                                                                        responseStatus
                                                                    }
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}

                                        {deal.message && (
                                            <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Your message
                                                </p>

                                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                    {deal.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Payment errors for this deal */}
                                        {paymentError &&
                                            paymentErrorDealId === deal._id && (
                                                <p
                                                    role="alert"
                                                    className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                                                >
                                                    {paymentError}
                                                </p>
                                            )}

                                        {/* Pooled payment section */}
                                        <div className="mt-5 border-t border-gray-100 bg-white pt-5">
                                            {deal.status === "PENDING" && (
                                                <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
                                                    <Clock
                                                        className="mt-0.5 shrink-0 text-amber-600"
                                                        size={20}
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-amber-800">
                                                            Awaiting farmer
                                                            responses
                                                        </p>

                                                        <p className="mt-1 text-sm text-amber-700">
                                                            Payment becomes
                                                            available once all
                                                            required farmers
                                                            accept.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {deal.status === "ACCEPTED" && (
                                                <div className="flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="font-semibold text-green-900">
                                                            {paymentSuccess[
                                                                deal._id
                                                            ]
                                                                ? "Payment verified successfully"
                                                                : "All farmers have accepted"}
                                                        </p>

                                                        <p className="mt-1 text-sm text-green-800">
                                                            {paymentSuccess[
                                                                deal._id
                                                            ]
                                                                ? "The server confirmed your payment."
                                                                : `Amount due: ${formatCurrency(
                                                                      deal.totalAmount
                                                                  )}`}
                                                        </p>
                                                    </div>

                                                    {!paymentSuccess[
                                                        deal._id
                                                    ] && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handlePooledPayment(
                                                                    deal
                                                                )
                                                            }
                                                            disabled={
                                                                payingDealId !==
                                                                    null
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            {payingDealId ===
                                                            deal._id ? (
                                                                <>
                                                                    <LoaderCircle
                                                                        size={
                                                                            17
                                                                        }
                                                                        className="animate-spin"
                                                                    />
                                                                    Processing...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard
                                                                        size={
                                                                            17
                                                                        }
                                                                    />
                                                                    Pay Now
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {deal.status === "REJECTED" && (
                                                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                                                    This pooled offer was
                                                    rejected. Payment is
                                                    unavailable.
                                                </div>
                                            )}

                                            {deal.status === "CANCELLED" && (
                                                <div className="rounded-xl bg-gray-100 p-4 text-sm text-gray-700">
                                                    This pooled offer was
                                                    cancelled. Payment is
                                                    unavailable.
                                                </div>
                                            )}

                                            {deal.status === "COMPLETED" && (
                                                <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
                                                    This pooled deal is
                                                    completed.
                                                </div>
                                            )}
                                        </div>

                                        {/* Submission date */}
                                        <p className="mt-4 text-xs text-gray-400">
                                            Submitted{" "}
                                            {deal.createdAt
                                                ? new Date(
                                                      deal.createdAt
                                                  ).toLocaleString("en-IN")
                                                : "date unavailable"}
                                        </p>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// Statistics card
const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>

            <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
                <Icon size={21} />
            </div>
        </div>

        <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

// Deal metric
const Metric = ({ label, value, highlight = false }) => (
    <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p
            className={`mt-1 flex items-center gap-1 text-lg font-bold ${
                highlight ? "text-green-700" : "text-gray-900"
            }`}
        >
            {highlight && <IndianRupee size={17} />}
            {highlight ? value.replace("₹", "") : value}
        </p>
    </div>
);

export default BuyerPooledDeals;
