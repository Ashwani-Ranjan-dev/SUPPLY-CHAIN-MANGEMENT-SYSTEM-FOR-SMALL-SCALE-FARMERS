import { useCallback, useEffect, useState } from "react";

import {
    MapPin,
    Handshake,
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
    Wallet,
    CalendarDays,
    CreditCard,
    Clock3,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import FarmerSidebar from "../../components/Farmer/farmerSideBar";
import FarmerHeader from "../../components/Farmer/FarmerHeader";

import MarketPriceCard from "../../components/Farmer/MarketPriceCard";

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

            {/* GLOBAL ANIMATIONS */}

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

                @keyframes dashboardReveal {
                    from {
                        opacity: 0;
                        transform: translateY(28px) scale(.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes dashboardGlow {
                    0%, 100% {
                        opacity: .35;
                        transform: scale(1);
                    }
                    50% {
                        opacity: .7;
                        transform: scale(1.12);
                    }
                }

                @keyframes dashboardPulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(134,239,172,.3);
                    }
                    50% {
                        box-shadow: 0 0 0 10px rgba(134,239,172,0);
                    }
                }

                .farmer-animate {
                    animation: farmerFadeUp .65s ease-out both;
                }

                .dashboard-reveal {
                    animation: dashboardReveal .7s cubic-bezier(.2,.7,.2,1) both;
                }

                .farmer-float,
                .dashboard-float {
                    animation: farmerFloat 6s ease-in-out infinite;
                }

                .dashboard-glow {
                    animation: dashboardGlow 5s ease-in-out infinite;
                }

                .farmer-stat-card {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    transition:
                        transform .35s ease,
                        box-shadow .35s ease,
                        border-color .35s ease;
                }

                .farmer-stat-card:hover {
                    transform: translateY(-7px);
                    box-shadow: 0 20px 45px rgba(22,101,52,.11);
                    border-color: #bbf7d0;
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
                        rgba(255,255,255,.5),
                        transparent
                    );
                    transition: left .65s ease;
                    pointer-events: none;
                    z-index: -1;
                }

                .farmer-stat-card:hover::after {
                    left: 140%;
                }

                .dashboard-premium-card,
                .farmer-action-card {
                    transition:
                        transform .35s cubic-bezier(.2,.7,.2,1),
                        box-shadow .35s ease,
                        border-color .35s ease;
                }

                .dashboard-premium-card:hover,
                .farmer-action-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 42px rgba(24,72,39,.10);
                    border-color: #b8dfbd;
                }

                .dashboard-icon,
                .farmer-icon-box {
                    transition:
                        transform .35s ease,
                        box-shadow .35s ease,
                        border-radius .35s ease;
                }

                .dashboard-premium-card:hover .dashboard-icon,
                .dashboard-premium-card:hover .farmer-icon-box,
                .farmer-action-card:hover .dashboard-icon,
                .farmer-action-card:hover .farmer-icon-box {
                    transform: rotate(-7deg) scale(1.1);
                    border-radius: 18px;
                }

                .farmer-hero-pattern {
                    background-image: radial-gradient(
                        rgba(255,255,255,.15) 1px,
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

                .dashboard-glass {
                    background: rgba(255,255,255,.12);
                    backdrop-filter: blur(14px);
                    border: 1px solid rgba(255,255,255,.2);
                }

                .dashboard-link {
                    position: relative;
                    transition: color .25s ease;
                }

                .dashboard-link::after {
                    content: "";
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: currentColor;
                    transition: width .3s ease;
                }

                .dashboard-link:hover::after {
                    width: 100%;
                }

                @media (prefers-reduced-motion: reduce) {
                    .farmer-dashboard *,
                    .farmer-dashboard *::before,
                    .farmer-dashboard *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
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
                            className="dashboard-reveal relative isolate overflow-hidden rounded-[32px] bg-gradient-to-br from-[#064e2b] via-[#166534] to-[#15803d] p-6 text-white shadow-2xl shadow-green-900/15 sm:p-9 lg:p-12"
                            style={{ animationDelay: "120ms" }}
                        >

                            <div className="farmer-hero-pattern pointer-events-none absolute inset-0 -z-10 opacity-60" />

                            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl dashboard-glow" />

                            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dashboard-glow" />

                            <div className="pointer-events-none absolute right-1/4 top-8 h-3 w-3 rounded-full bg-lime-200 dashboard-float" />

                            <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-green-300/10 blur-3xl" />

                            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">

                                <div className="max-w-2xl">

                                    <div className="dashboard-glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold tracking-wide text-green-50">
                                        <Sparkles size={14} />

                                        {isSmallFarmer
                                            ? "FARMER ASSISTED MODE"
                                            : "YOUR FARMER DASHBOARD"}
                                    </div>

                                    <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                        Grow your produce.
                                        <br />

                                        <span className="bg-gradient-to-r from-lime-200 via-lime-300 to-emerald-200 bg-clip-text text-transparent">
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
                                                navigate("/farmer/produce/new")
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
                                                navigate("/farmer/deals")
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

                                {/* HERO ART */}

                                <div className="farmer-float relative mx-auto hidden h-52 w-52 items-center justify-center lg:flex xl:h-60 xl:w-60">

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
                                        className={loading ? "animate-spin" : ""}
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
                                            className="farmer-stat-card dashboard-reveal rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                                            style={{
                                                animationDelay: `${230 + index * 100}ms`,
                                            }}
                                        >

                                            <div className="flex items-start justify-between gap-3">

                                                <div
                                                    className={`dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor}`}
                                                >
                                                    <Icon
                                                        size={25}
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
                                                <div className="farmer-skeleton mt-3 h-10 w-28 rounded-lg" />
                                            ) : (
                                                <p
                                                    key={`${stat.title}-${stat.value}`}
                                                    className="mt-1 break-words text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dashboard-reveal"
                                                >
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
                                                            ? "scaleX(.25)"
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
                                    className="dashboard-premium-card farmer-animate relative min-w-0 overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2"
                                    style={{ animationDelay: "630ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-50 blur-3xl" />

                                    <div className="relative mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

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
                                                navigate("/farmer/market-prices")
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
                                        <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">

                                            {marketPrices.map((price, index) => (
                                                <div
                                                    key={price._id || price.crop}
                                                    className="dashboard-reveal"
                                                    style={{
                                                        animationDelay: `${index * 100}ms`,
                                                    }}
                                                >
                                                    <MarketPriceCard
                                                        crop={price.crop}
                                                        price={price.modalPrice}
                                                        unit={price.unit}
                                                    />
                                                </div>
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
                                                <RefreshCw
                                                    size={15}
                                                    className={marketPricesLoading ? "animate-spin" : ""}
                                                />
                                                Retry prices
                                            </button>

                                        </div>
                                    )}

                                </section>

                                {/* FARMER PROFILE */}

                                <section
                                    className="dashboard-premium-card farmer-animate relative isolate min-w-0 overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                                    style={{ animationDelay: "730ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-green-100/60 blur-3xl" />

                                    <div className="relative">

                                        <div className="flex items-center justify-between gap-3">

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                                                    Account
                                                </p>

                                                <h3 className="mt-2 text-xl font-extrabold text-gray-900">
                                                    My Profile
                                                </h3>
                                            </div>

                                            <div className="dashboard-icon flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                <UserRound size={23} />
                                            </div>

                                        </div>

                                        <div className="mt-6 flex items-center gap-3">

                                            <div className="dashboard-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-xl font-extrabold text-white shadow-md shadow-green-100">
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

                                            <div className="rounded-xl bg-gray-50 p-3.5 transition hover:bg-green-50">
                                                <p className="text-xs font-medium text-gray-500">
                                                    Farmer Type
                                                </p>

                                                <p className="mt-1.5 text-sm font-bold text-gray-900">
                                                    {isSmallFarmer
                                                        ? "Small / Marginal Farmer"
                                                        : user?.farmerType === "LARGE"
                                                            ? "Large Farmer / FPO"
                                                            : "Not specified"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-3.5 transition hover:bg-green-50">
                                                <p className="text-xs font-medium text-gray-500">
                                                    Produce Interest
                                                </p>

                                                <p className="mt-1.5 break-words text-sm font-bold text-gray-900">
                                                    {user?.produceInterest ||
                                                        "Not specified"}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-3.5 transition hover:bg-green-50">
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

                                    </div>

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
                                    className="dashboard-premium-card farmer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                                    style={{ animationDelay: "830ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-green-50 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="relative flex items-start justify-between gap-4">

                                        <div className="dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                            <Plus size={27} strokeWidth={1.8} />
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
                                        <Sprout size={15} className="text-green-600" />
                                        Share your produce with buyers
                                    </div>

                                </Link>

                                {/* MARKET PRICES */}

                                <Link
                                    to="/farmer/market-prices"
                                    className="dashboard-premium-card farmer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                                    style={{ animationDelay: "900ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="relative flex items-start justify-between gap-4">

                                        <div className="dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                            <TrendingUp size={27} strokeWidth={1.8} />
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
                                        <IndianRupee size={15} className="text-blue-600" />
                                        Review reference crop prices
                                    </div>

                                </Link>

                                {/* DEALS */}

                                <Link
                                    to="/farmer/deals"
                                    className="dashboard-premium-card farmer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                                    style={{ animationDelay: "970ms" }}
                                >

                                    <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-50 transition-transform duration-500 group-hover:scale-150" />

                                    <div className="relative flex items-start justify-between gap-4">

                                        <div className="dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                            <Handshake size={27} strokeWidth={1.8} />
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
                                        <CheckCircle2 size={15} className="text-amber-600" />
                                        Keep track of your trade activity
                                    </div>

                                </Link>

                            </div>

                        </section>

                        {/* PAYMENT SHORTCUT */}

                        <section
                            className="dashboard-reveal mt-8 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-white via-green-50 to-emerald-50 p-6 sm:p-8"
                            style={{ animationDelay: "1020ms" }}
                        >
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                <div className="flex items-start gap-4">
                                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-green-100 p-3 text-green-700">
                                        <Wallet size={25} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                                            Financial Management
                                        </p>

                                        <h3 className="mt-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                                            Manage Your Payments
                                        </h3>

                                        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                                            Review your payment records, track pending
                                            amounts and monitor money received from buyers.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/farmer/payments")}
                                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-green-200 transition duration-300 hover:-translate-y-1 hover:bg-green-800 hover:shadow-lg"
                                >
                                    <CreditCard size={17} />
                                    View Payments
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>

                            </div>
                        </section>

                        {/* EMPTY PRODUCE STATE */}

                        {!loading &&
                            !error &&
                            Number(stats.activeProduce ?? 0) === 0 && (
                                <section
                                    className="dashboard-reveal relative mt-8 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-white via-green-50/70 to-emerald-50 p-6 sm:p-8"
                                    style={{ animationDelay: "1080ms" }}
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
                                                navigate("/farmer/produce/new")
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
                            style={{ animationDelay: "1150ms" }}
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
