
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
//     Leaf,
//     Award,
// } from "lucide-react";

// import { getBuyerRecommendations } from "../../services/buyerServices";

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

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setCriteria((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };

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

//     const handleReset = () => {
//         setCriteria(initialCriteria);
//         setRecommendations([]);
//         setResultInfo(null);
//         setError("");
//     };

//     const renderReasons = (reasons) => {
//         if (!Array.isArray(reasons)) return null;

//         return reasons.map((reason, index) => {
//             const text =
//                 typeof reason === "string"
//                     ? reason
//                     : reason?.message || reason?.reason || reason?.label;

//             if (!text) return null;

//             return (
//                 <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
//                     <span className="mt-1 text-green-600">✓</span>
//                     <span>{text}</span>
//                 </li>
//             );
//         });
//     };

//     const renderScoreBreakdown = (breakdown) => {
//         if (!breakdown || typeof breakdown !== "object") return null;

//         const entries = Object.entries(breakdown).filter(
//             ([, value]) =>
//                 typeof value === "number" ||
//                 typeof value === "string"
//         );

//         if (!entries.length) return null;

//         return (
//             <div className="mt-4 border-t border-gray-100 pt-4">
//                 <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                     Ranking breakdown
//                 </p>

//                 <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
//                     {entries.map(([key, value]) => (
//                         <div
//                             key={key}
//                             className="rounded-lg bg-gray-50 p-3"
//                         >
//                             <p className="text-xs capitalize text-gray-500">
//                                 {key.replace(/([A-Z])/g, " $1")}
//                             </p>
//                             <p className="mt-1 font-semibold text-gray-800">
//                                 {typeof value === "number"
//                                     ? Number(value.toFixed(2))
//                                     : value}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <section className="mt-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">

//             {/* Header */}
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

//             {/* Search preferences */}
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

//                     {/* Crop */}
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

//                     {/* Quantity */}
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

//                     {/* Unit */}
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

//                     {/* Maximum price */}
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

//                     {/* Quality */}
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

//                     {/* Location */}
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

//                         {loading ? "Finding best listings..." : "Find Best Listings"}
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleReset}
//                         disabled={loading}
//                         className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
//                     >
//                         Reset
//                     </button>
//                 </div>
//             </form>

//             {/* Error */}
//             {error && (
//                 <div className="mx-6 mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
//                     <AlertCircle size={20} className="mt-0.5 shrink-0" />
//                     <p className="text-sm">{error}</p>
//                 </div>
//             )}

//             {/* Results */}
//             {resultInfo && (
//                 <div className="border-t border-gray-100 bg-gray-50/70 p-6">

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

//                     {resultInfo.truncated && (
//                         <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
//                             The backend scan limit was reached. These results
//                             represent only the eligible listings included in that scan.
//                         </div>
//                     )}

//                     {recommendations.length === 0 ? (
//                         <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
//                             <Package size={36} className="mx-auto text-gray-400" />
//                             <h4 className="mt-3 font-semibold text-gray-800">
//                                 No matching listings found
//                             </h4>
//                             <p className="mt-1 text-sm text-gray-500">
//                                 Try changing your crop, price, quality, or location preferences.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="space-y-5">
//                             {recommendations.map((item) => (
//                                 <article
//                                     key={item.listingId || item._id || item.rank}
//                                     className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
//                                 >
//                                     {/* Listing header */}
//                                     <div className="flex flex-wrap items-start justify-between gap-3">
//                                         <div className="flex items-center gap-3">
//                                             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 font-bold text-green-800">
//                                                 #{item.rank}
//                                             </div>

//                                             <div>
//                                                 <h4 className="text-lg font-bold text-gray-800">
//                                                     {item.crop || "Produce"}
//                                                 </h4>
//                                                 <p className="text-sm text-gray-500">
//                                                     {item.quality || "Quality not specified"}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         <div className="text-right">
//                                             <p className="text-xl font-bold text-green-700">
//                                                 {formatPrice(item.expectedPrice)}
//                                             </p>
//                                             <p className="text-xs text-gray-500">
//                                                 per {item.unit || "unit"}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {/* Listing details */}
//                                     <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
//                                         <div className="rounded-lg bg-gray-50 p-3">
//                                             <Package size={17} className="text-green-700" />
//                                             <p className="mt-2 text-xs text-gray-500">
//                                                 Available quantity
//                                             </p>
//                                             <p className="font-semibold text-gray-800">
//                                                 {item.quantity ?? "N/A"} {item.unit || ""}
//                                             </p>
//                                         </div>

//                                         <div className="rounded-lg bg-gray-50 p-3">
//                                             <MapPin size={17} className="text-green-700" />
//                                             <p className="mt-2 text-xs text-gray-500">
//                                                 Location
//                                             </p>
//                                             <p className="font-semibold text-gray-800">
//                                                 {item.location || item.farmer?.village || "N/A"}
//                                             </p>
//                                         </div>

//                                         <div className="rounded-lg bg-gray-50 p-3">
//                                             <Star size={17} className="text-amber-500" />
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

//                                     {/* Farmer details */}
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

//                                     {/* AI explanation */}
//                                     {item.explanation && (
//                                         <div className="mt-4 rounded-lg border border-purple-100 bg-purple-50 p-4">
//                                             <div className="mb-2 flex items-center gap-2 text-purple-800">
//                                                 <Sparkles size={17} />
//                                                 <p className="text-sm font-bold">
//                                                     AI recommendation explanation
//                                                 </p>
//                                             </div>
//                                             <p className="text-sm leading-relaxed text-gray-700">
//                                                 {item.explanation}
//                                             </p>
//                                         </div>
//                                     )}

//                                     {/* Ranking reasons */}
//                                     {Array.isArray(item.reasons) &&
//                                         item.reasons.length > 0 && (
//                                             <div className="mt-4">
//                                                 <div className="mb-2 flex items-center gap-2">
//                                                     <Award size={17} className="text-green-700" />
//                                                     <p className="text-sm font-bold text-gray-800">
//                                                         Why this listing ranks here
//                                                     </p>
//                                                 </div>

//                                                 <ul className="space-y-2">
//                                                     {renderReasons(item.reasons)}
//                                                 </ul>
//                                             </div>
//                                         )}

//                                     {/* Confidence and availability */}
//                                     <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
//                                         {item.confidence && (
//                                             <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
//                                                 Confidence: {String(item.confidence)}
//                                             </span>
//                                         )}

//                                         {item.availableWeightPercent != null && (
//                                             <span className="rounded-full bg-green-50 px-3 py-1.5 text-green-700">
//                                                 Availability: {item.availableWeightPercent}%
//                                             </span>
//                                         )}

//                                         {item.availableFrom && (
//                                             <span className="rounded-full bg-gray-100 px-3 py-1.5">
//                                                 Available from: {new Date(item.availableFrom).toLocaleDateString("en-IN")}
//                                             </span>
//                                         )}
//                                     </div>

//                                     {renderScoreBreakdown(item.scoreBreakdown)}
//                                 </article>
//                             ))}
//                         </div>
//                     )}

//                     {/* Data limitations */}
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
//                                     {resultInfo.dataLimitations.map((item, index) => (
//                                         <li key={index}>{item}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                 </div>
//             )}
//         </section>
//     );
// };

// export default BuyerAIRecommendations;



import { useState } from "react";
import {
    Sparkles,
    Search,
    MapPin,
    Star,
    Package,
    TrendingUp,
    RefreshCw,
    AlertCircle,
    Leaf,
    Award,
} from "lucide-react";

import { getBuyerRecommendations } from "../../services/buyerServices";

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

const BuyerAIRecommendations = () => {
    const [criteria, setCriteria] = useState(initialCriteria);
    const [recommendations, setRecommendations] = useState([]);
    const [resultInfo, setResultInfo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCriteria((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const payload = {
                ...criteria,
                limit: 10,
            };

            // Remove empty optional values.
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

    const handleReset = () => {
        setCriteria(initialCriteria);
        setRecommendations([]);
        setResultInfo(null);
        setError("");
    };

    const renderReasons = (reasons) => {
        if (!Array.isArray(reasons)) return null;

        return reasons.map((reason, index) => {
            const text =
                typeof reason === "string"
                    ? reason
                    : reason?.message || reason?.reason || reason?.label;

            if (!text) return null;

            return (
                <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-600"
                >
                    <span className="mt-1 text-green-600">✓</span>
                    <span>{text}</span>
                </li>
            );
        });
    };

    const renderScoreBreakdown = (breakdown) => {
        if (!breakdown || typeof breakdown !== "object") return null;

        const entries = Object.entries(breakdown).filter(
            ([, value]) =>
                typeof value === "number" ||
                typeof value === "string"
        );

        if (!entries.length) return null;

        return (
            <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Ranking breakdown
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {entries.map(([key, value]) => (
                        <div
                            key={key}
                            className="rounded-lg bg-gray-50 p-3"
                        >
                            <p className="text-xs capitalize text-gray-500">
                                {key.replace(/([A-Z])/g, " $1")}
                            </p>

                            <p className="mt-1 font-semibold text-gray-800">
                                {typeof value === "number"
                                    ? Number(value.toFixed(2))
                                    : value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className="mt-8 overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm">

            {/* Header */}
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
                            Smart Produce Recommendations
                        </h2>

                        <p className="mt-2 max-w-xl text-sm text-green-50">
                            Find suitable produce listings without manually
                            browsing hundreds of farmer listings.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white/15 p-4">
                        <Sparkles size={32} />
                    </div>
                </div>
            </div>

            {/* Search preferences */}
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

                    {/* Crop */}
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

                    {/* Quantity */}
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

                    {/* Unit */}
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

                    {/* Maximum price */}
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

                    {/* Quality */}
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

                    {/* Location */}
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
                        className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        Reset
                    </button>
                </div>
            </form>

            {/* Error */}
            {error && (
                <div className="mx-6 mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />

                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Results */}
            {resultInfo && (
                <div className="border-t border-gray-100 bg-gray-50/70 p-6">

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Recommended listings
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {resultInfo.count} recommendations from{" "}
                                {resultInfo.scannedListings} eligible listings scanned.
                            </p>
                        </div>

                        <span className="rounded-full bg-green-100 px-3 py-1.5 text-sm font-semibold text-green-800">
                            AI Ranked
                        </span>
                    </div>

                    {resultInfo.truncated && (
                        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            The backend scan limit was reached. These results
                            represent only the eligible listings included in that scan.
                        </div>
                    )}

                    {recommendations.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
                            <Package size={36} className="mx-auto text-gray-400" />

                            <h4 className="mt-3 font-semibold text-gray-800">
                                No matching listings found
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                                Try changing your crop, price, quality, or location preferences.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {recommendations.map((item) => (
                                <article
                                    key={item.listingId || item._id || item.rank}
                                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                                >

                                    {/* Listing header */}
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 font-bold text-green-800">
                                                #{item.rank}
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800">
                                                    {item.crop || "Produce"}
                                                </h4>

                                                <p className="text-sm text-gray-500">
                                                    {item.quality || "Quality not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-bold text-green-700">
                                                {formatPrice(item.expectedPrice)}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                per {item.unit || "unit"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Listing details */}
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
                                                {item.location || item.farmer?.village || "N/A"}
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

                                    {/* Farmer details */}
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

                                    {/* AI explanation */}
                                    {item.explanation && (
                                        <div className="mt-4 rounded-lg border border-purple-100 bg-purple-50 p-4">
                                            <div className="mb-2 flex items-center gap-2 text-purple-800">
                                                <Sparkles size={17} />

                                                <p className="text-sm font-bold">
                                                    {item.explanation.title || "AI Recommendation"}
                                                </p>
                                            </div>

                                            <p className="text-sm leading-relaxed text-gray-700">
                                                {item.explanation.summary || "No explanation available."}
                                            </p>

                                            {Array.isArray(item.explanation.reasons) &&
                                                item.explanation.reasons.length > 0 && (
                                                    <ul className="mt-3 space-y-2">
                                                        {item.explanation.reasons.map((reason, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-start gap-2 text-sm text-gray-600"
                                                            >
                                                                <span className="mt-1 text-purple-600">
                                                                    ✓
                                                                </span>

                                                                <span>{reason}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                            {item.explanation.confidenceLabel && (
                                                <p className="mt-3 text-xs font-medium text-purple-700">
                                                    {item.explanation.confidenceLabel}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Ranking reasons */}
                                    {Array.isArray(item.reasons) &&
                                        item.reasons.length > 0 && (
                                            <div className="mt-4">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Award size={17} className="text-green-700" />

                                                    <p className="text-sm font-bold text-gray-800">
                                                        Why this listing ranks here
                                                    </p>
                                                </div>

                                                <ul className="space-y-2">
                                                    {renderReasons(item.reasons)}
                                                </ul>
                                            </div>
                                        )}

                                    {/* Confidence and availability */}
                                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">

                                        {item.confidence && (
                                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                                                Confidence: {String(item.confidence)}
                                            </span>
                                        )}

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

                                    {renderScoreBreakdown(item.scoreBreakdown)}
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Data limitations */}
                    {Array.isArray(resultInfo.dataLimitations) &&
                        resultInfo.dataLimitations.length > 0 && (
                            <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4">
                                <div className="mb-2 flex items-center gap-2 text-gray-700">
                                    <TrendingUp size={17} />

                                    <p className="text-sm font-semibold">
                                        Recommendation limitations
                                    </p>
                                </div>

                                <ul className="list-inside list-disc space-y-1 text-xs text-gray-500">
                                    {resultInfo.dataLimitations.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </div>
            )}
        </section>
    );
};

export default BuyerAIRecommendations;
