// import { useEffect, useState } from "react";

// import {
//     Sparkles,
//     RefreshCw,
//     AlertCircle,
//     Star,
//     MapPin,
//     Package,
//     Users,
// } from "lucide-react";

// import { getFarmerRecommendations } from "../../services/farmerServices";
// import RecommendationCard from "../../components/common/RecommendationCard";

// const FarmerAIRecommendations = () => {
//     const [recommendations, setRecommendations] = useState([]);
//     const [dataLimitations, setDataLimitations] = useState([]);

//     const [loading, setLoading] = useState(true);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState("");

//     const [scannedOffers, setScannedOffers] = useState(0);

//     // ==========================================
//     // FETCH FARMER RECOMMENDATIONS
//     // ==========================================

//     const fetchRecommendations = async (isRefresh = false) => {
//         try {
//             if (isRefresh) {
//                 setRefreshing(true);
//             } else {
//                 setLoading(true);
//             }

//             setError("");

//             const response = await getFarmerRecommendations(10);

//             setRecommendations(response.recommendations || []);
//             setDataLimitations(response.dataLimitations || []);
//             setScannedOffers(response.scannedOffers || 0);

//         } catch (err) {
//             console.error("Farmer recommendations error:", err);
//             setError(err.message || "Unable to load buyer recommendations.");
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     };

//     useEffect(() => {
//         fetchRecommendations();
//     }, []);

//     // ==========================================
//     // FORMAT CURRENCY
//     // ==========================================

//     const formatCurrency = (amount) => {
//         if (amount === undefined || amount === null) {
//             return "Not available";
//         }

//         return new Intl.NumberFormat("en-IN", {
//             style: "currency",
//             currency: "INR",
//             maximumFractionDigits: 2,
//         }).format(amount);
//     };

//     // ==========================================
//     // RENDER BUYER RATING
//     // ==========================================

//     const renderRating = (rating, reviewCount) => {
//         if (typeof rating !== "number") {
//             return (
//                 <span className="text-xs text-gray-500">
//                     No buyer rating yet
//                 </span>
//             );
//         }

//         return (
//             <div className="flex items-center gap-1">
//                 <Star
//                     size={15}
//                     className="fill-yellow-400 text-yellow-400"
//                 />

//                 <span className="text-sm font-semibold text-gray-700">
//                     {rating.toFixed(1)}
//                 </span>

//                 <span className="text-xs text-gray-500">
//                     ({reviewCount || 0} reviews)
//                 </span>
//             </div>
//         );
//     };

//     // ==========================================
//     // LOADING STATE
//     // ==========================================

//     if (loading) {
//         return (
//             <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
//                 <div className="flex items-center gap-3">
//                     <RefreshCw className="animate-spin text-green-600" />

//                     <p className="font-medium text-gray-600">
//                         Finding the best buyers for your produce...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // ==========================================
//     // MAIN UI
//     // ==========================================

//     return (
//         <section className="space-y-6">

//             {/* HEADER */}

//             <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-lg">

//                 <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

//                     <div>
//                         <div className="mb-2 flex items-center gap-2">
//                             <Sparkles size={22} />

//                             <span className="text-sm font-semibold uppercase tracking-wider text-green-100">
//                                 AI Marketplace
//                             </span>
//                         </div>

//                         <h2 className="text-2xl font-bold">
//                             Best Buyers for Your Produce
//                         </h2>

//                         <p className="mt-2 max-w-xl text-sm text-green-100">
//                             Discover which buyers have the most suitable
//                             pending offers for your produce.
//                         </p>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={() => fetchRecommendations(true)}
//                         disabled={refreshing}
//                         className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:opacity-60"
//                     >
//                         <RefreshCw
//                             size={16}
//                             className={refreshing ? "animate-spin" : ""}
//                         />

//                         {refreshing ? "Refreshing..." : "Refresh"}
//                     </button>

//                 </div>

//                 <div className="mt-6 flex flex-wrap gap-6">

//                     <div>
//                         <p className="text-2xl font-bold">
//                             {recommendations.length}
//                         </p>

//                         <p className="text-xs text-green-100">
//                             Recommended Offers
//                         </p>
//                     </div>

//                     <div>
//                         <p className="text-2xl font-bold">
//                             {scannedOffers}
//                         </p>

//                         <p className="text-xs text-green-100">
//                             Pending Offers Scanned
//                         </p>
//                     </div>

//                 </div>
//             </div>

//             {/* ERROR STATE */}

//             {error && (
//                 <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

//                     <AlertCircle className="mt-0.5 text-red-600" />

//                     <div className="flex-1">
//                         <p className="font-semibold text-red-700">
//                             Unable to load recommendations
//                         </p>

//                         <p className="mt-1 text-sm text-red-600">
//                             {error}
//                         </p>

//                         <button
//                             type="button"
//                             onClick={() => fetchRecommendations()}
//                             className="mt-3 text-sm font-semibold text-red-700 underline"
//                         >
//                             Try again
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* EMPTY STATE */}

//             {!error && recommendations.length === 0 && (
//                 <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">

//                     <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
//                         <Users size={30} className="text-green-600" />
//                     </div>

//                     <h3 className="mt-4 text-lg font-bold text-gray-800">
//                         No pending buyer offers yet
//                     </h3>

//                     <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
//                         When buyers submit offers for your produce,
//                         AI will rank the most suitable offers here.
//                     </p>

//                     <button
//                         type="button"
//                         onClick={() => fetchRecommendations(true)}
//                         disabled={refreshing}
//                         className="mt-5 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
//                     >
//                         Check Again
//                     </button>

//                 </div>
//             )}

//             {/* RECOMMENDATION CARDS */}

//             {recommendations.length > 0 && (
//                 <div className="space-y-5">

//                     {recommendations.map((item, index) => {

//                         // Normalize explanation so the shared component
//                         // receives a consistent object.
//                         const explanation =
//                             typeof item.explanation === "string"
//                                 ? { summary: item.explanation }
//                                 : item.explanation;

//                         return (
//                             <RecommendationCard
//                                 key={item.dealId || item.rank || index}
//                                 rank={item.rank ?? index + 1}
//                                 title={item.buyer?.name || "Unknown Buyer"}
//                                 subtitle={item.produce?.crop || "Produce"}
//                                 confidence={item.confidence}
//                                 score={item.score}
//                                 scoreBreakdown={item.scoreBreakdown}
//                                 explanation={explanation}
//                                 rankingReasons={
//                                     item.reasons ||
//                                     item.rankingReasons ||
//                                     []
//                                 }
//                                 scoreLabel="Buyer Recommendation Score"
//                             >

//                                 {/* BUYER DETAILS */}

//                                 <div className="grid gap-5 md:grid-cols-2">

//                                     <div>
//                                         <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
//                                             Buyer Details
//                                         </p>

//                                         <h4 className="mt-1 text-lg font-bold text-gray-800">
//                                             {item.buyer?.name || "Unknown Buyer"}
//                                         </h4>

//                                         <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
//                                             <MapPin size={14} />

//                                             {item.buyer?.village ||
//                                                 "Location unavailable"}
//                                         </div>

//                                         <div className="mt-3">
//                                             {renderRating(
//                                                 item.buyerRating,
//                                                 item.buyerReviewCount
//                                             )}
//                                         </div>
//                                     </div>

//                                     {/* PRODUCE DETAILS */}

//                                     <div>
//                                         <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
//                                             Produce Details
//                                         </p>

//                                         <h4 className="mt-1 text-lg font-bold text-gray-800">
//                                             {item.produce?.crop || "Produce"}
//                                         </h4>

//                                         <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
//                                             <Package size={15} />

//                                             {item.quantity ?? "Not specified"}{" "}
//                                             {item.unit || ""}
//                                         </div>

//                                         <div className="mt-2 text-sm text-gray-500">
//                                             Quality:{" "}
//                                             {item.produce?.quality ||
//                                                 "Not specified"}
//                                         </div>
//                                     </div>

//                                 </div>

//                                 {/* OFFER INFORMATION */}

//                                 <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

//                                     <div className="rounded-xl bg-green-50 p-4">
//                                         <p className="text-xs text-green-700">
//                                             Offered Price
//                                         </p>

//                                         <p className="mt-1 text-lg font-bold text-green-800">
//                                             {formatCurrency(item.offeredPrice)}
//                                         </p>
//                                     </div>

//                                     <div className="rounded-xl bg-blue-50 p-4">
//                                         <p className="text-xs text-blue-700">
//                                             Total Deal Value
//                                         </p>

//                                         <p className="mt-1 text-lg font-bold text-blue-800">
//                                             {formatCurrency(item.totalAmount)}
//                                         </p>
//                                     </div>

//                                 </div>

//                             </RecommendationCard>
//                         );
//                     })}

//                 </div>
//             )}

//             {/* DATA LIMITATIONS */}

//             {dataLimitations.length > 0 && (
//                 <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

//                     <h4 className="font-bold text-yellow-800">
//                         Important recommendation notes
//                     </h4>

//                     <ul className="mt-3 space-y-2">
//                         {dataLimitations.map((limitation, index) => (
//                             <li
//                                 key={index}
//                                 className="flex gap-2 text-sm text-yellow-800"
//                             >
//                                 <span>•</span>
//                                 <span>{limitation}</span>
//                             </li>
//                         ))}
//                     </ul>

//                 </div>
//             )}

//         </section>
//     );
// };

// export default FarmerAIRecommendations;


import { useCallback, useEffect, useState } from "react";

import {
    Sparkles,
    RefreshCw,
    AlertCircle,
    Star,
    MapPin,
    Package,
    Users,
    ArrowRight,
    IndianRupee,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getFarmerRecommendations } from "../../services/farmerServices";
import RecommendationCard from "../../components/common/RecommendationCard";

const FarmerAIRecommendations = ({ mode = "full" }) => {
    const isDashboard = mode === "dashboard";
    const recommendationLimit = isDashboard ? 3 : 10;

    const [recommendations, setRecommendations] = useState([]);
    const [dataLimitations, setDataLimitations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [scannedOffers, setScannedOffers] = useState(0);

    // ==========================================
    // FETCH FARMER RECOMMENDATIONS
    // ==========================================

    const fetchRecommendations = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            // Dashboard requests top 3.
            // Full page requests top 10.
            const response = await getFarmerRecommendations(
                recommendationLimit
            );

            const fetchedRecommendations = Array.isArray(
                response?.recommendations
            )
                ? response.recommendations
                : [];

            setRecommendations(
                fetchedRecommendations.slice(0, recommendationLimit)
            );

            setDataLimitations(
                Array.isArray(response?.dataLimitations)
                    ? response.dataLimitations
                    : []
            );

            setScannedOffers(response?.scannedOffers || 0);

        } catch (err) {
            console.error("Farmer recommendations error:", err);

            setError(
                err.message ||
                "Unable to load buyer recommendations."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [recommendationLimit]);

    useEffect(() => {
        fetchRecommendations();
    }, [fetchRecommendations]);

    // ==========================================
    // FORMAT CURRENCY
    // ==========================================

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) {
            return "Not available";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // ==========================================
    // RENDER BUYER RATING
    // ==========================================

    const renderRating = (rating, reviewCount) => {
        if (typeof rating !== "number") {
            return (
                <span className="text-xs text-gray-500">
                    No buyer rating yet
                </span>
            );
        }

        return (
            <div className="flex items-center gap-1">
                <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                />

                <span className="text-sm font-semibold text-gray-700">
                    {rating.toFixed(1)}
                </span>

                <span className="text-xs text-gray-500">
                    ({reviewCount || 0} reviews)
                </span>
            </div>
        );
    };

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        <RefreshCw
                            size={20}
                            className="animate-spin"
                        />
                    </div>

                    <div>
                        <p className="font-bold text-gray-800">
                            Finding the best buyers for your produce...
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            AI is analyzing pending buyer offers.
                        </p>
                    </div>

                </div>

                <div className="mt-6 space-y-3">
                    {[1, 2, 3].slice(
                        0,
                        isDashboard ? 3 : 2
                    ).map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-xl border border-gray-100 p-5"
                        >
                            <div className="h-4 w-1/3 rounded bg-gray-100" />
                            <div className="mt-3 h-3 w-2/3 rounded bg-gray-100" />
                            <div className="mt-5 h-10 rounded bg-gray-100" />
                        </div>
                    ))}
                </div>

            </div>
        );
    }

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <section className="space-y-6">

            {/* HEADER */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-lg sm:p-7">

                <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <div className="mb-2 flex items-center gap-2">
                            <Sparkles size={22} />

                            <span className="text-sm font-semibold uppercase tracking-wider text-green-100">
                                AI Marketplace
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold">
                            {isDashboard
                                ? "Your Top AI-Matched Buyers"
                                : "Best Buyers for Your Produce"}
                        </h2>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-green-100">
                            {isDashboard
                                ? "AI identifies the most suitable buyers from pending offers, helping you focus on the best opportunities."
                                : "Discover which buyers have the most suitable pending offers for your produce."}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() => fetchRecommendations(true)}
                        disabled={refreshing}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                </div>

                {/* SUMMARY */}

                <div className="relative mt-6 flex flex-wrap gap-6 border-t border-white/20 pt-5">

                    <div>
                        <p className="text-2xl font-bold">
                            {recommendations.length}
                        </p>

                        <p className="text-xs text-green-100">
                            Recommended Offers
                        </p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">
                            {scannedOffers}
                        </p>

                        <p className="text-xs text-green-100">
                            Pending Offers Scanned
                        </p>
                    </div>

                </div>

            </div>

            {/* ERROR STATE */}

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                    <AlertCircle
                        size={21}
                        className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div className="flex-1">

                        <p className="font-semibold text-red-700">
                            Unable to load recommendations
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => fetchRecommendations()}
                            className="mt-3 text-sm font-semibold text-red-700 underline"
                        >
                            Try again
                        </button>

                    </div>

                </div>
            )}

            {/* EMPTY STATE */}

            {!error && recommendations.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                        <Users
                            size={30}
                            className="text-green-600"
                        />
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-gray-800">
                        No pending buyer offers yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        When buyers submit offers for your produce,
                        AI will rank the most suitable offers here.
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchRecommendations(true)}
                        disabled={refreshing}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={15}
                            className={refreshing ? "animate-spin" : ""}
                        />

                        Check Again
                    </button>

                </div>
            )}

            {/* RECOMMENDATION CARDS */}

            {recommendations.length > 0 && (
                <div className="space-y-5">

                    {recommendations.map((item, index) => {

                        const explanation =
                            typeof item.explanation === "string"
                                ? { summary: item.explanation }
                                : item.explanation;

                        return (
                            <RecommendationCard
                                key={item.dealId || item.rank || index}
                                rank={item.rank ?? index + 1}
                                title={item.buyer?.name || "Unknown Buyer"}
                                subtitle={item.produce?.crop || "Produce"}
                                confidence={item.confidence}
                                score={item.score}
                                scoreBreakdown={item.scoreBreakdown}
                                explanation={explanation}
                                rankingReasons={
                                    item.reasons ||
                                    item.rankingReasons ||
                                    []
                                }
                                scoreLabel="Buyer Recommendation Score"
                            >

                                {/* BUYER DETAILS */}

                                <div className="grid gap-5 md:grid-cols-2">

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Buyer Details
                                        </p>

                                        <h4 className="mt-1 text-lg font-bold text-gray-800">
                                            {item.buyer?.name || "Unknown Buyer"}
                                        </h4>

                                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                                            <MapPin size={14} />

                                            {item.buyer?.village ||
                                                "Location unavailable"}
                                        </div>

                                        <div className="mt-3">
                                            {renderRating(
                                                item.buyerRating,
                                                item.buyerReviewCount
                                            )}
                                        </div>
                                    </div>

                                    {/* PRODUCE DETAILS */}

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Produce Details
                                        </p>

                                        <h4 className="mt-1 text-lg font-bold text-gray-800">
                                            {item.produce?.crop || "Produce"}
                                        </h4>

                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <Package size={15} />

                                            {item.quantity ?? "Not specified"}{" "}
                                            {item.unit || ""}
                                        </div>

                                        <div className="mt-2 text-sm text-gray-500">
                                            Quality:{" "}
                                            {item.produce?.quality ||
                                                "Not specified"}
                                        </div>
                                    </div>

                                </div>

                                {/* OFFER INFORMATION */}

                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                                    <div className="rounded-xl bg-green-50 p-4">
                                        <p className="text-xs text-green-700">
                                            Offered Price
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-green-800">
                                            {formatCurrency(item.offeredPrice)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-blue-50 p-4">
                                        <p className="text-xs text-blue-700">
                                            Total Deal Value
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-blue-800">
                                            {formatCurrency(item.totalAmount)}
                                        </p>
                                    </div>

                                </div>

                            </RecommendationCard>
                        );
                    })}

                </div>
            )}

            {/* DATA LIMITATIONS */}

            {dataLimitations.length > 0 && (
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5">

                    <h4 className="font-bold text-yellow-800">
                        Important recommendation notes
                    </h4>

                    <ul className="mt-3 space-y-2">
                        {dataLimitations.map((limitation, index) => (
                            <li
                                key={index}
                                className="flex gap-2 text-sm text-yellow-800"
                            >
                                <span>•</span>
                                <span>{limitation}</span>
                            </li>
                        ))}
                    </ul>

                </div>
            )}

            {/* FULL RECOMMENDATIONS LINK */}

            {isDashboard && (
                <div className="flex justify-end">
                    <Link
                        to="/farmer/deals"
                        className="group inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-700 shadow-sm transition hover:border-green-300 hover:bg-green-50"
                    >
                        View All Buyer Recommendations

                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            )}

        </section>
    );
};

export default FarmerAIRecommendations;
