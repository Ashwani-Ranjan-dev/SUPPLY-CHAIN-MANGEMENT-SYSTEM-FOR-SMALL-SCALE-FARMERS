
// import { useCallback, useEffect, useMemo, useState } from "react";
// import {
//     Handshake,
//     RefreshCw,
// } from "lucide-react";

// import FarmerDealCard from "../../components/Farmer/FarmerDealCard";

// import {
//     getFarmerDeals,
//     acceptDeal,
//     rejectDeal,
// } from "../../services/dealServices.js";

// import {
//     getMyReviews,
// } from "../../services/reviewServices.js";

// const FarmerDeals = () => {
//     const [deals, setDeals] = useState([]);
//     const [reviewedDealIds, setReviewedDealIds] = useState([]);

//     const [loading, setLoading] = useState(true);
//     const [reviewLoading, setReviewLoading] = useState(true);

//     const [error, setError] = useState("");
//     const [reviewError, setReviewError] = useState("");

//     const [activeFilter, setActiveFilter] = useState("ALL");
//     const [actionLoading, setActionLoading] = useState(null);

//     // Load farmer's deals.
//     const loadDeals = useCallback(async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const data = await getFarmerDeals();

//             setDeals(data.deals || []);
//         } catch (err) {
//             setError(err.message || "Unable to load deals.");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // Load reviews submitted by this farmer.
//     const loadReviewHistory = useCallback(async () => {
//         try {
//             setReviewLoading(true);
//             setReviewError("");

//             const data = await getMyReviews();

//             const givenReviews = data.given || [];

//             const dealIds = givenReviews
//                 .map((review) => {
//                     // The deal may be populated or just an ObjectId.
//                     const deal = review.deal;
//                     return String(deal?._id || deal || "");
//                 })
//                 .filter(Boolean);

//             setReviewedDealIds(dealIds);
//         } catch (err) {
//             setReviewError(
//                 err.message || "Unable to load review history."
//             );
//         } finally {
//             setReviewLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         loadDeals();
//         loadReviewHistory();
//     }, [loadDeals, loadReviewHistory]);

//     // Accept a buyer's offer.
//     const handleAccept = async (id) => {
//         try {
//             setActionLoading(id);
//             setError("");

//             const data = await acceptDeal(id);

//             setDeals((current) =>
//                 current.map((deal) =>
//                     String(deal._id) === String(id)
//                         ? {
//                               ...deal,
//                               status: data.deal.status,
//                           }
//                         : deal
//                 )
//             );
//         } catch (err) {
//             setError(err.message || "Unable to accept deal.");
//         } finally {
//             setActionLoading(null);
//         }
//     };

//     // Reject a buyer's offer.
//     const handleReject = async (id) => {
//         try {
//             setActionLoading(id);
//             setError("");

//             const data = await rejectDeal(id);

//             setDeals((current) =>
//                 current.map((deal) =>
//                     String(deal._id) === String(id)
//                         ? {
//                               ...deal,
//                               status: data.deal.status,
//                           }
//                         : deal
//                 )
//             );
//         } catch (err) {
//             setError(err.message || "Unable to reject deal.");
//         } finally {
//             setActionLoading(null);
//         }
//     };

//     // Called after a review is successfully submitted.
//     const handleReviewSubmitted = async () => {
//         await loadReviewHistory();
//     };

//     const filters = [
//         "ALL",
//         "PENDING",
//         "ACCEPTED",
//         "REJECTED",
//         "COMPLETED",
//     ];

//     const filteredDeals = useMemo(() => {
//         if (activeFilter === "ALL") {
//             return deals;
//         }

//         return deals.filter(
//             (deal) => deal.status === activeFilter
//         );
//     }, [deals, activeFilter]);

//     const refreshAll = async () => {
//         await Promise.all([
//             loadDeals(),
//             loadReviewHistory(),
//         ]);
//     };

//     return (
//         <div className="min-h-screen bg-[#f7faf7]">
//             <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//                 {/* Page header */}
//                 <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
//                             <Handshake size={24} />
//                         </div>

//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
//                                 My Deals
//                             </h1>

//                             <p className="mt-1 text-sm text-gray-500">
//                                 Manage buyer offers and confirmed deals.
//                             </p>
//                         </div>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={refreshAll}
//                         disabled={loading || reviewLoading}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
//                     >
//                         <RefreshCw
//                             size={17}
//                             className={
//                                 loading || reviewLoading
//                                     ? "animate-spin"
//                                     : ""
//                             }
//                         />
//                         Refresh
//                     </button>
//                 </div>

//                 {/* Deal loading/error state */}
//                 {error && (
//                     <div
//                         role="alert"
//                         className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
//                     >
//                         {error}
//                     </div>
//                 )}

//                 {/* Review history warning */}
//                 {reviewError && (
//                     <div
//                         role="alert"
//                         className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
//                     >
//                         Review history could not be loaded. You can still
//                         attempt to submit a review, but the backend will
//                         prevent duplicate submissions.
//                         <button
//                             type="button"
//                             onClick={loadReviewHistory}
//                             className="ml-2 font-semibold underline"
//                         >
//                             Retry
//                         </button>
//                     </div>
//                 )}

//                 {/* Filters */}
//                 <div className="mb-6 overflow-x-auto">
//                     <div className="flex min-w-max gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
//                         {filters.map((filter) => (
//                             <button
//                                 key={filter}
//                                 type="button"
//                                 onClick={() => setActiveFilter(filter)}
//                                 className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
//                                     activeFilter === filter
//                                         ? "bg-green-600 text-white"
//                                         : "text-gray-600 hover:bg-green-50 hover:text-green-700"
//                                 }`}
//                             >
//                                 {filter}
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 {/* Loading skeletons */}
//                 {loading && (
//                     <div className="grid gap-5 lg:grid-cols-2">
//                         {[1, 2, 3, 4].map((item) => (
//                             <div
//                                 key={item}
//                                 className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
//                             />
//                         ))}
//                     </div>
//                 )}

//                 {/* Empty state */}
//                 {!loading && filteredDeals.length === 0 && (
//                     <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
//                         <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
//                             <Handshake size={30} />
//                         </div>

//                         <h2 className="mt-5 text-lg font-bold text-gray-900">
//                             No deals found
//                         </h2>

//                         <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
//                             Buyer offers will appear here when someone
//                             sends you a deal for your produce.
//                         </p>
//                     </div>
//                 )}

//                 {/* Deal cards */}
//                 {!loading && filteredDeals.length > 0 && (
//                     <div className="grid gap-5 lg:grid-cols-2">
//                         {filteredDeals.map((deal) => (
//                             <FarmerDealCard
//                                 key={deal._id}
//                                 deal={deal}
//                                 onAccept={handleAccept}
//                                 onReject={handleReject}
//                                 actionLoading={
//                                     actionLoading === deal._id
//                                 }
//                                 reviewedDealIds={reviewedDealIds}
//                                 onReviewSubmitted={handleReviewSubmitted}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default FarmerDeals;


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Handshake,
    RefreshCw,
    ArrowLeft,
    Search,
    X,
    CheckCircle2,
    Clock3,
    XCircle,
    PackageCheck,
    AlertCircle,
    Sprout,
} from "lucide-react";

import FarmerDealCard from "../../components/Farmer/FarmerDealCard";

import {
    getFarmerDeals,
    acceptDeal,
    rejectDeal,
} from "../../services/dealServices.js";

import { getMyReviews } from "../../services/reviewServices.js";

const FILTERS = [
    { value: "ALL", label: "All Deals", icon: Handshake },
    { value: "PENDING", label: "Pending", icon: Clock3 },
    { value: "ACCEPTED", label: "Accepted", icon: CheckCircle2 },
    { value: "REJECTED", label: "Rejected", icon: XCircle },
    { value: "COMPLETED", label: "Completed", icon: PackageCheck },
];

const FILTER_STYLES = {
    ALL: "bg-green-700 text-white shadow-md shadow-green-900/10",
    PENDING: "bg-amber-500 text-white shadow-md shadow-amber-900/10",
    ACCEPTED: "bg-emerald-600 text-white shadow-md shadow-emerald-900/10",
    REJECTED: "bg-red-600 text-white shadow-md shadow-red-900/10",
    COMPLETED: "bg-blue-600 text-white shadow-md shadow-blue-900/10",
};

const FarmerDeals = () => {
    const navigate = useNavigate();

    const [deals, setDeals] = useState([]);
    const [reviewedDealIds, setReviewedDealIds] = useState([]);

    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [actionLoading, setActionLoading] = useState(null);
    const [search, setSearch] = useState("");

    // Load farmer deals from the backend.
    const loadDeals = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getFarmerDeals();
            setDeals(Array.isArray(data?.deals) ? data.deals : []);
        } catch (err) {
            setError(err.message || "Unable to load deals.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Load reviews already submitted by the farmer.
    const loadReviewHistory = useCallback(async () => {
        try {
            setReviewLoading(true);
            setReviewError("");

            const data = await getMyReviews();
            const givenReviews = Array.isArray(data?.given)
                ? data.given
                : [];

            const dealIds = givenReviews
                .map((review) => {
                    const deal = review.deal;
                    return String(deal?._id || deal || "");
                })
                .filter(Boolean);

            setReviewedDealIds(dealIds);
        } catch (err) {
            setReviewError(
                err.message || "Unable to load review history."
            );
        } finally {
            setReviewLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDeals();
        loadReviewHistory();
    }, [loadDeals, loadReviewHistory]);

    // Accept a buyer's offer.
    const handleAccept = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const data = await acceptDeal(id);

            setDeals((current) =>
                current.map((deal) =>
                    String(deal._id) === String(id)
                        ? {
                              ...deal,
                              status: data.deal.status,
                          }
                        : deal
                )
            );
        } catch (err) {
            setError(err.message || "Unable to accept deal.");
        } finally {
            setActionLoading(null);
        }
    };

    // Reject a buyer's offer.
    const handleReject = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const data = await rejectDeal(id);

            setDeals((current) =>
                current.map((deal) =>
                    String(deal._id) === String(id)
                        ? {
                              ...deal,
                              status: data.deal.status,
                          }
                        : deal
                )
            );
        } catch (err) {
            setError(err.message || "Unable to reject deal.");
        } finally {
            setActionLoading(null);
        }
    };

    // Refresh review history after a review is submitted.
    const handleReviewSubmitted = async () => {
        await loadReviewHistory();
    };

    const refreshAll = async () => {
        await Promise.all([
            loadDeals(true),
            loadReviewHistory(),
        ]);
    };

    // Counts always reflect the actual backend deal data.
    const counts = useMemo(() => {
        const result = {
            ALL: deals.length,
            PENDING: 0,
            ACCEPTED: 0,
            REJECTED: 0,
            COMPLETED: 0,
        };

        deals.forEach((deal) => {
            if (Object.prototype.hasOwnProperty.call(result, deal.status)) {
                result[deal.status] += 1;
            }
        });

        return result;
    }, [deals]);

    // Search and filter deals without changing the source data.
    const filteredDeals = useMemo(() => {
        const query = search.trim().toLowerCase();

        return deals.filter((deal) => {
            const matchesStatus =
                activeFilter === "ALL" ||
                deal.status === activeFilter;

            const buyerName =
                typeof deal.buyer === "object"
                    ? deal.buyer?.name || ""
                    : "";

            const cropName =
                deal.produce?.crop ||
                deal.produce?.name ||
                deal.crop ||
                "";

            const matchesSearch =
                !query ||
                String(cropName).toLowerCase().includes(query) ||
                String(buyerName).toLowerCase().includes(query) ||
                String(deal.status || "").toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [deals, activeFilter, search]);

    return (
        <main className="farmer-deals-page min-h-screen bg-[#f5f8f3]">
            <style>{`
                @keyframes dealFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes dealShimmer {
                    from { background-position: 150% 0; }
                    to { background-position: -150% 0; }
                }

                @keyframes dealPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .45; }
                }

                .deal-enter {
                    animation: dealFadeUp .45s ease-out both;
                }

                .deal-skeleton {
                    background: linear-gradient(
                        100deg,
                        #e8eee5 25%,
                        #f8faf7 45%,
                        #e8eee5 65%
                    );
                    background-size: 220% 100%;
                    animation: dealShimmer 1.4s linear infinite;
                }

                .deal-card-motion {
                    min-width: 0;
                    animation: dealFadeUp .45s ease-out both;
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease,
                        border-color .25s ease;
                }

                .deal-card-motion:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 30px rgba(22, 60, 32, .08);
                }

                .deal-filter {
                    transition:
                        color .2s ease,
                        background-color .2s ease,
                        border-color .2s ease,
                        transform .2s ease,
                        box-shadow .2s ease;
                }

                .deal-filter:active {
                    transform: scale(.97);
                }

                @media (prefers-reduced-motion: reduce) {
                    .farmer-deals-page *,
                    .farmer-deals-page *::before,
                    .farmer-deals-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

                {/* Header and navigation */}
                <header className="deal-enter flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/farmer/dashboard")}
                            aria-label="Back to Farmer Dashboard"
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-green-300 hover:bg-green-50 hover:text-green-800 focus:outline-none focus:ring-4 focus:ring-green-100"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-800 ring-1 ring-green-200/70">
                            <Handshake size={25} />
                        </div>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Sprout size={14} className="text-green-700" />
                                <span className="text-xs font-bold uppercase tracking-[.15em] text-green-700">
                                    KrishiConnect
                                </span>
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                My Deals
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                                Review buyer offers, manage negotiations, and track your confirmed deals.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={refreshAll}
                        disabled={loading || reviewLoading || refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-300 hover:border-green-300 hover:bg-green-50 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing || (loading && !refreshing) ? "animate-spin" : ""}
                        />
                        {refreshing ? "Refreshing..." : "Refresh Deals"}
                    </button>
                </header>

                {/* Dynamic status summary */}
                <section
                    className="deal-enter grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                    style={{ animationDelay: "70ms" }}
                >
                    {FILTERS.map((filter, index) => {
                        const Icon = filter.icon;
                        const selected = activeFilter === filter.value;

                        const iconColors = {
                            ALL: "text-green-700 bg-green-100",
                            PENDING: "text-amber-700 bg-amber-100",
                            ACCEPTED: "text-emerald-700 bg-emerald-100",
                            REJECTED: "text-red-700 bg-red-100",
                            COMPLETED: "text-blue-700 bg-blue-100",
                        };

                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => setActiveFilter(filter.value)}
                                aria-pressed={selected}
                                className={`deal-filter rounded-2xl border p-4 text-left ${
                                    selected
                                        ? "border-green-700 bg-green-700 text-white shadow-lg shadow-green-900/10"
                                        : "border-gray-200 bg-white text-gray-800 shadow-sm hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                                }`}
                                style={{ animationDelay: `${index * 45}ms` }}
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

                                    <span
                                        className={`text-2xl font-extrabold tabular-nums ${
                                            selected ? "text-white" : "text-gray-900"
                                        }`}
                                    >
                                        {loading ? "—" : counts[filter.value]}
                                    </span>
                                </div>

                                <p
                                    className={`mt-3 text-sm font-semibold ${
                                        selected ? "text-white" : "text-gray-700"
                                    }`}
                                >
                                    {filter.label}
                                </p>
                            </button>
                        );
                    })}
                </section>

                {/* Deal errors */}
                {error && (
                    <div
                        role="alert"
                        className="deal-enter flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                    >
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-red-800">
                                Deal action or loading failed
                            </p>
                            <p className="mt-1 text-sm text-red-700">
                                {error}
                            </p>
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

                {/* Review warning */}
                {reviewError && (
                    <div
                        role="alert"
                        className="deal-enter flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle
                                size={20}
                                className="mt-0.5 shrink-0 text-amber-700"
                            />
                            <div>
                                <p className="font-semibold text-amber-900">
                                    Review history is unavailable
                                </p>
                                <p className="mt-1 text-sm text-amber-800">
                                    You can still attempt to submit a review, but the backend should prevent duplicate submissions.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={loadReviewHistory}
                            disabled={reviewLoading}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={14}
                                className={reviewLoading ? "animate-spin" : ""}
                            />
                            Retry
                        </button>
                    </div>
                )}

                {/* Search and result count */}
                <section
                    className="deal-enter rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4"
                    style={{ animationDelay: "130ms" }}
                >
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
                                placeholder="Search by crop, buyer, or status..."
                                aria-label="Search deals by crop, buyer, or status"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-10 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
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
                                    ? "Loading deals..."
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
                                    Reset filters
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Animated loading cards */}
                {loading && (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="deal-enter rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                                style={{ animationDelay: `${item * 70}ms` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="deal-skeleton h-12 w-12 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="deal-skeleton h-4 w-2/5 rounded-md" />
                                        <div className="deal-skeleton h-3 w-1/3 rounded-md" />
                                    </div>
                                    <div className="deal-skeleton h-7 w-20 rounded-full" />
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <div className="deal-skeleton h-20 rounded-xl" />
                                    <div className="deal-skeleton h-20 rounded-xl" />
                                </div>

                                <div className="deal-skeleton mt-5 h-12 rounded-xl" />

                                <div className="mt-5 flex gap-3">
                                    <div className="deal-skeleton h-10 flex-1 rounded-xl" />
                                    <div className="deal-skeleton h-10 flex-1 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredDeals.length === 0 && (
                    <div className="deal-enter rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center shadow-sm sm:py-20">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-transform duration-500 hover:scale-110 hover:rotate-6">
                            <Handshake size={31} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            {search
                                ? "No matching deals"
                                : activeFilter === "ALL"
                                    ? "No deals yet"
                                    : `No ${activeFilter.toLowerCase()} deals`}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            {search
                                ? "Try another crop name, buyer name, or status. You can also reset the filters."
                                : activeFilter === "ALL"
                                    ? "When buyers send offers for your produce, their deals will appear here."
                                    : `There are currently no deals with the ${activeFilter.toLowerCase()} status.`}
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
                                    Clear filters
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={refreshAll}
                                disabled={refreshing}
                                className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={15}
                                    className={refreshing ? "animate-spin" : ""}
                                />
                                Refresh Deals
                            </button>
                        </div>
                    </div>
                )}

                {/* Deal cards */}
                {!loading && filteredDeals.length > 0 && (
                    <div className="grid items-stretch gap-5 lg:grid-cols-2">
                        {filteredDeals.map((deal, index) => (
                            <div
                                key={deal._id}
                                className="deal-card-motion"
                                style={{
                                    animationDelay: `${Math.min(index * 65, 520)}ms`,
                                }}
                            >
                                <FarmerDealCard
                                    deal={deal}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    actionLoading={actionLoading === deal._id}
                                    reviewedDealIds={reviewedDealIds}
                                    onReviewSubmitted={handleReviewSubmitted}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer navigation */}
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
};

export default FarmerDeals;