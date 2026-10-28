
// import { useEffect, useState } from "react";
// import {
//     Search,
//     RefreshCw,
//     TrendingUp,
// } from "lucide-react";

// import MarketPriceListCard from "../../components/Farmer/MarketPriceListCard";
// import MarketPriceHistoryChart from "../../components/MarketPrice/MarketPriceHistoryChart.jsx";
// import CurrentMandiPriceSearch from "../../components/CurrentMandiPriceSearch";
// import MandiSyncStatus from "../../components/MandiSyncStatus.jsx";

// import {
//     getMarketPrice,
// } from "../../services/MarketPriceServices.js";

// const MarketPrices = () => {
//     const [prices, setPrices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [search, setSearch] = useState("");

//     // Load saved market prices from the backend.
//     const loadPrices = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const data = await getMarketPrice();

//             setPrices(data.prices || []);
//         } catch (error) {
//             setError(
//                 error.message ||
//                     "Unable to load market prices."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load market prices when the page opens.
//     useEffect(() => {
//         loadPrices();
//     }, []);

//     // Filter existing market-price cards by crop name.
//     const filteredPrices = prices.filter((price) =>
//         (price.crop || "")
//             .toLowerCase()
//             .includes(search.toLowerCase().trim())
//     );

//     return (
//         <div className="min-h-screen bg-[#f7faf7]">
//             <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

//                 {/* Page Header */}
//                 <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
//                                 <TrendingUp size={23} />
//                             </div>

//                             <div>
//                                 <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
//                                     Market Prices
//                                 </h1>

//                                 <p className="mt-1 text-sm text-gray-500">
//                                     Check current reference prices before negotiating with buyers.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Refresh Existing Market Prices */}
//                     <button
//                         type="button"
//                         onClick={loadPrices}
//                         disabled={loading}
//                         className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
//                     >
//                         <RefreshCw
//                             size={17}
//                             className={
//                                 loading ? "animate-spin" : ""
//                             }
//                         />

//                         Refresh Prices
//                     </button>
//                 </div>

//                 {/* Mandi API Synchronization Status */}
//                 <section className="mb-8">
//                     <MandiSyncStatus
//                         onSyncSuccess={loadPrices}
//                     />
//                 </section>

//                 {/* Current State-Wise Live Mandi Price Search */}
//                 <section className="mb-8">
//                     <CurrentMandiPriceSearch />
//                 </section>

//                 {/* Historical Mandi Price Chart */}
//                 <div className="mb-8">
//                     <MarketPriceHistoryChart
//                         prices={prices}
//                     />
//                 </div>

//                 {/* Search Existing Market-Price Cards */}
//                 <div className="mb-7 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
//                     <div className="relative">
//                         <Search
//                             size={18}
//                             className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//                         />

//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(event) =>
//                                 setSearch(event.target.value)
//                             }
//                             placeholder="Search crop..."
//                             aria-label="Search saved market prices by crop"
//                             className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
//                         />
//                     </div>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                     <div
//                         role="alert"
//                         className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
//                     >
//                         {error}
//                     </div>
//                 )}

//                 {/* Loading Skeletons, Empty State, and Market-Price Cards */}
//                 {loading ? (
//                     <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//                         {[1, 2, 3].map((item) => (
//                             <div
//                                 key={item}
//                                 className="h-72 animate-pulse rounded-2xl bg-gray-200"
//                             />
//                         ))}
//                     </div>
//                 ) : filteredPrices.length === 0 ? (
//                     /* Empty State */
//                     <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
//                         <TrendingUp
//                             size={40}
//                             className="mx-auto text-gray-300"
//                         />

//                         <h3 className="mt-4 text-lg font-bold text-gray-800">
//                             No market prices found
//                         </h3>

//                         <p className="mt-1 text-sm text-gray-500">
//                             {search.trim()
//                                 ? "Try searching for another crop."
//                                 : "No saved market prices are available yet."}
//                         </p>

//                         <button
//                             type="button"
//                             onClick={loadPrices}
//                             disabled={loading}
//                             className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
//                         >
//                             <RefreshCw size={16} />
//                             Try Again
//                         </button>
//                     </div>
//                 ) : (
//                     /* Existing Market-Price Cards */
//                     <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//                         {filteredPrices.map((price) => (
//                             <MarketPriceListCard
//                                 key={price._id}
//                                 price={price}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MarketPrices;


import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    RefreshCw,
    TrendingUp,
    Sprout,
    X,
    AlertCircle,
    RotateCw,
} from "lucide-react";

import MarketPriceListCard from "../../components/Farmer/MarketPriceListCard";
import MarketPriceHistoryChart from "../../components/MarketPrice/MarketPriceHistoryChart.jsx";
import CurrentMandiPriceSearch from "../../components/CurrentMandiPriceSearch";
import MandiSyncStatus from "../../components/MandiSyncStatus.jsx";

import { getMarketPrice } from "../../services/MarketPriceServices.js";

const MarketPrices = () => {
    const navigate = useNavigate();

    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const loadPrices = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getMarketPrice();
            setPrices(Array.isArray(data?.prices) ? data.prices : []);
        } catch (err) {
            setError(err.message || "Unable to load market prices.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadPrices();
    }, [loadPrices]);

    const filteredPrices = prices.filter((price) =>
        (price.crop || "")
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    );

    return (
        <main className="market-page min-h-screen bg-[#f6f9f5] text-gray-900">
            <style>{`
                @keyframes marketEnter {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes marketReveal {
                    from {
                        opacity: 0;
                        transform: translateY(12px) scale(.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes marketPulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(34, 197, 94, .35);
                    }
                    50% {
                        box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
                    }
                }

                @keyframes marketShimmer {
                    from { background-position: 150% 0; }
                    to { background-position: -150% 0; }
                }

                @keyframes marketSpin {
                    to { transform: rotate(360deg); }
                }

                .market-enter {
                    animation: marketEnter .5s cubic-bezier(.2,.7,.2,1) both;
                }

                .market-reveal {
                    animation: marketReveal .45s cubic-bezier(.2,.7,.2,1) both;
                }

                .market-live-dot {
                    animation: marketPulse 1.8s ease-out infinite;
                }

                .market-shimmer {
                    background: linear-gradient(
                        100deg,
                        #e7ede5 25%,
                        #f8faf7 45%,
                        #e7ede5 65%
                    );
                    background-size: 220% 100%;
                    animation: marketShimmer 1.45s linear infinite;
                }

                .market-refresh-spin {
                    animation: marketSpin .8s linear infinite;
                }

                .market-section {
                    border: 1px solid #e5eae2;
                    border-radius: 20px;
                    background: white;
                    box-shadow: 0 3px 14px rgba(24, 60, 35, .035);
                    transition: box-shadow .25s ease, border-color .25s ease;
                }

                .market-section:hover {
                    border-color: #d3e4d0;
                    box-shadow: 0 8px 24px rgba(24, 60, 35, .065);
                }

                .market-price-card {
                    min-width: 0;
                    animation: marketReveal .5s cubic-bezier(.2,.7,.2,1) both;
                    transition: transform .25s ease, box-shadow .25s ease;
                }

                .market-price-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 14px 28px rgba(25, 65, 36, .09);
                }

                @media (prefers-reduced-motion: reduce) {
                    .market-page *,
                    .market-page *::before,
                    .market-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        scroll-behavior: auto !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-7xl space-y-7 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">

                {/* Navigation and page title */}
                <header className="market-enter flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/farmer/dashboard")}
                            aria-label="Back to Farmer Dashboard"
                            className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-green-300 hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-4 focus:ring-green-100"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <Sprout size={17} className="text-green-700" />
                                <span className="text-xs font-bold uppercase tracking-[.16em] text-green-700">
                                    KrishiConnect
                                </span>
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                                Market Prices
                            </h1>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                                Explore mandi prices, search crops, and compare market trends before selling your produce.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadPrices(true)}
                        disabled={loading || refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "market-refresh-spin" : ""}
                        />
                        {refreshing ? "Refreshing..." : "Refresh Prices"}
                    </button>
                </header>

                {/* Dynamic status line */}
                <div
                    className="market-enter flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50/80 px-4 py-3"
                    style={{ animationDelay: "70ms" }}
                >
                    <div className="flex items-center gap-3">
                        <span className="market-live-dot h-2.5 w-2.5 rounded-full bg-green-500" />
                        <div>
                            <p className="text-sm font-semibold text-green-900">
                                Market data overview
                            </p>
                            <p className="mt-0.5 text-xs text-green-800/75">
                                {loading
                                    ? "Retrieving saved prices from the server..."
                                    : error
                                        ? "Unable to verify the latest saved prices."
                                        : `${prices.length} saved price record${prices.length === 1 ? "" : "s"} available`}
                            </p>
                        </div>
                    </div>

                    {!loading && !error && (
                        <span className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-semibold text-green-800">
                            {filteredPrices.length} matching result{filteredPrices.length === 1 ? "" : "s"}
                        </span>
                    )}
                </div>

                {/* Synchronization status */}
                <section
                    className="market-enter space-y-3"
                    style={{ animationDelay: "120ms" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full bg-green-600" />
                        <h2 className="text-lg font-bold">Mandi Synchronization</h2>
                    </div>

                    <div className="market-section p-4 sm:p-5">
                        <MandiSyncStatus
                            onSyncSuccess={() => loadPrices(true)}
                        />
                    </div>
                </section>

                {/* Live mandi search */}
                <section
                    className="market-enter space-y-3"
                    style={{ animationDelay: "180ms" }}
                >
                    <div className="flex items-center gap-2">
                        <span className="h-5 w-1 rounded-full bg-green-600" />
                        <h2 className="text-lg font-bold">Search Mandi Prices</h2>
                    </div>

                    <div className="market-section p-4 sm:p-5">
                        <CurrentMandiPriceSearch />
                    </div>
                </section>

                {/* Historical chart */}
                <section
                    className="market-enter space-y-3"
                    style={{ animationDelay: "240ms" }}
                >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-1 rounded-full bg-green-600" />
                            <h2 className="text-lg font-bold">Historical Price Trends</h2>
                        </div>

                        <TrendingUp size={19} className="text-green-700" />
                    </div>

                    <div className="market-section overflow-hidden p-3 sm:p-5">
                        <MarketPriceHistoryChart prices={prices} />
                    </div>
                </section>

                {/* Saved prices and search */}
                <section
                    id="saved-market-prices"
                    className="market-enter scroll-mt-5 space-y-4"
                    style={{ animationDelay: "300ms" }}
                >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="h-5 w-1 rounded-full bg-green-600" />
                                <h2 className="text-lg font-bold sm:text-xl">
                                    Saved Crop Prices
                                </h2>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Search and explore available crop price records.
                            </p>
                        </div>

                        {!loading && !error && (
                            <p className="text-sm text-gray-500">
                                Showing{" "}
                                <span className="font-bold text-gray-800">
                                    {filteredPrices.length}
                                </span>{" "}
                                of {prices.length} records
                            </p>
                        )}
                    </div>

                    {/* Search input */}
                    <div className="market-section p-3 sm:p-4">
                        <div className="relative">
                            <Search
                                size={19}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by crop name..."
                                aria-label="Search saved market prices by crop"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-11 text-sm outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-green-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-all hover:rotate-90 hover:bg-green-100 hover:text-green-800"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error state */}
                    {error && (
                        <div
                            role="alert"
                            className="market-reveal flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle
                                    size={21}
                                    className="mt-0.5 shrink-0 text-red-600"
                                />
                                <div>
                                    <p className="font-semibold text-red-800">
                                        Could not load market prices
                                    </p>
                                    <p className="mt-1 text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => loadPrices(true)}
                                disabled={refreshing}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                <RotateCw size={15} />
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Animated loading skeletons */}
                    {loading ? (
                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {[0, 1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="market-enter rounded-2xl border border-gray-200 bg-white p-4"
                                    style={{ animationDelay: `${item * 100}ms` }}
                                >
                                    <div className="market-shimmer mb-5 h-36 rounded-xl" />
                                    <div className="market-shimmer mb-3 h-5 w-3/5 rounded-md" />
                                    <div className="market-shimmer mb-5 h-4 w-2/5 rounded-md" />
                                    <div className="market-shimmer mb-3 h-12 rounded-xl" />
                                    <div className="market-shimmer h-10 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : !error && filteredPrices.length === 0 ? (
                        /* Empty state */
                        <div className="market-reveal rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center sm:py-16">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-700 transition-transform duration-500 hover:rotate-6 hover:scale-110">
                                {search ? <Search size={30} /> : <Sprout size={32} />}
                            </div>

                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                {search ? "No matching crops found" : "No saved market prices"}
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                {search
                                    ? `No saved crop prices match "${search.trim()}". Try another crop name or clear your search.`
                                    : "No saved price records are available from the server right now. Try refreshing or checking the mandi synchronization status above."}
                            </p>

                            <div className="mt-5 flex flex-wrap justify-center gap-3">
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                        <X size={16} />
                                        Clear Search
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => loadPrices(true)}
                                    disabled={refreshing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-50"
                                >
                                    <RefreshCw
                                        size={16}
                                        className={refreshing ? "market-refresh-spin" : ""}
                                    />
                                    Refresh Prices
                                </button>
                            </div>
                        </div>
                    ) : !error ? (
                        /* Animated real data cards */
                        <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredPrices.map((price, index) => (
                                <div
                                    key={price._id || `${price.crop}-${index}`}
                                    className="market-price-card"
                                    style={{
                                        animationDelay: `${Math.min(index * 65, 520)}ms`,
                                    }}
                                >
                                    <MarketPriceListCard price={price} />
                                </div>
                            ))}
                        </div>
                    ) : null}
                </section>

                {/* Back navigation */}
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

export default MarketPrices;