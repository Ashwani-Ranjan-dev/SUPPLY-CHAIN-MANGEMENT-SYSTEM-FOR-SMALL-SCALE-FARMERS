
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Loader2,
    MapPin,
    Package,
    RefreshCw,
    Star,
    XCircle,
} from "lucide-react";

import DealPayment from "./DealPayment";
import ReviewForm from "../../components/reviews/ReviewForm";
import DocumentDownloadButtons from "../../components/common/DocumentDownloadButton.jsx";

import { getMyReviews } from "../../services/reviewServices.js";

const API_URL = import.meta.env.VITE_API_URL;

const BuyerDeals = () => {
    const [deals, setDeals] = useState([]);
    const [reviewedDealIds, setReviewedDealIds] = useState([]);

    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(true);

    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");

    const [activeFilter, setActiveFilter] = useState("ALL");

    // ==================================================
    // FETCH BUYER'S DEALS
    // ==================================================
    const fetchBuyerDeals = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/deals/buyer`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load your deals."
                );
            }

            setDeals(Array.isArray(data.deals) ? data.deals : []);
        } catch (err) {
            console.error("Fetch buyer deals error:", err);
            setError(err.message || "Unable to load your deals.");
        } finally {
            setLoading(false);
        }
    }, []);

    // ==================================================
    // FETCH REVIEW HISTORY
    // ==================================================
    const fetchReviewHistory = useCallback(async () => {
        try {
            setReviewLoading(true);
            setReviewError("");

            const data = await getMyReviews();

            const ids = (data.given || [])
                .map((review) => {
                    const deal = review.deal;
                    return String(deal?._id || deal || "");
                })
                .filter(Boolean);

            setReviewedDealIds(ids);
        } catch (err) {
            console.error("Fetch review history error:", err);

            setReviewError(
                err.message || "Unable to load review history."
            );
        } finally {
            setReviewLoading(false);
        }
    }, []);

    // ==================================================
    // LOAD DATA
    // ==================================================
    useEffect(() => {
        fetchBuyerDeals();
        fetchReviewHistory();
    }, [fetchBuyerDeals, fetchReviewHistory]);

    // ==================================================
    // REFRESH DEALS AND REVIEWS
    // ==================================================
    const refreshAll = async () => {
        await Promise.all([
            fetchBuyerDeals(),
            fetchReviewHistory(),
        ]);
    };

    // ==================================================
    // RELOAD REVIEWS AFTER SUBMISSION
    // ==================================================
    const handleReviewSubmitted = async () => {
        await fetchReviewHistory();
    };

    // ==================================================
    // FILTER DEALS
    // ==================================================
    const filteredDeals = useMemo(
        () =>
            activeFilter === "ALL"
                ? deals
                : deals.filter(
                      (deal) => deal.status === activeFilter
                  ),
        [deals, activeFilter]
    );

    // ==================================================
    // STATUS BADGE CONFIGURATION
    // ==================================================
    const getStatusConfig = (status) => {
        switch (status) {
            case "ACCEPTED":
                return {
                    label: "Accepted",
                    icon: CheckCircle2,
                    className: "bg-green-50 text-green-700",
                };

            case "PENDING":
                return {
                    label: "Pending",
                    icon: Clock3,
                    className: "bg-amber-50 text-amber-700",
                };

            case "REJECTED":
                return {
                    label: "Rejected",
                    icon: XCircle,
                    className: "bg-red-50 text-red-700",
                };

            case "CANCELLED":
                return {
                    label: "Cancelled",
                    icon: XCircle,
                    className: "bg-gray-100 text-gray-600",
                };

            case "COMPLETED":
                return {
                    label: "Completed",
                    icon: CheckCircle2,
                    className: "bg-blue-50 text-blue-700",
                };

            default:
                return {
                    label: status || "Unknown",
                    icon: AlertCircle,
                    className: "bg-gray-100 text-gray-600",
                };
        }
    };

    // ==================================================
    // INITIAL LOADING STATE
    // ==================================================
    if (loading) {
        return (
            <main className="min-h-screen bg-[#f5faf5] px-5 py-8 sm:px-8">
                <div className="mx-auto flex max-w-6xl items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
            </main>
        );
    }

    // ==================================================
    // BUYER DEALS PAGE
    // ==================================================
    return (
        <main className="min-h-screen bg-[#f5faf5] px-5 py-8 sm:px-8">
            <div className="mx-auto max-w-6xl">
                {/* HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-bold tracking-wider text-green-600">
                            KRISHICONNECT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            My Deals
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Track your offers, accepted deals and payments.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={refreshAll}
                        disabled={loading || reviewLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${
                                loading || reviewLoading
                                    ? "animate-spin"
                                    : ""
                            }`}
                        />
                        Refresh
                    </button>
                </div>

                {/* DEAL LOADING ERRORS */}
                {error && (
                    <div
                        role="alert"
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700"
                    >
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                        <div>
                            <p className="font-semibold">
                                Unable to load deals
                            </p>

                            <p className="mt-1 text-sm">{error}</p>

                            <button
                                type="button"
                                onClick={fetchBuyerDeals}
                                className="mt-2 text-sm font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {/* REVIEW-HISTORY WARNING */}
                {reviewError && (
                    <div
                        role="alert"
                        className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
                    >
                        <p>
                            Your review history could not be loaded.
                            The backend will still enforce duplicate-review
                            protection.
                        </p>

                        <button
                            type="button"
                            onClick={fetchReviewHistory}
                            className="mt-2 font-semibold underline"
                        >
                            Retry loading reviews
                        </button>
                    </div>
                )}

                {/* STATUS FILTERS */}
                <div className="mt-6 flex flex-wrap gap-2">
                    {[
                        "ALL",
                        "PENDING",
                        "ACCEPTED",
                        "REJECTED",
                        "COMPLETED",
                    ].map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                activeFilter === filter
                                    ? "bg-green-600 text-white"
                                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {filter === "ALL"
                                ? "All"
                                : filter.charAt(0) +
                                  filter.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {/* EMPTY STATE */}
                {!error && filteredDeals.length === 0 && (
                    <div className="mt-6 rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                        <Package className="mx-auto h-10 w-10 text-gray-300" />

                        <h2 className="mt-4 text-lg font-bold text-gray-900">
                            No deals found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Your deals will appear here once you make an
                            offer on farmer produce.
                        </p>
                    </div>
                )}

                {/* DEAL LIST */}
                <div className="mt-6 space-y-5">
                    {filteredDeals.map((deal) => {
                        const status = getStatusConfig(deal.status);
                        const StatusIcon = status.icon;
                        const payment = deal.payment;

                        const alreadyReviewed = reviewedDealIds.some(
                            (id) => String(id) === String(deal._id)
                        );

                        return (
                            <div
                                key={deal._id}
                                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                            >
                                {/* DEAL HEADER */}
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {deal.produce?.crop || "Produce"}
                                            </h2>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                                            >
                                                <StatusIcon className="h-3.5 w-3.5" />
                                                {status.label}
                                            </span>
                                        </div>

                                        <p className="mt-2 break-all text-sm text-gray-500">
                                            Deal ID: {deal._id}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>

                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            ₹
                                            {Number(
                                                deal.totalAmount || 0
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                {/* DEAL DETAILS */}
                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Quantity
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {deal.quantity} {deal.unit}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Offered Price
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            ₹
                                            {Number(
                                                deal.offeredPrice || 0
                                            ).toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Farmer
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {deal.farmer?.name || "Farmer"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Payment
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {payment?.status || "Not available"}
                                        </p>
                                    </div>
                                </div>

                                {/* DOCUMENT DOWNLOAD BUTTONS */}
                                <div className="mt-5 border-t border-gray-100 pt-5">
                                    <DocumentDownloadButtons
                                        id={deal._id}
                                        type="deal"
                                        status={deal.status}
                                    />
                                </div>

                                {/* PRODUCE LOCATION */}
                                {deal.produce?.location && (
                                    <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        {deal.produce.location}
                                    </div>
                                )}

                                {/* BUYER MESSAGE */}
                                {deal.message && (
                                    <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Your Message
                                        </p>

                                        <p className="mt-1 text-sm text-gray-700">
                                            {deal.message}
                                        </p>
                                    </div>
                                )}

                                {/* EXISTING PAYMENT FLOW */}
                                {deal.status === "ACCEPTED" && payment && (
                                    <div className="mt-6 border-t border-gray-100 pt-5">
                                        <DealPayment
                                            deal={{
                                                ...deal,
                                                payment,
                                            }}
                                        />
                                    </div>
                                )}

                                {/* REVIEW FARMER AFTER DEAL COMPLETION */}
                                {deal.status === "COMPLETED" && (
                                    <div className="mt-6 border-t border-gray-100 pt-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />

                                            <h3 className="font-bold text-gray-900">
                                                Review this farmer
                                            </h3>
                                        </div>

                                        <ReviewForm
                                            dealId={deal._id}
                                            dealStatus={deal.status}
                                            recipientName={
                                                deal.farmer?.name || "the farmer"
                                            }
                                            alreadyReviewed={alreadyReviewed}
                                            onSubmitted={handleReviewSubmitted}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default BuyerDeals;
