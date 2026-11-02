// import { useState } from "react";

// import {
//     Sparkles,
//     Search,
//     MapPin,
//     Star,
//     Package,
//     TrendingUp,
//     RefreshCw,
//     AlertCircle,
// } from "lucide-react";

// import { getBuyerRecommendations } from "../../services/buyerServices";

// import RecommendationCard from "../../components/common/RecommendationCard";

// const initialCriteria = {
//     crop: "",
//     quantity: "",
//     unit: "KG",
//     maxPricePerUnit: "",
//     preferredQuality: "",
//     location: "",
// };

// const formatPrice = (price) => {
//     const value = Number(price);

//     if (!Number.isFinite(value)) return "Price unavailable";

//     return `₹${value.toLocaleString("en-IN")}`;
// };

// const BuyerAIRecommendations = () => {
//     const [criteria, setCriteria] = useState(initialCriteria);
//     const [recommendations, setRecommendations] = useState([]);
//     const [resultInfo, setResultInfo] = useState(null);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     // Handle search preference changes.
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setCriteria((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };

//     // Fetch Buyer AI recommendations.
//     const handleSearch = async (e) => {
//         e.preventDefault();

//         setLoading(true);
//         setError("");

//         try {
//             const payload = {
//                 ...criteria,
//                 limit: 10,
//             };

//             // Remove empty optional values.
//             Object.keys(payload).forEach((key) => {
//                 if (
//                     payload[key] === "" ||
//                     payload[key] === null ||
//                     payload[key] === undefined
//                 ) {
//                     delete payload[key];
//                 }
//             });

//             const response = await getBuyerRecommendations(payload);

//             setRecommendations(response.recommendations || []);
//             setResultInfo(response);
//         } catch (err) {
//             setError(
//                 err.message || "Unable to generate recommendations."
//             );

//             setRecommendations([]);
//             setResultInfo(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Reset search preferences and results.
//     const handleReset = () => {
//         setCriteria(initialCriteria);
//         setRecommendations([]);
//         setResultInfo(null);
//         setError("");
//     };

//     return (
//         <section className="mt-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">

//             {/* HEADER */}
//             <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white">

//                 <div className="flex flex-wrap items-center justify-between gap-4">

//                     <div>
//                         <div className="mb-2 flex items-center gap-2">
//                             <Sparkles size={20} />

//                             <span className="text-sm font-semibold uppercase tracking-wider">
//                                 AI Marketplace
//                             </span>
//                         </div>

//                         <h2 className="text-2xl font-bold">
//                             Smart Produce Recommendations
//                         </h2>

//                         <p className="mt-2 max-w-xl text-sm text-green-50">
//                             Find suitable produce listings without manually
//                             browsing hundreds of farmer listings.
//                         </p>
//                     </div>

//                     <div className="rounded-xl bg-white/15 p-4">
//                         <Sparkles size={32} />
//                     </div>

//                 </div>
//             </div>

//             {/* SEARCH PREFERENCES */}
//             <form onSubmit={handleSearch} className="space-y-5 p-6">

//                 <div>
//                     <h3 className="text-lg font-bold text-gray-800">
//                         What are you looking for?
//                     </h3>

//                     <p className="mt-1 text-sm text-gray-500">
//                         Add your preferences to improve recommendation relevance.
//                     </p>
//                 </div>

//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

//                     {/* CROP */}
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-gray-700">
//                             Crop
//                         </label>

//                         <input
//                             type="text"
//                             name="crop"
//                             value={criteria.crop}
//                             onChange={handleChange}
//                             placeholder="e.g. Tomato"
//                             className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                         />
//                     </div>

//                     {/* QUANTITY */}
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-gray-700">
//                             Required quantity
//                         </label>

//                         <input
//                             type="number"
//                             name="quantity"
//                             min="0.01"
//                             step="any"
//                             value={criteria.quantity}
//                             onChange={handleChange}
//                             placeholder="e.g. 100"
//                             className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                         />
//                     </div>

//                     {/* UNIT */}
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-gray-700">
//                             Unit
//                         </label>

//                         <select
//                             name="unit"
//                             value={criteria.unit}
//                             onChange={handleChange}
//                             className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
//                         >
//                             <option value="KG">Kilogram (KG)</option>
//                             <option value="QUINTAL">Quintal</option>
//                             <option value="TON">Ton</option>
//                         </select>
//                     </div>

//                     {/* MAXIMUM PRICE */}
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-gray-700">
//                             Maximum price per unit (₹)
//                         </label>

//                         <input
//                             type="number"
//                             name="maxPricePerUnit"
//                             min="0"
//                             step="any"
//                             value={criteria.maxPricePerUnit}
//                             onChange={handleChange}
//                             placeholder="e.g. 30"
//                             className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                         />
//                     </div>

//                     {/* QUALITY */}
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-gray-700">
//                             Preferred quality
//                         </label>

//                         <select
//                             name="preferredQuality"
//                             value={criteria.preferredQuality}
//                             onChange={handleChange}
//                             className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
//                         >
//                             <option value="">Any quality</option>
//                             <option value="STANDARD">Standard</option>
//                             <option value="GOOD">Good</option>
//                             <option value="PREMIUM">Premium</option>
//                         </select>
//                     </div>

//                     {/* LOCATION */}
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-gray-700">
//                             Preferred location
//                         </label>

//                         <input
//                             type="text"
//                             name="location"
//                             value={criteria.location}
//                             onChange={handleChange}
//                             placeholder="e.g. Puducherry"
//                             className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
//                         />
//                     </div>

//                 </div>

//                 {/* ACTION BUTTONS */}
//                 <div className="flex flex-wrap gap-3">

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
//                     >
//                         {loading ? (
//                             <RefreshCw size={18} className="animate-spin" />
//                         ) : (
//                             <Search size={18} />
//                         )}

//                         {loading
//                             ? "Finding best listings..."
//                             : "Find Best Listings"}
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleReset}
//                         disabled={loading}
//                         className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
//                     >
//                         Reset
//                     </button>

//                 </div>
//             </form>

//             {/* ERROR */}
//             {error && (
//                 <div className="mx-6 mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

//                     <AlertCircle size={20} className="mt-0.5 shrink-0" />

//                     <p className="text-sm">{error}</p>

//                 </div>
//             )}

//             {/* RECOMMENDATION RESULTS */}
//             {resultInfo && (
//                 <div className="border-t border-gray-100 bg-gray-50/70 p-6">

//                     {/* RESULTS HEADER */}
//                     <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

//                         <div>
//                             <h3 className="text-xl font-bold text-gray-800">
//                                 Recommended listings
//                             </h3>

//                             <p className="mt-1 text-sm text-gray-500">
//                                 {resultInfo.count} recommendations from{" "}
//                                 {resultInfo.scannedListings} eligible listings scanned.
//                             </p>
//                         </div>

//                         <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
//                             AI Ranked
//                         </span>

//                     </div>

//                     {/* SCAN LIMIT WARNING */}
//                     {resultInfo.truncated && (
//                         <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//                             The backend scan limit was reached. These results
//                             represent only the eligible listings included in that scan.
//                         </div>
//                     )}

//                     {/* EMPTY STATE */}
//                     {recommendations.length === 0 ? (

//                         <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">

//                             <Package
//                                 size={36}
//                                 className="mx-auto text-gray-400"
//                             />

//                             <h4 className="mt-3 font-semibold text-gray-800">
//                                 No matching listings found
//                             </h4>

//                             <p className="mt-1 text-sm text-gray-500">
//                                 Try changing your crop, price, quality, or location preferences.
//                             </p>

//                         </div>

//                     ) : (

//                         /* SHARED RECOMMENDATION CARDS */
//                         <div className="space-y-5">

//                             {recommendations.map((item, index) => (

//                                 <RecommendationCard
//                                     key={
//                                         item.listingId ||
//                                         item._id ||
//                                         item.rank ||
//                                         index
//                                     }

//                                     rank={item.rank ?? index + 1}

//                                     title={item.crop || "Produce"}

//                                     subtitle={
//                                         item.quality ||
//                                         "Quality not specified"
//                                     }

//                                     confidence={item.confidence}

//                                     score={item.score}

//                                     scoreBreakdown={item.scoreBreakdown}

//                                     explanation={
//                                         typeof item.explanation === "string"
//                                             ? {
//                                                 summary: item.explanation,
//                                             }
//                                             : item.explanation
//                                     }

//                                     rankingReasons={item.reasons}

//                                     scoreLabel="Buyer Recommendation Score"
//                                 >

//                                     {/* BUYER-SPECIFIC LISTING DETAILS */}

//                                     {/* PRICE */}
//                                     <div className="flex flex-wrap items-center justify-between gap-3">

//                                         <div>
//                                             <p className="text-xs font-medium text-gray-500">
//                                                 Expected price
//                                             </p>

//                                             <p className="text-2xl font-bold text-green-700">
//                                                 {formatPrice(item.expectedPrice)}
//                                             </p>

//                                             <p className="text-xs text-gray-500">
//                                                 per {item.unit || "unit"}
//                                             </p>
//                                         </div>

//                                         <div className="rounded-xl bg-green-50 px-4 py-3 text-right">
//                                             <p className="text-xs text-green-700">
//                                                 Available quantity
//                                             </p>

//                                             <p className="text-lg font-bold text-green-800">
//                                                 {item.quantity ?? "N/A"}{" "}
//                                                 {item.unit || ""}
//                                             </p>
//                                         </div>

//                                     </div>

//                                     {/* LISTING INFORMATION */}
//                                     <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

//                                         {/* QUANTITY */}
//                                         <div className="rounded-lg bg-gray-50 p-3">
//                                             <Package
//                                                 size={17}
//                                                 className="text-green-700"
//                                             />

//                                             <p className="mt-2 text-xs text-gray-500">
//                                                 Available quantity
//                                             </p>

//                                             <p className="font-semibold text-gray-800">
//                                                 {item.quantity ?? "N/A"}{" "}
//                                                 {item.unit || ""}
//                                             </p>
//                                         </div>

//                                         {/* LOCATION */}
//                                         <div className="rounded-lg bg-gray-50 p-3">
//                                             <MapPin
//                                                 size={17}
//                                                 className="text-green-700"
//                                             />

//                                             <p className="mt-2 text-xs text-gray-500">
//                                                 Location
//                                             </p>

//                                             <p className="font-semibold text-gray-800">
//                                                 {item.location ||
//                                                     item.farmer?.village ||
//                                                     "N/A"}
//                                             </p>
//                                         </div>

//                                         {/* SELLER RATING */}
//                                         <div className="rounded-lg bg-gray-50 p-3">
//                                             <Star
//                                                 size={17}
//                                                 className="text-amber-500"
//                                             />

//                                             <p className="mt-2 text-xs text-gray-500">
//                                                 Seller rating
//                                             </p>

//                                             <p className="font-semibold text-gray-800">
//                                                 {item.sellerRating != null
//                                                     ? `${item.sellerRating}/5`
//                                                     : "Not rated"}
//                                             </p>
//                                         </div>

//                                     </div>

//                                     {/* FARMER INFORMATION */}
//                                     <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-green-50 p-3">

//                                         <div>
//                                             <p className="text-xs text-gray-500">
//                                                 Listed by farmer
//                                             </p>

//                                             <p className="font-semibold text-gray-800">
//                                                 {item.farmer?.name || "Farmer"}
//                                             </p>

//                                             <p className="text-xs text-gray-500">
//                                                 {item.farmer?.village || ""}
//                                             </p>
//                                         </div>

//                                         {item.sellerReviewCount != null && (
//                                             <p className="text-xs text-gray-600">
//                                                 {item.sellerReviewCount} reviews
//                                             </p>
//                                         )}

//                                     </div>

//                                     {/* AVAILABILITY INFORMATION */}
//                                     <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">

//                                         {item.availableWeightPercent != null && (
//                                             <span className="rounded-full bg-green-50 px-3 py-1.5 text-green-700">
//                                                 Availability:{" "}
//                                                 {item.availableWeightPercent}%
//                                             </span>
//                                         )}

//                                         {item.availableFrom && (
//                                             <span className="rounded-full bg-gray-100 px-3 py-1.5">
//                                                 Available from:{" "}
//                                                 {new Date(
//                                                     item.availableFrom
//                                                 ).toLocaleDateString("en-IN")}
//                                             </span>
//                                         )}

//                                     </div>

//                                 </RecommendationCard>

//                             ))}

//                         </div>
//                     )}

//                     {/* DATA LIMITATIONS */}
//                     {Array.isArray(resultInfo.dataLimitations) &&
//                         resultInfo.dataLimitations.length > 0 && (

//                             <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">

//                                 <div className="mb-2 flex items-center gap-2 text-gray-700">

//                                     <TrendingUp size={17} />

//                                     <p className="text-sm font-semibold">
//                                         Recommendation limitations
//                                     </p>

//                                 </div>

//                                 <ul className="list-inside list-disc space-y-1 text-xs text-gray-500">

//                                     {resultInfo.dataLimitations.map(
//                                         (item, index) => (
//                                             <li key={index}>{item}</li>
//                                         )
//                                     )}

//                                 </ul>

//                             </div>
//                         )}

//                 </div>
//             )}

//         </section>
//     );
// };

// export default BuyerAIRecommendations;



import { useEffect, useState } from "react";

import {
    Sparkles,
    Search,
    MapPin,
    Star,
    Package,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getBuyerRecommendations } from "../../services/buyerServices";

import RecommendationCard from "../../components/common/RecommendationCard";

const initialCriteria = {
    crop: "",
    quantity: "",
    unit: "KG",
    maxPricePerUnit: "",
    preferredQuality: "",
    location: "",
};

const formatPrice = (price) => {
    const value = Number(price);

    if (!Number.isFinite(value)) return "Price unavailable";

    return `₹${value.toLocaleString("en-IN")}`;
};

const BuyerAIRecommendations = ({ mode = "full" }) => {
    const isDashboard = mode === "dashboard";

    const [criteria, setCriteria] = useState(initialCriteria);
    const [recommendations, setRecommendations] = useState([]);
    const [resultInfo, setResultInfo] = useState(null);

    const [loading, setLoading] = useState(isDashboard);
    const [error, setError] = useState("");

    // Fetch recommendations for the dashboard.
    const fetchDashboardRecommendations = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getBuyerRecommendations({
                limit: 3,
            });

            setRecommendations(response.recommendations || []);
            setResultInfo(response);
        } catch (err) {
            setError(
                err.message || "Unable to load AI recommendations."
            );

            setRecommendations([]);
            setResultInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Automatically load top 3 recommendations in dashboard mode.
    useEffect(() => {
        if (isDashboard) {
            fetchDashboardRecommendations();
        }
    }, [isDashboard]);

    // Handle search preference changes.
    const handleChange = (e) => {
        const { name, value } = e.target;

        setCriteria((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Fetch full Buyer AI recommendations.
    const handleSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const payload = {
                ...criteria,
                limit: 10,
            };

            Object.keys(payload).forEach((key) => {
                if (
                    payload[key] === "" ||
                    payload[key] === null ||
                    payload[key] === undefined
                ) {
                    delete payload[key];
                }
            });

            const response = await getBuyerRecommendations(payload);

            setRecommendations(response.recommendations || []);
            setResultInfo(response);
        } catch (err) {
            setError(
                err.message || "Unable to generate recommendations."
            );

            setRecommendations([]);
            setResultInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Reset search preferences and results.
    const handleReset = () => {
        setCriteria(initialCriteria);
        setRecommendations([]);
        setResultInfo(null);
        setError("");
    };

    return (
        <section className="mt-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white">

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Sparkles size={20} />

                            <span className="text-sm font-semibold uppercase tracking-wider">
                                AI Marketplace
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold">
                            {isDashboard
                                ? "Top AI Recommendations"
                                : "Smart Produce Recommendations"}
                        </h2>

                        <p className="mt-2 max-w-xl text-sm text-green-50">
                            {isDashboard
                                ? "Discover the best matching farmer listings selected by our AI recommendation engine."
                                : "Find suitable produce listings without manually browsing hundreds of farmer listings."}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/15 p-4">
                        <Sparkles size={32} />
                    </div>

                </div>
            </div>

            {/* FULL MODE SEARCH PREFERENCES */}
            {!isDashboard && (
                <form onSubmit={handleSearch} className="space-y-5 p-6">

                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            What are you looking for?
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add your preferences to improve recommendation relevance.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {/* CROP */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Crop
                            </label>

                            <input
                                type="text"
                                name="crop"
                                value={criteria.crop}
                                onChange={handleChange}
                                placeholder="e.g. Tomato"
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {/* QUANTITY */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Required quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                min="0.01"
                                step="any"
                                value={criteria.quantity}
                                onChange={handleChange}
                                placeholder="e.g. 100"
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {/* UNIT */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Unit
                            </label>

                            <select
                                name="unit"
                                value={criteria.unit}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
                            >
                                <option value="KG">Kilogram (KG)</option>
                                <option value="QUINTAL">Quintal</option>
                                <option value="TON">Ton</option>
                            </select>
                        </div>

                        {/* MAXIMUM PRICE */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Maximum price per unit (₹)
                            </label>

                            <input
                                type="number"
                                name="maxPricePerUnit"
                                min="0"
                                step="any"
                                value={criteria.maxPricePerUnit}
                                onChange={handleChange}
                                placeholder="e.g. 30"
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        {/* QUALITY */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Preferred quality
                            </label>

                            <select
                                name="preferredQuality"
                                value={criteria.preferredQuality}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
                            >
                                <option value="">Any quality</option>
                                <option value="STANDARD">Standard</option>
                                <option value="GOOD">Good</option>
                                <option value="PREMIUM">Premium</option>
                            </select>
                        </div>

                        {/* LOCATION */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Preferred location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={criteria.location}
                                onChange={handleChange}
                                placeholder="e.g. Puducherry"
                                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-3">

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <RefreshCw size={18} className="animate-spin" />
                            ) : (
                                <Search size={18} />
                            )}

                            {loading
                                ? "Finding best listings..."
                                : "Find Best Listings"}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                        >
                            Reset
                        </button>

                    </div>
                </form>
            )}

            {/* DASHBOARD ACTIONS */}
            {isDashboard && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">

                    <p className="text-sm text-gray-500">
                        Showing your top 3 AI-ranked listings.
                    </p>

                    <button
                        type="button"
                        onClick={fetchDashboardRecommendations}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh recommendations
                    </button>

                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="mx-6 my-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

                    <AlertCircle size={20} className="mt-0.5 shrink-0" />

                    <p className="text-sm">{error}</p>

                </div>
            )}

            {/* LOADING STATE */}
            {loading && !resultInfo && (
                <div className="space-y-4 p-6">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-xl border border-gray-100 p-5"
                        >
                            <div className="h-5 w-1/3 rounded bg-gray-200" />
                            <div className="mt-4 h-4 w-2/3 rounded bg-gray-100" />
                            <div className="mt-3 h-4 w-1/2 rounded bg-gray-100" />
                        </div>
                    ))}

                </div>
            )}

            {/* RECOMMENDATION RESULTS */}
            {resultInfo && (
                <div className="border-t border-gray-100 bg-gray-50/70 p-6">

                    {/* RESULTS HEADER */}
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {isDashboard
                                    ? "Best matching listings"
                                    : "Recommended listings"}
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {resultInfo.count ?? recommendations.length} recommendations from{" "}
                                {resultInfo.scannedListings ?? "available"} eligible listings scanned.
                            </p>
                        </div>

                        <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
                            AI Ranked
                        </span>

                    </div>

                    {/* SCAN LIMIT WARNING */}
                    {resultInfo.truncated && (
                        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            The backend scan limit was reached. These results
                            represent only the eligible listings included in that scan.
                        </div>
                    )}

                    {/* EMPTY STATE */}
                    {recommendations.length === 0 ? (

                        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">

                            <Package
                                size={36}
                                className="mx-auto text-gray-400"
                            />

                            <h4 className="mt-3 font-semibold text-gray-800">
                                No matching listings found
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                                {isDashboard
                                    ? "There are currently no eligible produce listings to recommend."
                                    : "Try changing your crop, price, quality, or location preferences."}
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-5">

                            {recommendations.map((item, index) => (

                                <RecommendationCard
                                    key={
                                        item.listingId ||
                                        item._id ||
                                        item.rank ||
                                        index
                                    }

                                    rank={item.rank ?? index + 1}

                                    title={item.crop || "Produce"}

                                    subtitle={
                                        item.quality ||
                                        "Quality not specified"
                                    }

                                    confidence={item.confidence}

                                    score={item.score}

                                    scoreBreakdown={item.scoreBreakdown}

                                    explanation={
                                        typeof item.explanation === "string"
                                            ? {
                                                summary: item.explanation,
                                            }
                                            : item.explanation
                                    }

                                    rankingReasons={item.reasons}

                                    scoreLabel="Buyer Recommendation Score"
                                >

                                    {/* DASHBOARD COMPACT DETAILS */}
                                    {isDashboard ? (

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                                            <div className="rounded-lg bg-green-50 p-3">
                                                <p className="text-xs text-gray-500">
                                                    Expected price
                                                </p>

                                                <p className="mt-1 font-bold text-green-700">
                                                    {formatPrice(item.expectedPrice)}
                                                    <span className="ml-1 text-xs font-medium">
                                                        / {item.unit || "unit"}
                                                    </span>
                                                </p>
                                            </div>

                                            <div className="rounded-lg bg-gray-50 p-3">
                                                <p className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Package size={14} />
                                                    Available quantity
                                                </p>

                                                <p className="mt-1 font-semibold text-gray-800">
                                                    {item.quantity ?? "N/A"} {item.unit || ""}
                                                </p>
                                            </div>

                                            <div className="rounded-lg bg-gray-50 p-3">
                                                <p className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin size={14} />
                                                    Farmer location
                                                </p>

                                                <p className="mt-1 font-semibold text-gray-800">
                                                    {item.location ||
                                                        item.farmer?.village ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-3">

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Listed by
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        {item.farmer?.name || "Farmer"}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                                                    <Star
                                                        size={16}
                                                        className="text-amber-500"
                                                    />

                                                    {item.sellerRating != null
                                                        ? `${item.sellerRating}/5`
                                                        : "Not rated"}
                                                </div>

                                            </div>

                                        </div>

                                    ) : (

                                        /* FULL MODE LISTING DETAILS */
                                        <>
                                            <div className="flex flex-wrap items-center justify-between gap-3">

                                                <div>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        Expected price
                                                    </p>

                                                    <p className="text-2xl font-bold text-green-700">
                                                        {formatPrice(item.expectedPrice)}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        per {item.unit || "unit"}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-green-50 px-4 py-3 text-right">
                                                    <p className="text-xs text-green-700">
                                                        Available quantity
                                                    </p>

                                                    <p className="text-lg font-bold text-green-800">
                                                        {item.quantity ?? "N/A"}{" "}
                                                        {item.unit || ""}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">

                                                <div className="rounded-lg bg-gray-50 p-3">
                                                    <Package size={17} className="text-green-700" />

                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Available quantity
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        {item.quantity ?? "N/A"} {item.unit || ""}
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-gray-50 p-3">
                                                    <MapPin size={17} className="text-green-700" />

                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Location
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        {item.location ||
                                                            item.farmer?.village ||
                                                            "N/A"}
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-gray-50 p-3">
                                                    <Star size={17} className="text-amber-500" />

                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Seller rating
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        {item.sellerRating != null
                                                            ? `${item.sellerRating}/5`
                                                            : "Not rated"}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-green-50 p-3">

                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Listed by farmer
                                                    </p>

                                                    <p className="font-semibold text-gray-800">
                                                        {item.farmer?.name || "Farmer"}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {item.farmer?.village || ""}
                                                    </p>
                                                </div>

                                                {item.sellerReviewCount != null && (
                                                    <p className="text-xs text-gray-600">
                                                        {item.sellerReviewCount} reviews
                                                    </p>
                                                )}

                                            </div>

                                            <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">

                                                {item.availableWeightPercent != null && (
                                                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-green-700">
                                                        Availability: {item.availableWeightPercent}%
                                                    </span>
                                                )}

                                                {item.availableFrom && (
                                                    <span className="rounded-full bg-gray-100 px-3 py-1.5">
                                                        Available from:{" "}
                                                        {new Date(item.availableFrom).toLocaleDateString("en-IN")}
                                                    </span>
                                                )}

                                            </div>
                                        </>
                                    )}

                                </RecommendationCard>

                            ))}

                        </div>
                    )}

                    {/* DATA LIMITATIONS */}
                    {!isDashboard &&
                        Array.isArray(resultInfo.dataLimitations) &&
                        resultInfo.dataLimitations.length > 0 && (

                            <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">

                                <div className="mb-2 flex items-center gap-2 text-gray-700">
                                    <TrendingUp size={17} />

                                    <p className="text-sm font-semibold">
                                        Recommendation limitations
                                    </p>
                                </div>

                                <ul className="list-inside list-disc space-y-1 text-xs text-gray-500">
                                    {resultInfo.dataLimitations.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>

                            </div>
                        )}

                </div>
            )}

        </section>
    );
};

export default BuyerAIRecommendations;
