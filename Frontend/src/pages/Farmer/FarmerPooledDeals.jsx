// import { useCallback, useEffect, useState } from "react";
// import {
//     RefreshCw,
//     Package,
//     MapPin,
//     CheckCircle2,
//     XCircle,
//     Clock,
//     AlertCircle,
//     Users,
// } from "lucide-react";

// import {
//     getFarmerPooledDeals,
//     respondToFarmerPooledDeal,
// } from "../../services/farmerPooledDealServices";

// const statusStyles = {
//     PENDING: "bg-amber-50 text-amber-700",
//     ACCEPTED: "bg-green-50 text-green-700",
//     REJECTED: "bg-red-50 text-red-700",
//     CANCELLED: "bg-gray-100 text-gray-600",
//     COMPLETED: "bg-blue-50 text-blue-700",
// };

// const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-IN", {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 2,
//     }).format(Number(amount) || 0);

// // Payment status badge styles
// const paymentStatusStyles = {
//     PAID: "bg-green-50 text-green-700 border-green-200",
//     PENDING: "bg-amber-50 text-amber-700 border-amber-200",
//     PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
//     FAILED: "bg-red-50 text-red-700 border-red-200",
//     REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
// };

// // Format payment date safely
// const formatPaymentDate = (date) => {
//     if (!date) return "Not available";

//     const parsedDate = new Date(date);

//     return Number.isNaN(parsedDate.getTime())
//         ? "Not available"
//         : parsedDate.toLocaleString("en-IN");
// };

// export default function FarmerPooledDeals() {
//     const [deals, setDeals] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [processingId, setProcessingId] = useState("");
//     const [error, setError] = useState("");
//     const [notice, setNotice] = useState("");

//     const loadDeals = useCallback(async (refresh = false) => {
//         if (refresh) setRefreshing(true);
//         else setLoading(true);

//         setError("");

//         try {
//             const result = await getFarmerPooledDeals();
//             setDeals(result.data || []);
//         } catch (err) {
//             setError(err.message || "Unable to load pooled offers.");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, []);

//     useEffect(() => {
//         loadDeals();
//     }, [loadDeals]);

//     const handleResponse = async (dealId, response) => {
//         const action =
//             response === "ACCEPTED" ? "accept" : "reject";

//         if (
//             !window.confirm(
//                 `Are you sure you want to ${action} this pooled offer?`
//             )
//         ) {
//             return;
//         }

//         setProcessingId(dealId);
//         setError("");
//         setNotice("");

//         try {
//             const result = await respondToFarmerPooledDeal(
//                 dealId,
//                 response
//             );

//             setNotice(
//                 result.message || "Your response was recorded."
//             );

//             await loadDeals(true);
//         } catch (err) {
//             setError(
//                 err.message || "Unable to submit your response."
//             );
//         } finally {
//             setProcessingId("");
//         }
//     };

//     if (loading) {
//         return (
//             <div className="space-y-4 p-6">
//                 <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
//                 <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
//                 <div className="h-40 animate-pulse rounded-2xl bg-gray-100" />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//             <div className="mx-auto max-w-6xl space-y-6">

//                 {/* Page Header */}
//                 <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                     <div>
//                         <p className="text-sm font-medium text-green-700">
//                             KRISHICONNECT / FARMER
//                         </p>

//                         <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
//                             Pooled Offers
//                         </h1>

//                         <p className="mt-2 text-sm text-gray-500">
//                             Review buyer offers for your pooled produce.
//                         </p>
//                     </div>

//                     <button
//                         onClick={() => loadDeals(true)}
//                         disabled={refreshing}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 disabled:opacity-60"
//                     >
//                         <RefreshCw
//                             size={16}
//                             className={
//                                 refreshing ? "animate-spin" : ""
//                             }
//                         />
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                     <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                         <AlertCircle size={19} className="shrink-0" />
//                         <span>{error}</span>
//                     </div>
//                 )}

//                 {/* Success Message */}
//                 {notice && (
//                     <div className="flex gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
//                         <CheckCircle2
//                             size={19}
//                             className="shrink-0"
//                         />
//                         <span>{notice}</span>
//                     </div>
//                 )}

//                 {/* Empty State */}
//                 {!error && deals.length === 0 ? (
//                     <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
//                         <Package
//                             size={38}
//                             className="mx-auto text-gray-400"
//                         />

//                         <h2 className="mt-4 font-bold text-gray-900">
//                             No pooled offers yet
//                         </h2>

//                         <p className="mt-2 text-sm text-gray-500">
//                             Offers involving your produce will appear here.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-5">
//                         {deals.map((deal) => {
//                             const lot =
//                                 deal.pooledLot &&
//                                 typeof deal.pooledLot === "object"
//                                     ? deal.pooledLot
//                                     : {};

//                             const buyer =
//                                 deal.buyer &&
//                                 typeof deal.buyer === "object"
//                                     ? deal.buyer
//                                     : {};

//                             const contribution =
//                                 deal.myContribution || {};

//                             const responseStatus =
//                                 contribution.responseStatus || "PENDING";

//                             const isPending =
//                                 deal.status === "PENDING" &&
//                                 responseStatus === "PENDING";

//                             const isProcessing =
//                                 processingId === deal._id;

//                             const paymentStatus =
//                                 deal.payment?.status ||
//                                 "NOT INITIATED";

//                             const paymentStatusClass =
//                                 paymentStatusStyles[paymentStatus] ||
//                                 "bg-gray-100 text-gray-700 border-gray-200";

//                             return (
//                                 <article
//                                     key={deal._id}
//                                     className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
//                                 >
//                                     {/* Deal Header */}
//                                     <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
//                                         <div>
//                                             <h2 className="text-lg font-bold text-gray-900">
//                                                 {lot.crop || "Pooled Produce"}
//                                             </h2>

//                                             <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
//                                                 <span className="inline-flex items-center gap-1.5">
//                                                     <MapPin size={15} />
//                                                     {lot.location ||
//                                                         "Location unavailable"}
//                                                 </span>

//                                                 <span className="inline-flex items-center gap-1.5">
//                                                     <Users size={15} />
//                                                     {deal.contributions
//                                                         ?.length || 0}{" "}
//                                                     farmers
//                                                 </span>
//                                             </div>

//                                             <p className="mt-2 text-sm text-gray-600">
//                                                 Buyer:{" "}
//                                                 <span className="font-semibold">
//                                                     {buyer.name || "Buyer"}
//                                                 </span>
//                                             </p>
//                                         </div>

//                                         <span
//                                             className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
//                                                 statusStyles[deal.status] ||
//                                                 statusStyles.PENDING
//                                             }`}
//                                         >
//                                             Deal: {deal.status}
//                                         </span>
//                                     </div>

//                                     {/* Deal Metrics */}
//                                     <div className="grid gap-4 bg-gray-50/70 p-5 sm:grid-cols-3">
//                                         <Metric
//                                             label="Your contribution"
//                                             value={`${contribution.quantity ?? 0} ${
//                                                 deal.unit || lot.unit || ""
//                                             }`}
//                                         />

//                                         <Metric
//                                             label="Offer per unit"
//                                             value={formatCurrency(
//                                                 deal.offeredPrice
//                                             )}
//                                         />

//                                         <Metric
//                                             label="Your offer amount"
//                                             value={formatCurrency(
//                                                 contribution.offeredAmount
//                                             )}
//                                         />
//                                     </div>

//                                     <div className="space-y-4 p-5">

//                                         {/* Farmer Response */}
//                                         <div className="flex flex-wrap items-center justify-between gap-3">
//                                             <div>
//                                                 <p className="text-sm text-gray-500">
//                                                     Your response
//                                                 </p>

//                                                 <p className="mt-1 font-semibold text-gray-900">
//                                                     {responseStatus}
//                                                 </p>
//                                             </div>

//                                             {isPending && (
//                                                 <div className="flex flex-wrap gap-2">
//                                                     <button
//                                                         onClick={() =>
//                                                             handleResponse(
//                                                                 deal._id,
//                                                                 "REJECTED"
//                                                             )
//                                                         }
//                                                         disabled={isProcessing}
//                                                         className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
//                                                     >
//                                                         <XCircle size={16} />
//                                                         Reject
//                                                     </button>

//                                                     <button
//                                                         onClick={() =>
//                                                             handleResponse(
//                                                                 deal._id,
//                                                                 "ACCEPTED"
//                                                             )
//                                                         }
//                                                         disabled={isProcessing}
//                                                         className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
//                                                     >
//                                                         <CheckCircle2
//                                                             size={16}
//                                                         />
//                                                         {isProcessing
//                                                             ? "Submitting..."
//                                                             : "Accept Offer"}
//                                                     </button>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Buyer's Message */}
//                                         {deal.message && (
//                                             <div className="rounded-xl bg-gray-50 p-4">
//                                                 <p className="text-xs font-semibold uppercase text-gray-500">
//                                                     Buyer's message
//                                                 </p>

//                                                 <p className="mt-1 text-sm text-gray-700">
//                                                     {deal.message}
//                                                 </p>
//                                             </div>
//                                         )}

//                                         {/* Persistent Pooled-Payment Information */}
//                                         <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
//                                             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-semibold text-gray-900">
//                                                         Buyer Payment
//                                                     </p>

//                                                     <p className="mt-1 text-xs text-gray-500">
//                                                         Payment status for the entire pooled deal
//                                                     </p>
//                                                 </div>

//                                                 <span
//                                                     className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${paymentStatusClass}`}
//                                                 >
//                                                     {paymentStatus === "PAID" ? (
//                                                         <CheckCircle2 size={14} />
//                                                     ) : paymentStatus === "FAILED" ? (
//                                                         <XCircle size={14} />
//                                                     ) : (
//                                                         <Clock size={14} />
//                                                     )}

//                                                     {paymentStatus ===
//                                                     "NOT INITIATED"
//                                                         ? "Not initiated"
//                                                         : paymentStatus
//                                                               .charAt(0)
//                                                               .toUpperCase() +
//                                                           paymentStatus
//                                                               .slice(1)
//                                                               .toLowerCase()}
//                                                 </span>
//                                             </div>

//                                             {/* Payment Amounts */}
//                                             <div className="mt-4 grid gap-4 sm:grid-cols-2">
//                                                 <Metric
//                                                     label="Total buyer payment"
//                                                     value={
//                                                         deal.payment
//                                                             ? formatCurrency(
//                                                                   deal.payment
//                                                                       .amount
//                                                               )
//                                                             : "Not available"
//                                                     }
//                                                 />

//                                                 <Metric
//                                                     label="Your agreed contribution amount"
//                                                     value={formatCurrency(
//                                                         contribution.offeredAmount
//                                                     )}
//                                                 />
//                                             </div>

//                                             {/* Payment Confirmation Date */}
//                                             {deal.payment?.paidAt && (
//                                                 <div className="mt-4 flex items-start gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
//                                                     <Clock
//                                                         size={16}
//                                                         className="mt-0.5 shrink-0"
//                                                     />

//                                                     <div>
//                                                         <p className="font-medium text-gray-800">
//                                                             Payment confirmed on
//                                                         </p>

//                                                         <p className="mt-1">
//                                                             {formatPaymentDate(
//                                                                 deal.payment
//                                                                     .paidAt
//                                                             )}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                             {/* Transaction Reference */}
//                                             {deal.payment?.transactionId && (
//                                                 <div className="mt-3 break-all text-xs text-gray-500">
//                                                     <span className="font-semibold text-gray-700">
//                                                         Transaction reference:{" "}
//                                                     </span>

//                                                     {deal.payment.transactionId}
//                                                 </div>
//                                             )}

//                                             {/* Payment Information Notice */}
//                                             <div
//                                                 className={`mt-4 rounded-xl p-3 text-sm ${
//                                                     deal.payment?.status ===
//                                                     "PAID"
//                                                         ? "bg-green-50 text-green-800"
//                                                         : "bg-gray-50 text-gray-600"
//                                                 }`}
//                                             >
//                                                 {deal.payment?.status ===
//                                                 "PAID" ? (
//                                                     <p>
//                                                         The buyer's pooled payment
//                                                         is confirmed. This does
//                                                         not confirm that your
//                                                         individual payout has
//                                                         been transferred.
//                                                     </p>
//                                                 ) : (
//                                                     <p>
//                                                         Your contribution amount
//                                                         is the agreed amount for
//                                                         your produce. The buyer's
//                                                         payment status does not
//                                                         represent an individual
//                                                         farmer payout.
//                                                     </p>
//                                                 )}
//                                             </div>

//                                             {/* Individual Farmer Payout */}
//                                             <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-200 p-3">
//                                                 <div>
//                                                     <p className="text-sm font-semibold text-gray-800">
//                                                         Your payout
//                                                     </p>

//                                                     <p className="mt-1 text-xs text-gray-500">
//                                                         Individual farmer payout
//                                                         tracking is not
//                                                         implemented yet.
//                                                     </p>
//                                                 </div>

//                                                 <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
//                                                     Not tracked
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Deal Submission Date */}
//                                         <p className="flex items-center gap-2 text-xs text-gray-400">
//                                             <Clock size={14} />

//                                             Submitted{" "}
//                                             {deal.createdAt
//                                                 ? new Date(
//                                                       deal.createdAt
//                                                   ).toLocaleString("en-IN")
//                                                 : "date unavailable"}
//                                         </p>
//                                     </div>
//                                 </article>
//                             );
//                         })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// function Metric({ label, value }) {
//     return (
//         <div>
//             <p className="text-xs font-medium text-gray-500">
//                 {label}
//             </p>

//             <p className="mt-1 break-words text-lg font-bold text-gray-900">
//                 {value}
//             </p>
//         </div>
//     );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    RefreshCw,
    Package,
    MapPin,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Users,
    ArrowLeft,
    Search,
    X,
    Sprout,
    Handshake,
    IndianRupee,
    CalendarDays,
    CreditCard,
} from "lucide-react";

import {
    getFarmerPooledDeals,
    respondToFarmerPooledDeal,
} from "../../services/farmerPooledDealServices";

const STATUS_STYLES = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    ACCEPTED: "border-green-200 bg-green-50 text-green-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
    CANCELLED: "border-gray-200 bg-gray-100 text-gray-600",
    COMPLETED: "border-blue-200 bg-blue-50 text-blue-800",
};

const PAYMENT_STATUS_STYLES = {
    PAID: "border-green-200 bg-green-50 text-green-800",
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    PROCESSING: "border-blue-200 bg-blue-50 text-blue-800",
    FAILED: "border-red-200 bg-red-50 text-red-800",
    REFUNDED: "border-purple-200 bg-purple-50 text-purple-800",
    "NOT INITIATED": "border-gray-200 bg-gray-100 text-gray-700",
};

const FILTERS = [
    { value: "ALL", label: "All Offers", icon: Handshake },
    { value: "PENDING", label: "Pending", icon: Clock },
    { value: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
    { value: "REJECTED", label: "Rejected", icon: XCircle },
    { value: "COMPLETED", label: "Completed", icon: Package },
];

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatPaymentDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? "Not available"
        : parsedDate.toLocaleString("en-IN");
};

const getObject = (value) =>
    value && typeof value === "object" ? value : {};

const getDealSearchText = (deal) => {
    const lot = getObject(deal.pooledLot);
    const buyer = getObject(deal.buyer);

    return [
        lot.crop,
        lot.location,
        buyer.name,
        deal.status,
        deal.myContribution?.responseStatus,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
};

export default function FarmerPooledDeals() {
    const navigate = useNavigate();

    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState("");
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const loadDeals = useCallback(async (refresh = false) => {
        if (refresh) setRefreshing(true);
        else setLoading(true);

        setError("");

        try {
            const result = await getFarmerPooledDeals();
            setDeals(Array.isArray(result?.data) ? result.data : []);
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
        const action = response === "ACCEPTED" ? "accept" : "reject";

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

            setNotice(result.message || "Your response was recorded.");

            // Reload the server data after the action succeeds.
            await loadDeals(true);
        } catch (err) {
            setError(err.message || "Unable to submit your response.");
        } finally {
            setProcessingId("");
        }
    };

    const counts = useMemo(() => {
        const result = {
            ALL: deals.length,
            PENDING: 0,
            ACCEPTED: 0,
            REJECTED: 0,
            COMPLETED: 0,
        };

        deals.forEach((deal) => {
            const responseStatus =
                deal.myContribution?.responseStatus || "PENDING";

            // Pending means the farmer still needs to respond to the offer.
            if (
                deal.status === "PENDING" &&
                responseStatus === "PENDING"
            ) {
                result.PENDING += 1;
            } else if (result[deal.status] !== undefined) {
                result[deal.status] += 1;
            }
        });

        return result;
    }, [deals]);

    const filteredDeals = useMemo(() => {
        const query = search.trim().toLowerCase();

        return deals.filter((deal) => {
            const responseStatus =
                deal.myContribution?.responseStatus || "PENDING";

            const effectiveStatus =
                deal.status === "PENDING" &&
                responseStatus === "PENDING"
                    ? "PENDING"
                    : deal.status;

            const matchesFilter =
                activeFilter === "ALL" ||
                effectiveStatus === activeFilter;

            const matchesSearch =
                !query || getDealSearchText(deal).includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [deals, activeFilter, search]);

    return (
        <main className="pooled-deals-page min-h-screen bg-[#f5f8f3]">
            <style>{`
                @keyframes pooledEnter {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pooledShimmer {
                    from { background-position: 150% 0; }
                    to { background-position: -150% 0; }
                }

                @keyframes pooledSpin {
                    to { transform: rotate(360deg); }
                }

                .pooled-enter {
                    animation: pooledEnter .45s ease-out both;
                }

                .pooled-shimmer {
                    background: linear-gradient(
                        100deg,
                        #e7ede5 25%,
                        #f8faf7 45%,
                        #e7ede5 65%
                    );
                    background-size: 220% 100%;
                    animation: pooledShimmer 1.4s linear infinite;
                }

                .pooled-card {
                    min-width: 0;
                    animation: pooledEnter .45s ease-out both;
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease,
                        border-color .25s ease;
                }

                .pooled-card:hover {
                    transform: translateY(-4px);
                    border-color: #d1e5ce;
                    box-shadow: 0 14px 28px rgba(25, 65, 36, .08);
                }

                .pooled-section {
                    border: 1px solid #e5eae2;
                    border-radius: 16px;
                    background: white;
                    transition: border-color .2s ease, background-color .2s ease;
                }

                @media (prefers-reduced-motion: reduce) {
                    .pooled-deals-page *,
                    .pooled-deals-page *::before,
                    .pooled-deals-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

                {/* Page header and dashboard navigation */}
                <header className="pooled-enter flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/farmer/dashboard")}
                            aria-label="Back to Farmer Dashboard"
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-green-300 hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-4 focus:ring-green-100"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800 ring-1 ring-green-200">
                            <Handshake size={25} />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Sprout size={14} className="text-green-700" />
                                <span className="text-xs font-bold uppercase tracking-[.15em] text-green-700">
                                    KrishiConnect / Farmer
                                </span>
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                Pooled Offers
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                                Review group purchase offers, understand your contribution, and track buyer payments.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadDeals(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        {refreshing ? "Refreshing..." : "Refresh Offers"}
                    </button>
                </header>

                {/* Dynamic deal counts */}
                <section
                    className="pooled-enter grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                    style={{ animationDelay: "70ms" }}
                >
                    {FILTERS.map((filter, index) => {
                        const Icon = filter.icon;
                        const selected = activeFilter === filter.value;

                        const iconColors = {
                            ALL: "bg-green-100 text-green-700",
                            PENDING: "bg-amber-100 text-amber-700",
                            ACCEPTED: "bg-emerald-100 text-emerald-700",
                            REJECTED: "bg-red-100 text-red-700",
                            COMPLETED: "bg-blue-100 text-blue-700",
                        };

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActiveFilter(filter.value)}
                                aria-pressed={selected}
                                className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                                    selected
                                        ? "border-green-700 bg-green-700 text-white shadow-lg shadow-green-900/10"
                                        : "border-gray-200 bg-white text-gray-800 shadow-sm hover:border-green-300 hover:shadow-md"
                                }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                            selected
                                                ? "bg-white/15 text-white"
                                                : iconColors[filter.value]
                                        }`}
                                    >
                                        <Icon size={19} />
                                    </span>

                                    <span className="text-2xl font-extrabold tabular-nums">
                                        {loading ? "—" : counts[filter.value]}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm font-semibold">
                                    {filter.label}
                                </p>
                            </button>
                        );
                    })}
                </section>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="pooled-enter flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                    >
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div className="flex-1">
                            <p className="font-semibold text-red-800">
                                Something went wrong
                            </p>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                            className="rounded-lg p-1 text-red-500 transition hover:bg-red-100"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Success notice */}
                {notice && (
                    <div
                        role="status"
                        className="pooled-enter flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4"
                    >
                        <CheckCircle2
                            size={20}
                            className="mt-0.5 shrink-0 text-green-700"
                        />

                        <div className="flex-1">
                            <p className="font-semibold text-green-900">
                                Response submitted
                            </p>
                            <p className="mt-1 text-sm text-green-800">{notice}</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setNotice("")}
                            aria-label="Dismiss success message"
                            className="rounded-lg p-1 text-green-700 transition hover:bg-green-100"
                        >
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Search and filters */}
                <section className="pooled-enter rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by crop, buyer, or location..."
                                aria-label="Search pooled offers"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-11 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-3 px-1 sm:justify-end">
                            <span className="text-sm text-gray-500">
                                {loading
                                    ? "Loading offers..."
                                    : `${filteredDeals.length} result${filteredDeals.length === 1 ? "" : "s"}`}
                            </span>

                            {(search || activeFilter !== "ALL") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setActiveFilter("ALL");
                                    }}
                                    className="text-sm font-semibold text-green-700 transition hover:text-green-900"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="pooled-enter rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                                style={{ animationDelay: `${item * 70}ms` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="pooled-shimmer h-12 w-12 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="pooled-shimmer h-4 w-2/5 rounded-md" />
                                        <div className="pooled-shimmer h-3 w-1/3 rounded-md" />
                                    </div>
                                    <div className="pooled-shimmer h-7 w-24 rounded-full" />
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {[0, 1, 2].map((metric) => (
                                        <div
                                            key={metric}
                                            className="pooled-shimmer h-20 rounded-xl"
                                        />
                                    ))}
                                </div>

                                <div className="pooled-shimmer mt-5 h-20 rounded-xl" />
                                <div className="pooled-shimmer mt-5 h-12 rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredDeals.length === 0 && (
                    <div className="pooled-enter rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-transform duration-500 hover:rotate-6 hover:scale-110">
                            {search ? <Search size={30} /> : <Package size={32} />}
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            {error
                                ? "Offers are temporarily unavailable"
                                : search
                                    ? "No matching pooled offers"
                                    : activeFilter === "ALL"
                                        ? "No pooled offers yet"
                                        : `No ${activeFilter.toLowerCase()} offers`}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            {error
                                ? "Check your connection and retry loading the offers."
                                : search
                                    ? "Try another crop, buyer, or location, or reset the filters."
                                    : activeFilter === "ALL"
                                        ? "Offers involving your pooled produce will appear here when available."
                                        : `There are currently no offers matching the ${activeFilter.toLowerCase()} status.`}
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-3">
                            {(search || activeFilter !== "ALL") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setActiveFilter("ALL");
                                    }}
                                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Reset filters
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => loadDeals(true)}
                                disabled={refreshing}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={15}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                                Refresh Offers
                            </button>
                        </div>
                    </div>
                )}

                {/* Pooled deal cards */}
                {!loading && filteredDeals.length > 0 && (
                    <div className="grid items-start gap-5 lg:grid-cols-2">
                        {filteredDeals.map((deal, index) => {
                            const lot = getObject(deal.pooledLot);
                            const buyer = getObject(deal.buyer);
                            const contribution = getObject(deal.myContribution);

                            const responseStatus =
                                contribution.responseStatus || "PENDING";

                            const isPending =
                                deal.status === "PENDING" &&
                                responseStatus === "PENDING";

                            const isProcessing = processingId === deal._id;

                            const payment = getObject(deal.payment);
                            const paymentStatus =
                                payment.status || "NOT INITIATED";

                            const paymentStyle =
                                PAYMENT_STATUS_STYLES[paymentStatus] ||
                                PAYMENT_STATUS_STYLES["NOT INITIATED"];

                            const dealStyle =
                                STATUS_STYLES[deal.status] ||
                                STATUS_STYLES.PENDING;

                            const unit = deal.unit || lot.unit || "";

                            return (
                                <article
                                    key={deal._id}
                                    className="pooled-card overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                    style={{
                                        animationDelay: `${Math.min(index * 65, 520)}ms`,
                                    }}
                                >
                                    {/* Deal identity */}
                                    <div className="border-b border-gray-100 p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-100">
                                                    <Package size={23} />
                                                </div>

                                                <div className="min-w-0">
                                                    <h2 className="break-words text-lg font-bold text-gray-900">
                                                        {lot.crop || "Pooled Produce"}
                                                    </h2>

                                                    <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">
                                                        <MapPin
                                                            size={15}
                                                            className="mt-0.5 shrink-0"
                                                        />
                                                        <span>
                                                            {lot.location || "Location unavailable"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold ${dealStyle}`}
                                            >
                                                {deal.status || "PENDING"}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <Users size={15} className="text-green-700" />
                                                {deal.contributions?.length || 0} farmers
                                            </span>

                                            <span className="inline-flex items-center gap-1.5">
                                                <Handshake size={15} className="text-green-700" />
                                                Buyer:{" "}
                                                <span className="font-semibold text-gray-800">
                                                    {buyer.name || "Buyer"}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Offer metrics */}
                                    <div className="grid grid-cols-1 gap-3 bg-gray-50/80 p-4 sm:grid-cols-3 sm:p-5">
                                        <Metric
                                            label="Your contribution"
                                            value={`${contribution.quantity ?? 0}${unit ? ` ${unit}` : ""}`}
                                            icon={Package}
                                        />

                                        <Metric
                                            label="Offer per unit"
                                            value={formatCurrency(deal.offeredPrice)}
                                            icon={IndianRupee}
                                        />

                                        <Metric
                                            label="Your offer amount"
                                            value={formatCurrency(contribution.offeredAmount)}
                                            icon={CreditCard}
                                        />
                                    </div>

                                    <div className="space-y-5 p-4 sm:p-5">

                                        {/* Farmer response and actions */}
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Your response
                                                </p>

                                                <span
                                                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                                                        STATUS_STYLES[responseStatus] ||
                                                        STATUS_STYLES.PENDING
                                                    }`}
                                                >
                                                    {responseStatus === "ACCEPTED" ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : responseStatus === "REJECTED" ? (
                                                        <XCircle size={14} />
                                                    ) : (
                                                        <Clock size={14} />
                                                    )}
                                                    {responseStatus}
                                                </span>
                                            </div>

                                            {isPending && (
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleResponse(deal._id, "REJECTED")
                                                        }
                                                        disabled={isProcessing}
                                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                                    >
                                                        {isProcessing ? (
                                                            <RefreshCw size={15} className="animate-spin" />
                                                        ) : (
                                                            <XCircle size={16} />
                                                        )}
                                                        Reject
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleResponse(deal._id, "ACCEPTED")
                                                        }
                                                        disabled={isProcessing}
                                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-700 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                                    >
                                                        {isProcessing ? (
                                                            <RefreshCw size={15} className="animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 size={16} />
                                                        )}
                                                        {isProcessing ? "Submitting..." : "Accept Offer"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Buyer message */}
                                        {deal.message && (
                                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Buyer's message
                                                </p>
                                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                                                    {deal.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Payment information */}
                                        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                        <CreditCard size={20} />
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            Buyer Payment
                                                        </h3>
                                                        <p className="mt-0.5 text-xs text-gray-500">
                                                            Entire pooled deal
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${paymentStyle}`}
                                                >
                                                    {paymentStatus === "PAID" ? (
                                                        <CheckCircle2 size={14} />
                                                    ) : paymentStatus === "FAILED" ? (
                                                        <XCircle size={14} />
                                                    ) : (
                                                        <Clock size={14} />
                                                    )}

                                                    {paymentStatus}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                <Metric
                                                    label="Total buyer payment"
                                                    value={
                                                        payment.amount != null
                                                            ? formatCurrency(payment.amount)
                                                            : "Not available"
                                                    }
                                                />

                                                <Metric
                                                    label="Your agreed amount"
                                                    value={formatCurrency(contribution.offeredAmount)}
                                                />
                                            </div>

                                            {payment.paidAt && (
                                                <div className="mt-4 flex items-start gap-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                                                    <CalendarDays
                                                        size={16}
                                                        className="mt-0.5 shrink-0 text-green-700"
                                                    />

                                                    <div>
                                                        <p className="font-semibold text-gray-800">
                                                            Payment confirmation date
                                                        </p>
                                                        <p className="mt-1">
                                                            {formatPaymentDate(payment.paidAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {payment.transactionId && (
                                                <div className="mt-3 break-all rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                                                    <span className="font-bold text-gray-800">
                                                        Transaction reference:{" "}
                                                    </span>
                                                    {payment.transactionId}
                                                </div>
                                            )}

                                            <div
                                                className={`mt-4 rounded-xl p-3 text-sm leading-6 ${
                                                    paymentStatus === "PAID"
                                                        ? "bg-green-50 text-green-800"
                                                        : "bg-gray-50 text-gray-600"
                                                }`}
                                            >
                                                {paymentStatus === "PAID"
                                                    ? "The pooled buyer payment is marked as paid. This does not independently confirm that your farmer payout has been transferred."
                                                    : "This status describes the pooled buyer payment, not an individual farmer payout."}
                                            </div>

                                            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        Individual farmer payout
                                                    </p>
                                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                                        This screen does not track individual payout transfers.
                                                    </p>
                                                </div>

                                                <span className="w-fit shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                                                    Not tracked
                                                </span>
                                            </div>
                                        </section>

                                        {/* Creation date */}
                                        <p className="flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                                            <Clock size={14} />
                                            Submitted{" "}
                                            {formatPaymentDate(deal.createdAt)}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Dashboard navigation */}
                <footer className="flex justify-center border-t border-gray-200 pt-5">
                    <button
                        type="button"
                        onClick={() => navigate("/farmer/dashboard")}
                        className="group inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 transition-all duration-300 hover:bg-white hover:text-green-800 hover:shadow-sm"
                    >
                        <ArrowLeft
                            size={17}
                            className="transition-transform duration-300 group-hover:-translate-x-1"
                        />
                        Back to Farmer Dashboard
                    </button>
                </footer>
            </div>
        </main>
    );
}

function Metric({ label, value, icon: Icon }) {
    return (
        <div className="min-w-0 rounded-xl border border-gray-100 bg-white p-3 transition-colors duration-200 hover:border-green-200 sm:border-transparent sm:bg-transparent sm:p-0">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                {Icon && <Icon size={14} className="shrink-0 text-green-700" />}
                <span>{label}</span>
            </div>

            <p className="mt-2 break-words text-lg font-bold leading-snug text-gray-900">
                {value}
            </p>
        </div>
    );
}