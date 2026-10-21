// import {
//     Sprout,
//     Handshake,
//     IndianRupee,
//     Truck,
//     Plus,
//     TrendingUp,
//     ArrowRight,
// } from "lucide-react";

// import { useAuth } from "../../context/AuthContext";

// import FarmerSidebar from "../../components/Farmer/farmerSideBar";
// import FarmerHeader from "../../components/Farmer/FarmerHeader";
// import DashboardStatCard from "../../components/Farmer/DashboardStatCard";
// import MarketPriceCard from "../../components/Farmer/MarketPriceCard";
// import QuickActionCard from "../../components/Farmer/QuickActionCard";
// import { useEffect, useState } from "react";
// import { getFarmerDashboard } from "../../services/farmerServices.js";
// import { useNavigate } from "react-router-dom";
// import { getMarketPrice } from "../../services/MarketPriceServices.js";

// const FarmerDashboard = () => {
//     const navigate = useNavigate();
//     const { user } = useAuth();
//     const [mobileOpen, setMobileOpen] = useState(false);

//     // Data Fetching State (Placed inside the component)
//     const [dashboardData, setDashboardData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [marketPrices, setMarketPrices] = useState([]);
//     const [marketPricesLoading, setMarketPricesLoading] = useState(true);


//     useEffect(() => {
//         const loadDashboard = async () => {
//             try {
//                 setLoading(true);
//                 setError("");
//                 const data = await getFarmerDashboard();
//                 setDashboardData(data);
//             } catch (err) {
//                 console.error("Dashboard Loading Error: ", err);
//                 setError(err.message || "Unable to Load Dashboard.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadDashboard();
//     }, []);

//     useEffect(() => {
//         const loadMarketPrices =
//             async () => {
//                 try {
//                     setMarketPricesLoading(
//                         true
//                     );

//                     const data =
//                         await getMarketPrice();

//                     setMarketPrices(
//                         data.prices.slice(0, 3)
//                     );
//                 } catch (error) {
//                     console.error(
//                         "Market prices error:",
//                         error
//                     );
//                 } finally {
//                     setMarketPricesLoading(
//                         false
//                     );
//                 }
//             };

//         loadMarketPrices();
//     }, []);

//     const isSmallFarmer = user?.farmerType === "SMALL";

//     // Loading UI
//     if (loading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
//                 <div className="text-center">
//                     <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
//                     <p className="mt-4 text-sm font-medium text-gray-500">
//                         Loading your dashboard...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     // Error UI
//     if (error) {
//         return (
//             <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] p-6">
//                 <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
//                     <h2 className="text-lg font-bold text-gray-900">
//                         Unable to load dashboard
//                     </h2>
//                     <p className="mt-2 text-sm text-gray-500">{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="flex min-h-screen bg-[#f7faf7]">
//             <FarmerSidebar
//                 mobileOpen={mobileOpen}
//                 setMobileOpen={setMobileOpen}
//             />

//             <div className="flex min-w-0 flex-1 flex-col">
//                 <FarmerHeader setMobileOpen={setMobileOpen} />

//                 <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//                     <div className="mx-auto max-w-7xl">
//                         {/* Welcome Section */}
//                         <section className="mb-8 rounded-3xl bg-green-700 p-6 text-white shadow-sm sm:p-8">
//                             <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//                                 <div>
//                                     <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
//                                         <Sprout size={14} />
//                                         {isSmallFarmer ? "Assisted Mode" : "Trade Mode"}
//                                     </div>
//                                     <h1 className="text-2xl font-bold sm:text-3xl">
//                                         Good morning,{" "}
//                                         {user?.name?.split(" ")[0] || "Farmer"}! 👋
//                                     </h1>
//                                     <p className="mt-2 max-w-xl text-sm leading-6 text-green-50">
//                                         Manage your produce, discover market prices and connect directly with buyers.
//                                     </p>
//                                 </div>

//                                 <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50"
//                                     onClick={() => navigate("/farmer/produce/new")}>
//                                     <Plus size={18} />
//                                     Add Produce
//                                 </button>
//                             </div>
//                         </section>

//                         {/* Stats */}
//                         <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                             <DashboardStatCard
//                                 title="My Produce"
//                                 value={dashboardData?.stats?.activeProduce ?? 0}
//                                 subtitle="Active listings"
//                                 icon={Sprout}
//                             />
//                             <DashboardStatCard
//                                 title="Active Deals"
//                                 value={dashboardData?.stats?.activeDeals ?? 0}
//                                 subtitle="Deals in progress"
//                                 icon={Handshake}
//                             />
//                             <DashboardStatCard
//                                 title="Total Earnings"
//                                 value={`₹${dashboardData?.stats?.totalEarnings ?? 0}`}
//                                 subtitle="Paid Earnings"
//                                 icon={IndianRupee}
//                             />
//                             <DashboardStatCard
//                                 title="Deliveries"
//                                 value={dashboardData?.stats?.pendingDeliveries ?? 0}
//                                 subtitle="Pending delivery"
//                                 icon={Truck}
//                             />
//                         </section>

//                         {/* Main Grid */}
//                         <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//                             {/* Market Prices */}
//                             <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm xl:col-span-2">
//                                 <div className="mb-5 flex items-center justify-between">
//                                     <div>
//                                         <h2 className="text-lg font-bold text-gray-900">
//                                             Today's Market Prices
//                                         </h2>
//                                         <p className="mt-1 text-sm text-gray-500">
//                                             Reference prices for your region
//                                         </p>
//                                     </div>

//                                     <button className="hidden items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 sm:flex">
//                                         View all
//                                         <ArrowRight size={16} />
//                                     </button>
//                                 </div>
//                                 {marketPricesLoading ? (
//                                     <div className="grid gap-4 md:grid-cols-3">
//                                         {[1, 2, 3].map((item) => (
//                                             <div
//                                                 key={item}
//                                                 className="h-32 animate-pulse rounded-2xl bg-gray-200"
//                                             />
//                                         ))}
//                                     </div>
//                                 ) : (
//                                     <div className="grid gap-4 md:grid-cols-3">
//                                         {marketPrices.map((price) => (
//                                             <MarketPriceCard
//                                                 key={price._id}
//                                                 crop={price.crop}
//                                                 price={price.modalPrice}
//                                                 unit={price.unit}
//                                             />
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Farmer Profile */}
//                             <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
//                                 <div className="flex items-center gap-4">
//                                     <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
//                                         {user?.name?.charAt(0)?.toUpperCase()}
//                                     </div>
//                                     <div>
//                                         <h2 className="font-bold text-gray-900">
//                                             {user?.name}
//                                         </h2>
//                                         <p className="text-sm text-gray-500">
//                                             {user?.village}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
//                                     <div>
//                                         <p className="text-xs text-gray-500">Farmer Type</p>
//                                         <p className="mt-1 text-sm font-semibold text-gray-900">
//                                             {isSmallFarmer
//                                                 ? "Small / Marginal Farmer"
//                                                 : "Large Farmer / FPO"}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500">Produce Interest</p>
//                                         <p className="mt-1 text-sm font-semibold text-gray-900">
//                                             {user?.produceInterest || "Not specified"}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>

//                         {/* Quick Actions */}
//                         <section className="mt-6">
//                             <div className="mb-4">
//                                 <h2 className="text-lg font-bold text-gray-900">
//                                     Quick Actions
//                                 </h2>
//                                 <p className="mt-1 text-sm text-gray-500">
//                                     Common actions for your farming activity
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                                 <QuickActionCard
//                                     title="Add New Produce"
//                                     description="Create a new produce listing"
//                                     icon={Plus}
//                                     onClick={() => navigate("/farmer/produce/new")}
//                                 />
//                                 <QuickActionCard
//                                     title="Check Market Prices"
//                                     description="Compare today's prices"
//                                     icon={TrendingUp}
//                                     onClick={()=> navigate("/farmer/market-prices")}
//                                 />
//                                 <QuickActionCard
//                                     title="View My Deals"
//                                     description="Track your active trades"
//                                     icon={Handshake}
//                                     onClick={()=> navigate("/farmer/deals")}
//                                 />
//                             </div>
//                         </section>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default FarmerDashboard;




import { useCallback, useEffect, useState } from "react";

import {
    MapPin,
    Search,
    Handshake,
    Clock3,
    CheckCircle2,
    RefreshCw,
    ArrowRight,
    Leaf,
    TrendingUp,
    Sprout,
    Sparkles,
    Package,
    ShieldCheck,
    IndianRupee,
    Truck,
    Plus,
    UserRound,
    ShoppingBasket,
    CircleAlert,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import FarmerSidebar from "../../components/Farmer/farmerSideBar";
import FarmerHeader from "../../components/Farmer/FarmerHeader";

import DashboardStatCard from "../../components/Farmer/DashboardStatCard";
import MarketPriceCard from "../../components/Farmer/MarketPriceCard";
import QuickActionCard from "../../components/Farmer/QuickActionCard";

import { getFarmerDashboard } from "../../services/farmerServices.js";
import { getMarketPrice } from "../../services/MarketPriceServices.js";


const FarmerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [marketPrices, setMarketPrices] = useState([]);
    const [marketPricesLoading, setMarketPricesLoading] =
        useState(true);
    const [marketPricesError, setMarketPricesError] =
        useState("");

    const [refreshKey, setRefreshKey] = useState(0);

    const isSmallFarmer = user?.farmerType === "SMALL";

    const firstName =
        user?.name?.trim()?.split(/\s+/)[0] || "Farmer";

    const stats = dashboardData?.stats || {};

    const formattedEarnings = new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
    }).format(Number(stats.totalEarnings ?? 0));


    // DASHBOARD STATISTICS

    const fetchDashboardStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFarmerDashboard();

            setDashboardData(data);
        } catch (err) {
            console.error("Fetch farmer dashboard error:", err);

            setError(
                err?.response?.data?.message ||
                    err.message ||
                    "Unable to load dashboard statistics."
            );
        } finally {
            setLoading(false);
        }
    }, []);


    // MARKET PRICES

    const fetchMarketPrices = useCallback(async () => {
        try {
            setMarketPricesLoading(true);
            setMarketPricesError("");

            const data = await getMarketPrice();

            setMarketPrices(
                Array.isArray(data?.prices)
                    ? data.prices.slice(0, 3)
                    : []
            );
        } catch (err) {
            console.error("Fetch market prices error:", err);

            setMarketPrices([]);
            setMarketPricesError(
                err?.response?.data?.message ||
                    err.message ||
                    "Unable to load market prices."
            );
        } finally {
            setMarketPricesLoading(false);
        }
    }, []);


    // INITIAL LOAD AND REFRESH

    useEffect(() => {
        fetchDashboardStatistics();
        fetchMarketPrices();
    }, [
        fetchDashboardStatistics,
        fetchMarketPrices,
        refreshKey,
    ]);


    const handleRefresh = () => {
        setRefreshKey((previous) => previous + 1);
    };


    // STATISTICS CONFIGURATION

    const statisticCards = [
        {
            title: "My Produce",
            value: stats.activeProduce ?? 0,
            icon: Sprout,
            iconBg: "bg-green-100",
            iconColor: "text-green-700",
            accent: "bg-green-500",
            description: "Your active listings",
        },
        {
            title: "Active Deals",
            value: stats.activeDeals ?? 0,
            icon: Handshake,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-700",
            accent: "bg-blue-500",
            description: "Deals in progress",
        },
        {
            title: "Total Earnings",
            value: `₹${formattedEarnings}`,
            icon: IndianRupee,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-700",
            accent: "bg-emerald-500",
            description: "Paid earnings",
        },
        {
            title: "Deliveries",
            value: stats.pendingDeliveries ?? 0,
            icon: Truck,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-700",
            accent: "bg-amber-500",
            description: "Pending deliveries",
        },
    ];


    return (
        <div className="farmer-dashboard flex min-h-screen bg-[#f5f8f3]">

            <style>{`
                @keyframes farmerFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes farmerFloat {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }

                @keyframes farmerShimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }

                .farmer-animate {
                    animation: farmerFadeUp 0.65s ease-out both;
                }

                .farmer-float {
                    animation: farmerFloat 5s ease-in-out infinite;
                }

                .farmer-stat-card {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
                }

                .farmer-stat-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 38px rgba(24, 72, 39, 0.10);
                    border-color: #cce7cf;
                }

                .farmer-stat-card::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.45),
                        transparent
                    );
                    transition: left 0.65s ease;
                    pointer-events: none;
                    z-index: -1;
                }

                .farmer-stat-card:hover::after {
                    left: 140%;
                }

                .farmer-action-card {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
                }

                .farmer-action-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 42px rgba(24, 72, 39, 0.10);
                    border-color: #b8dfbd;
                }

                .farmer-icon-box {
                    transition:
                        transform 0.3s ease,
                        border-radius 0.3s ease;
                }

                .farmer-action-card:hover .farmer-icon-box {
                    transform: rotate(-6deg) scale(1.08);
                    border-radius: 18px;
                }

                .farmer-hero-pattern {
                    background-image: radial-gradient(
                        rgba(255,255,255,0.13) 1px,
                        transparent 1px
                    );
                    background-size: 23px 23px;
                }

                .farmer-skeleton {
                    background: linear-gradient(
                        90deg,
                        #f1f5f1 25%,
                        #e5eee5 50%,
                        #f1f5f1 75%
                    );
                    background-size: 200% 100%;
                    animation: farmerShimmer 1.5s infinite linear;
                }

                @media (prefers-reduced-motion: reduce) {
                    .farmer-dashboard *,
                    .farmer-dashboard *::before,
                    .farmer-dashboard *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>


            {/* FARMER SIDEBAR */}

            <FarmerSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />


            {/* MAIN CONTENT */}

            <div className="flex min-w-0 flex-1 flex-col">

                <FarmerHeader setMobileOpen={setMobileOpen} />

                <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-7 lg:px-8 lg:py-9">

                    <div className="mx-auto max-w-7xl">


                        {/* HEADER */}

                        <header
                            className="farmer-animate mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
                            style={{ animationDelay: "50ms" }}
                        >
                            <div className="flex items-start gap-4">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-lg shadow-green-200/70">
                                    <Sprout size={29} strokeWidth={1.8} />
                                </div>

                                <div className="min-w-0">

                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-extrabold tracking-[0.24em] text-green-700">
                                            KRISHICONNECT
                                        </p>

                                        <Leaf
                                            size={14}
                                            className="text-green-600"
                                        />
                                    </div>

                                    <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                        Welcome back,{" "}
                                        <span className="text-green-700">
                                            {firstName}
                                        </span>
                                    </h1>

                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">

                                        <MapPin
                                            size={15}
                                            className="text-green-600"
                                        />

                                        <span>
                                            {user?.village ||
                                                "Location not available"}
                                        </span>

                                        <span className="text-gray-300">
                                            •
                                        </span>

                                        <span>
                                            Your farming marketplace
                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div className="flex items-center gap-3 self-start sm:self-center">

                                <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2.5 text-sm font-bold text-green-800 shadow-sm">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    Farmer Account
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={loading || marketPricesLoading}
                                    title="Refresh dashboard"
                                    aria-label="Refresh dashboard"
                                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={17}
                                        className={
                                            loading || marketPricesLoading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />
                                </button>

                            </div>
                        </header>


                        {/* HERO BANNER */}

                        <section
                            className="farmer-animate relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] p-6 text-white shadow-xl shadow-green-900/10 sm:p-9 lg:p-11"
                            style={{ animationDelay: "120ms" }}
                        >

                            <div className="farmer-hero-pattern pointer-events-none absolute inset-0 -z-10 opacity-60" />

                            <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-lime-300/15 blur-3xl" />

                            <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />


                            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">

                                <div className="max-w-2xl">

                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-green-50 backdrop-blur-md">
                                        <Sparkles size={14} />

                                        {isSmallFarmer
                                            ? "FARMER ASSISTED MODE"
                                            : "YOUR FARMER DASHBOARD"}
                                    </div>

                                    <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                        Grow your produce.
                                        <br />

                                        <span className="text-lime-300">
                                            Grow your opportunities.
                                        </span>
                                    </h2>

                                    <p className="mt-4 max-w-xl text-sm leading-7 text-green-50/90 sm:text-base">
                                        Manage your crop listings, discover
                                        market prices, connect directly with
                                        buyers and keep track of your deals
                                        and deliveries in one place.
                                    </p>

                                    <div className="mt-7 flex flex-wrap gap-3">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/farmer/produce/new"
                                                )
                                            }
                                            className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-green-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-lime-50 hover:shadow-xl"
                                        >
                                            <Plus size={18} />

                                            Add New Produce

                                            <ArrowRight
                                                size={16}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/farmer/deals"
                                                )
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                                        >
                                            <Handshake size={17} />

                                            Manage Deals
                                        </button>

                                    </div>

                                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-green-50/90">

                                        <span className="flex items-center gap-2">
                                            <ShieldCheck
                                                size={16}
                                                className="text-lime-300"
                                            />
                                            Direct buyer connections
                                        </span>

                                        <span className="flex items-center gap-2">
                                            <Leaf
                                                size={16}
                                                className="text-lime-300"
                                            />
                                            Your crops, your marketplace
                                        </span>

                                    </div>

                                </div>


                                {/* DECORATIVE HERO ART */}

                                <div className="farmer-float relative hidden h-52 w-52 items-center justify-center lg:flex xl:h-60 xl:w-60">

                                    <div className="absolute inset-0 rounded-full border border-white/15" />

                                    <div className="absolute inset-5 rounded-full border border-white/15" />

                                    <div className="absolute inset-10 rounded-full bg-white/10 backdrop-blur-sm" />

                                    <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-br from-lime-200 to-green-300 text-green-900 shadow-2xl shadow-green-950/30">
                                        <Sprout
                                            size={65}
                                            strokeWidth={1.35}
                                        />
                                    </div>

                                    <div className="absolute right-0 top-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-lime-200 shadow-lg backdrop-blur-lg">
                                        <Leaf size={24} />
                                    </div>

                                    <div className="absolute bottom-7 left-0 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg backdrop-blur-lg">
                                        <Package size={23} />
                                    </div>

                                    <div className="absolute bottom-1 right-6 h-3 w-3 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.8)]" />

                                </div>

                            </div>

                        </section>


                        {/* DASHBOARD ERROR */}

                        {error && (
                            <section className="farmer-animate mt-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                                <div className="flex items-start gap-3">

                                    <div className="rounded-xl bg-white p-2.5 text-red-600">
                                        <CircleAlert size={20} />
                                    </div>

                                    <div>
                                        <p className="font-bold text-red-800">
                                            Unable to load dashboard
                                        </p>

                                        <p className="mt-1 text-sm text-red-600">
                                            {error}
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                                >
                                    <RefreshCw size={16} />
                                    Try again
                                </button>

                            </section>
                        )}


                        {/* STATISTICS SECTION */}

                        <section className="mt-9">

                            <div
                                className="farmer-animate mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
                                style={{ animationDelay: "180ms" }}
                            >

                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-1 rounded-full bg-green-600" />

                                        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                                            Your Overview
                                        </h2>
                                    </div>

                                    <p className="mt-2 pl-3 text-sm text-gray-500">
                                        A quick look at your farming activity.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    disabled={loading || marketPricesLoading}
                                    className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                                >
                                    <RefreshCw
                                        size={15}
                                        className={
                                            loading ? "animate-spin" : ""
                                        }
                                    />

                                    Refresh statistics
                                </button>

                            </div>


                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                {statisticCards.map((stat, index) => {
                                    const Icon = stat.icon;

                                    return (
                                        <div
                                            key={stat.title}
                                            className="farmer-stat-card farmer-animate rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                                            style={{
                                                animationDelay: `${
                                                    230 + index * 100
                                                }ms`,
                                            }}
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor}`}
                                                >
                                                    <Icon
                                                        size={23}
                                                        strokeWidth={1.8}
                                                    />
                                                </div>

                                                <div className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    Overview
                                                </div>

                                            </div>

                                            <p className="mt-5 text-sm font-semibold text-gray-500">
                                                {stat.title}
                                            </p>

                                            {loading ? (
                                                <div className="farmer-skeleton mt-3 h-10 w-24 rounded-lg" />
                                            ) : (
                                                <p className="mt-1 break-words text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                                    {stat.value}
                                                </p>
                                            )}

                                            <p className="mt-2 text-xs text-gray-400">
                                                {stat.description}
                                            </p>

                                            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className={`h-full w-1/2 rounded-full ${stat.accent} transition-all duration-700`}
                                                    style={{
                                                        transform: loading
                                                            ? "scaleX(0.25)"
                                                            : "scaleX(1)",
                                                        transformOrigin: "left",
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    );
                                })}

                            </div>

                        </section>


                        {/* MARKET PRICES AND PROFILE */}

                        <section className="mt-10">

                            <div
                                className="farmer-animate mb-5"
                                style={{ animationDelay: "580ms" }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-1 rounded-full bg-green-600" />

                                    <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                                        Your Farming Workspace
                                    </h2>
                                </div>

                                <p className="mt-2 pl-3 text-sm text-gray-500">
                                    Market updates and your farmer profile.
                                </p>
                            </div>


                            <div className="grid min-w-0 gap-5 xl:grid-cols-3">


                                {/* MARKET PRICES */}

                                <section
                                    className="farmer-animate min-w-0 overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2"
                                    style={{ animationDelay: "630ms" }}
                                >

                                    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                                                Market Updates
                                            </p>

                                            <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                                                Today's Market Prices
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-500">
                                                Reference prices for your crops.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/farmer/market-prices"
                                                )
                                            }
                                            className="group inline-flex shrink-0 items-center gap-2 self-start text-sm font-bold text-green-700 transition hover:text-green-900 sm:self-center"
                                        >
                                            View all

                                            <ArrowRight
                                                size={16}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </button>

                                    </div>


                                    {marketPricesLoading ? (
                                        <div className="grid gap-4 md:grid-cols-3">
                                            {[1, 2, 3].map((item) => (
                                                <div
                                                    key={item}
                                                    className="farmer-skeleton h-32 rounded-2xl"
                                                />
                                            ))}
                                        </div>
                                    ) : marketPrices.length > 0 ? (
                                        <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            {marketPrices.map((price) => (
                                                <MarketPriceCard
                                                    key={
                                                        price._id ||
                                                        price.crop
                                                    }
                                                    crop={price.crop}
                                                    price={price.modalPrice}
                                                    unit={price.unit}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 text-center">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                <TrendingUp size={23} />
                                            </div>

                                            <h4 className="mt-4 text-sm font-bold text-gray-900">
                                                {marketPricesError
                                                    ? "Market prices unavailable"
                                                    : "No market prices available"}
                                            </h4>

                                            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                                {marketPricesError ||
                                                    "Market prices will appear here when data becomes available."}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={fetchMarketPrices}
                                                disabled={marketPricesLoading}
                                                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-800 transition hover:border-green-200 hover:bg-green-50 disabled:opacity-60"
                                            >
                                                <RefreshCw size={15} />
                                                Retry prices
                                            </button>

                                        </div>
                                    )}

                                </section>


                                {/* FARMER PROFILE */}

                                <section
                                    className="farmer-animate min-w-0 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                                    style={{ animationDelay: "730ms" }}
                                >

                                    <div className="flex items-center justify-between gap-3">

                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                                                Account
                                            </p>

                                            <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                                                My Profile
                                            </h3>
                                        </div>

                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <UserRound size={23} />
                                        </div>

                                    </div>


                                    <div className="mt-6 flex items-center gap-3">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-xl font-extrabold text-white shadow-md shadow-green-100">
                                            {user?.name
                                                ?.trim()
                                                ?.charAt(0)
                                                ?.toUpperCase() || "F"}
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="truncate font-extrabold text-gray-900">
                                                {user?.name || "Farmer"}
                                            </h4>

                                            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-gray-500">
                                                <MapPin
                                                    size={14}
                                                    className="shrink-0 text-green-600"
                                                />

                                                {user?.village ||
                                                    "Location not specified"}
                                            </p>
                                        </div>

                                    </div>


                                    <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">

                                        <div className="rounded-xl bg-gray-50 p-3.5">
                                            <p className="text-xs font-medium text-gray-500">
                                                Farmer Type
                                            </p>

                                            <p className="mt-1.5 text-sm font-bold text-gray-900">
                                                {isSmallFarmer
                                                    ? "Small / Marginal Farmer"
                                                    : user?.farmerType ===
                                                        "LARGE"
                                                      ? "Large Farmer / FPO"
                                                      : "Not specified"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-gray-50 p-3.5">
                                            <p className="text-xs font-medium text-gray-500">
                                                Produce Interest
                                            </p>

                                            <p className="mt-1.5 break-words text-sm font-bold text-gray-900">
                                                {user?.produceInterest ||
                                                    "Not specified"}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-gray-50 p-3.5">
                                            <p className="text-xs font-medium text-gray-500">
                                                Mobile Number
                                            </p>

                                            <p className="mt-1.5 break-words text-sm font-bold text-gray-900">
                                                {user?.phone ||
                                                    "Not specified"}
                                            </p>
                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/farmer/profile")
                                        }
                                        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800 transition hover:border-green-300 hover:bg-green-100"
                                    >
                                        Manage Profile

                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </button>

                                </section>

                            </div>

                        </section>


                        {/* QUICK ACTIONS */}

                        <section className="mt-10">

                            <div
                                className="farmer-animate mb-5"
                                style={{ animationDelay: "780ms" }}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-1 rounded-full bg-green-600" />

                                    <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                                        Quick Actions
                                    </h2>
                                </div>

                                <p className="mt-2 pl-3 text-sm text-gray-500">
                                    Everything you need, just one click away.
                                </p>
                            </div>


                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {/* ADD PRODUCE */}

                                <Link
                                    to="/farmer/produce/new"
                                    className="farmer-action-card farmer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                                    style={{ animationDelay: "830ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-green-50 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="relative flex items-start justify-between gap-4">

                                        <div className="farmer-icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <Plus
                                                size={27}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 transition-all duration-300 group-hover:border-green-200 group-hover:bg-green-600 group-hover:text-white">
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                            />
                                        </div>

                                    </div>

                                    <div className="relative mt-6">

                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                                            List & Sell
                                        </p>

                                        <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                                            Add New Produce
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-gray-500">
                                            Create a listing for your crops
                                            and make your produce available
                                            to interested buyers.
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-700 transition-all duration-300 group-hover:gap-3">
                                            Create listing
                                            <ArrowRight size={16} />
                                        </div>

                                    </div>

                                    <div className="relative mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                                        <Sprout
                                            size={15}
                                            className="text-green-600"
                                        />
                                        Share your produce with buyers
                                    </div>

                                </Link>


                                {/* MARKET PRICES */}

                                <Link
                                    to="/farmer/market-prices"
                                    className="farmer-action-card farmer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                                    style={{ animationDelay: "900ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="relative flex items-start justify-between gap-4">

                                        <div className="farmer-icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                            <TrendingUp
                                                size={27}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-600 group-hover:text-white">
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                            />
                                        </div>

                                    </div>

                                    <div className="relative mt-6">

                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                                            Check & Compare
                                        </p>

                                        <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                                            Market Prices
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-gray-500">
                                            Explore available crop prices
                                            and use market information to
                                            plan your selling decisions.
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-all duration-300 group-hover:gap-3">
                                            Explore prices
                                            <ArrowRight size={16} />
                                        </div>

                                    </div>

                                    <div className="relative mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                                        <IndianRupee
                                            size={15}
                                            className="text-blue-600"
                                        />
                                        Review reference crop prices
                                    </div>

                                </Link>


                                {/* DEALS */}

                                <Link
                                    to="/farmer/deals"
                                    className="farmer-action-card farmer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                                    style={{ animationDelay: "970ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-50 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="relative flex items-start justify-between gap-4">

                                        <div className="farmer-icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                            <Handshake
                                                size={27}
                                                strokeWidth={1.8}
                                            />
                                        </div>

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 transition-all duration-300 group-hover:border-amber-200 group-hover:bg-amber-500 group-hover:text-white">
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform duration-300 group-hover:translate-x-0.5"
                                            />
                                        </div>

                                    </div>

                                    <div className="relative mt-6">

                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                                            Track & Manage
                                        </p>

                                        <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                                            My Deals
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-gray-500">
                                            Review buyer requests, manage
                                            accepted deals and follow your
                                            ongoing agricultural trades.
                                        </p>

                                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-700 transition-all duration-300 group-hover:gap-3">
                                            View my deals
                                            <ArrowRight size={16} />
                                        </div>

                                    </div>

                                    <div className="relative mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                                        <CheckCircle2
                                            size={15}
                                            className="text-amber-600"
                                        />
                                        Keep track of your trade activity
                                    </div>

                                </Link>

                            </div>

                        </section>


                        {/* EMPTY PRODUCE STATE */}

                        {!loading &&
                            !error &&
                            Number(stats.activeProduce ?? 0) === 0 && (
                                <section
                                    className="farmer-animate relative mt-8 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-white via-green-50/70 to-emerald-50 p-6 sm:p-8"
                                    style={{ animationDelay: "1040ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-green-100/60 blur-2xl" />

                                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex items-start gap-4">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200">
                                                <ShoppingBasket size={24} />
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                                                    Start Selling
                                                </p>

                                                <h2 className="mt-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                                                    Add your first produce listing
                                                </h2>

                                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                                    List the crops you have
                                                    available so buyers can
                                                    discover your produce.
                                                </p>
                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/farmer/produce/new"
                                                )
                                            }
                                            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-green-200 transition-all duration-300 hover:-translate-y-1 hover:bg-green-800 hover:shadow-lg"
                                        >
                                            Add Produce

                                            <ArrowRight
                                                size={16}
                                                className="transition-transform duration-300 group-hover:translate-x-1"
                                            />
                                        </button>

                                    </div>

                                </section>
                            )}


                        {/* FOOTER */}

                        <footer
                            className="farmer-animate mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-200/80 py-5 text-center text-xs text-gray-400 sm:flex-row sm:text-left"
                            style={{ animationDelay: "1100ms" }}
                        >

                            <p className="flex items-center gap-2">
                                <Leaf
                                    size={14}
                                    className="text-green-600"
                                />

                                KrishiConnect — Connecting farms to markets.
                            </p>

                            <p>
                                Built for a better agricultural future.
                            </p>

                        </footer>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default FarmerDashboard;