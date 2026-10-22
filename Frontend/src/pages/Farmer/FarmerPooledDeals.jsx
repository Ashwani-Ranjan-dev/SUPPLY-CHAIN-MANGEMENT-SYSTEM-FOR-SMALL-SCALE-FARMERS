import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Package,
    MapPin,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Users,
} from "lucide-react";

import {
    getFarmerPooledDeals,
    respondToFarmerPooledDeal,
} from "../../services/farmerPooledDealServices";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700",
    ACCEPTED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-600",
    COMPLETED: "bg-blue-50 text-blue-700",
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

// Payment status badge styles
const paymentStatusStyles = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
    FAILED: "bg-red-50 text-red-700 border-red-200",
    REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

// Format payment date safely
const formatPaymentDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? "Not available"
        : parsedDate.toLocaleString("en-IN");
};

export default function FarmerPooledDeals() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadDeals = useCallback(async (refresh = false) => {
        if (refresh) setRefreshing(true);
        else setLoading(true);

        setError("");

        try {
            const result = await getFarmerPooledDeals();
            setDeals(result.data || []);
        } catch (err) {
            setError(err.message || "Unable to load pooled offers.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDeals();
    }, [loadDeals]);

    const handleResponse = async (dealId, response) => {
        const action =
            response === "ACCEPTED" ? "accept" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} this pooled offer?`
            )
        ) {
            return;
        }

        setProcessingId(dealId);
        setError("");
        setNotice("");

        try {
            const result = await respondToFarmerPooledDeal(
                dealId,
                response
            );

            setNotice(
                result.message || "Your response was recorded."
            );

            await loadDeals(true);
        } catch (err) {
            setError(
                err.message || "Unable to submit your response."
            );
        } finally {
            setProcessingId("");
        }
    };

    if (loading) {
        return (
            <div className="space-y-4 p-6">
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
                <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            KRISHICONNECT / FARMER
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            Pooled Offers
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Review buyer offers for your pooled produce.
                        </p>
                    </div>

                    <button
                        onClick={() => loadDeals(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={
                                refreshing ? "animate-spin" : ""
                            }
                        />
                        Refresh
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle size={19} className="shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success Message */}
                {notice && (
                    <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <CheckCircle2
                            size={19}
                            className="shrink-0"
                        />
                        <span>{notice}</span>
                    </div>
                )}

                {/* Empty State */}
                {!error && deals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                        <Package
                            size={38}
                            className="mx-auto text-gray-400"
                        />

                        <h2 className="mt-4 font-bold text-gray-900">
                            No pooled offers yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Offers involving your produce will appear here.
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

                            const buyer =
                                deal.buyer &&
                                typeof deal.buyer === "object"
                                    ? deal.buyer
                                    : {};

                            const contribution =
                                deal.myContribution || {};

                            const responseStatus =
                                contribution.responseStatus || "PENDING";

                            const isPending =
                                deal.status === "PENDING" &&
                                responseStatus === "PENDING";

                            const isProcessing =
                                processingId === deal._id;

                            const paymentStatus =
                                deal.payment?.status ||
                                "NOT INITIATED";

                            const paymentStatusClass =
                                paymentStatusStyles[paymentStatus] ||
                                "bg-gray-100 text-gray-700 border-gray-200";

                            return (
                                <article
                                    key={deal._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* Deal Header */}
                                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {lot.crop || "Pooled Produce"}
                                            </h2>

                                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={15} />
                                                    {lot.location ||
                                                        "Location unavailable"}
                                                </span>

                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users size={15} />
                                                    {deal.contributions
                                                        ?.length || 0}{" "}
                                                    farmers
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-600">
                                                Buyer:{" "}
                                                <span className="font-semibold">
                                                    {buyer.name || "Buyer"}
                                                </span>
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                statusStyles[deal.status] ||
                                                statusStyles.PENDING
                                            }`}
                                        >
                                            Deal: {deal.status}
                                        </span>
                                    </div>

                                    {/* Deal Metrics */}
                                    <div className="grid gap-4 bg-gray-50/70 p-5 sm:grid-cols-3">
                                        <Metric
                                            label="Your contribution"
                                            value={`${contribution.quantity ?? 0} ${
                                                deal.unit || lot.unit || ""
                                            }`}
                                        />

                                        <Metric
                                            label="Offer per unit"
                                            value={formatCurrency(
                                                deal.offeredPrice
                                            )}
                                        />

                                        <Metric
                                            label="Your offer amount"
                                            value={formatCurrency(
                                                contribution.offeredAmount
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-4 p-5">

                                        {/* Farmer Response */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Your response
                                                </p>

                                                <p className="mt-1 font-semibold text-gray-900">
                                                    {responseStatus}
                                                </p>
                                            </div>

                                            {isPending && (
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleResponse(
                                                                deal._id,
                                                                "REJECTED"
                                                            )
                                                        }
                                                        disabled={isProcessing}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <XCircle size={16} />
                                                        Reject
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleResponse(
                                                                deal._id,
                                                                "ACCEPTED"
                                                            )
                                                        }
                                                        disabled={isProcessing}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                                    >
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                        {isProcessing
                                                            ? "Submitting..."
                                                            : "Accept Offer"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Buyer's Message */}
                                        {deal.message && (
                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-semibold uppercase text-gray-500">
                                                    Buyer's message
                                                </p>

                                                <p className="mt-1 text-sm text-gray-700">
                                                    {deal.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Persistent Pooled-Payment Information */}
                                        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Buyer Payment
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Payment status for the entire pooled deal
                                                    </p>
                                                </div>

                                                <span
                                                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${paymentStatusClass}`}
                                                >
                                                    {paymentStatus === "PAID" ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : paymentStatus === "FAILED" ? (
                                                        <XCircle size={14} />
                                                    ) : (
                                                        <Clock size={14} />
                                                    )}

                                                    {paymentStatus ===
                                                    "NOT INITIATED"
                                                        ? "Not initiated"
                                                        : paymentStatus
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          paymentStatus
                                                              .slice(1)
                                                              .toLowerCase()}
                                                </span>
                                            </div>

                                            {/* Payment Amounts */}
                                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                                <Metric
                                                    label="Total buyer payment"
                                                    value={
                                                        deal.payment
                                                            ? formatCurrency(
                                                                  deal.payment
                                                                      .amount
                                                              )
                                                            : "Not available"
                                                    }
                                                />

                                                <Metric
                                                    label="Your agreed contribution amount"
                                                    value={formatCurrency(
                                                        contribution.offeredAmount
                                                    )}
                                                />
                                            </div>

                                            {/* Payment Confirmation Date */}
                                            {deal.payment?.paidAt && (
                                                <div className="mt-4 flex items-start gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                                                    <Clock
                                                        size={16}
                                                        className="mt-0.5 shrink-0"
                                                    />

                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            Payment confirmed on
                                                        </p>

                                                        <p className="mt-1">
                                                            {formatPaymentDate(
                                                                deal.payment
                                                                    .paidAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Transaction Reference */}
                                            {deal.payment?.transactionId && (
                                                <div className="mt-3 break-all text-xs text-gray-500">
                                                    <span className="font-semibold text-gray-700">
                                                        Transaction reference:{" "}
                                                    </span>

                                                    {deal.payment.transactionId}
                                                </div>
                                            )}

                                            {/* Payment Information Notice */}
                                            <div
                                                className={`mt-4 rounded-xl p-3 text-sm ${
                                                    deal.payment?.status ===
                                                    "PAID"
                                                        ? "bg-green-50 text-green-800"
                                                        : "bg-gray-50 text-gray-600"
                                                }`}
                                            >
                                                {deal.payment?.status ===
                                                "PAID" ? (
                                                    <p>
                                                        The buyer's pooled payment
                                                        is confirmed. This does
                                                        not confirm that your
                                                        individual payout has
                                                        been transferred.
                                                    </p>
                                                ) : (
                                                    <p>
                                                        Your contribution amount
                                                        is the agreed amount for
                                                        your produce. The buyer's
                                                        payment status does not
                                                        represent an individual
                                                        farmer payout.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Individual Farmer Payout */}
                                            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-200 p-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        Your payout
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Individual farmer payout
                                                        tracking is not
                                                        implemented yet.
                                                    </p>
                                                </div>

                                                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                                    Not tracked
                                                </span>
                                            </div>
                                        </div>

                                        {/* Deal Submission Date */}
                                        <p className="flex items-center gap-2 text-xs text-gray-400">
                                            <Clock size={14} />

                                            Submitted{" "}
                                            {deal.createdAt
                                                ? new Date(
                                                      deal.createdAt
                                                  ).toLocaleString("en-IN")
                                                : "date unavailable"}
                                        </p>
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

function Metric({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-500">
                {label}
            </p>

            <p className="mt-1 break-words text-lg font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}