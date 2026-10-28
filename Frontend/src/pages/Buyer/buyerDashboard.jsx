import { useEffect, useState } from "react";

import {
    MapPin,
    Search,
    ShoppingCart,
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
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import LogoutButton from "../../components/auth/LogoutButton";

import { getBuyerDashboard } from "../../services/buyerServices.js";


const BuyerDashboard = () => {
    const { user } = useAuth();

    const [statistics, setStatistics] = useState({
        availableProduce: 0,
        activeDeals: 0,
        pendingDeals: 0,
        completedDeals: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FETCH BUYER DASHBOARD STATISTICS

    const fetchDashboardStatistics = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getBuyerDashboard();

            setStatistics(
                data.statistics || {
                    availableProduce: 0,
                    activeDeals: 0,
                    pendingDeals: 0,
                    completedDeals: 0,
                }
            );

        } catch (error) {
            console.error(
                "Fetch buyer dashboard error:",
                error
            );

            setError(
                error.message ||
                "Unable to load dashboard statistics."
            );

        } finally {
            setLoading(false);
        }
    };

    // LOAD DASHBOARD

    useEffect(() => {
        fetchDashboardStatistics();
    }, []);


    // STATISTICS CONFIGURATION

    const stats = [
        {
            title: "Available Produce",
            value: statistics.availableProduce,
            icon: Search,
            iconBg: "bg-green-100",
            iconColor: "text-green-700",
            accent: "bg-green-500",
            description: "Explore fresh listings",
        },
        {
            title: "Active Deals",
            value: statistics.activeDeals,
            icon: ShoppingCart,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-700",
            accent: "bg-blue-500",
            description: "Your ongoing purchases",
        },
        {
            title: "Pending Deals",
            value: statistics.pendingDeals,
            icon: Clock3,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-700",
            accent: "bg-amber-500",
            description: "Awaiting confirmation",
        },
        {
            title: "Completed Deals",
            value: statistics.completedDeals,
            icon: CheckCircle2,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-700",
            accent: "bg-emerald-500",
            description: "Successfully completed",
        },
    ];


    return (
        <main className="buyer-dashboard min-h-screen overflow-hidden bg-[#f5f8f3] px-4 py-6 sm:px-7 lg:px-10 lg:py-9">

            <style>{`
                @keyframes buyerFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(24px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes buyerFloat {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }

                @keyframes buyerPulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(255,255,255,0.14);
                    }
                    50% {
                        box-shadow: 0 0 0 12px rgba(255,255,255,0);
                    }
                }

                @keyframes buyerShimmer {
                    0% {
                        background-position: 200% 0;
                    }
                    100% {
                        background-position: -200% 0;
                    }
                }

                .buyer-animate {
                    animation: buyerFadeUp 0.65s ease-out both;
                }

                .buyer-float {
                    animation: buyerFloat 5s ease-in-out infinite;
                }

                .buyer-stat-card {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
                }

                .buyer-stat-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 18px 38px rgba(24, 72, 39, 0.10);
                    border-color: #cce7cf;
                }

                .buyer-stat-card::after {
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

                .buyer-stat-card:hover::after {
                    left: 140%;
                }

                .buyer-action-card {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        border-color 0.3s ease;
                }

                .buyer-action-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 42px rgba(24, 72, 39, 0.10);
                    border-color: #b8dfbd;
                }

                .buyer-icon-box {
                    transition:
                        transform 0.3s ease,
                        border-radius 0.3s ease;
                }

                .buyer-action-card:hover .buyer-icon-box {
                    transform: rotate(-6deg) scale(1.08);
                    border-radius: 18px;
                }

                .buyer-hero-pattern {
                    background-image: radial-gradient(
                        rgba(255,255,255,0.13) 1px,
                        transparent 1px
                    );
                    background-size: 23px 23px;
                }

                .buyer-skeleton {
                    background: linear-gradient(
                        90deg,
                        #f1f5f1 25%,
                        #e5eee5 50%,
                        #f1f5f1 75%
                    );
                    background-size: 200% 100%;
                    animation: buyerShimmer 1.5s infinite linear;
                }

                @media (prefers-reduced-motion: reduce) {
                    .buyer-dashboard *,
                    .buyer-dashboard *::before,
                    .buyer-dashboard *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <header
                    className="buyer-animate mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
                    style={{ animationDelay: "50ms" }}
                >
                    <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-lg shadow-green-200/70">
                            <Sprout size={29} strokeWidth={1.8} />
                        </div>

                        <div>
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
                                    {user?.name || "Buyer"}
                                </span>
                            </h1>

                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                <MapPin
                                    size={15}
                                    className="text-green-600"
                                />
                                <span>
                                    {user?.village || "Location not available"}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>Your farming marketplace</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">

                        <div className="flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2.5 text-sm font-bold text-green-800 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Buyer Account
                        </div>

                        <LogoutButton />

                    </div>
                </header>


                {/* HERO BANNER */}

                <section
                    className="buyer-animate relative isolate overflow-hidden rounded-[30px] bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] p-6 text-white shadow-xl shadow-green-900/10 sm:p-9 lg:p-11"
                    style={{ animationDelay: "120ms" }}
                >

                    <div className="buyer-hero-pattern pointer-events-none absolute inset-0 -z-10 opacity-60" />

                    <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-lime-300/15 blur-3xl" />

                    <div className="pointer-events-none absolute -bottom-24 right-1/4 -z-10 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

                    <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">

                        <div className="max-w-2xl">

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold tracking-wide text-green-50 backdrop-blur-md">
                                <Sparkles size={14} />
                                YOUR AGRICULTURAL MARKETPLACE
                            </div>

                            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                                Fresh from the farm.
                                <br />
                                <span className="text-lime-300">
                                    Direct to you.
                                </span>
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-green-50/90 sm:text-base">
                                Discover quality produce directly from
                                farmers, explore available offers and
                                manage your agricultural purchases
                                all in one place.
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">

                                <Link
                                    to="/buyer/produce"
                                    className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-green-800 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-lime-50 hover:shadow-xl"
                                >
                                    <Search size={17} />
                                    Explore Marketplace
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Link>

                                <Link
                                    to="/buyer/deals"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/20"
                                >
                                    <ShoppingCart size={17} />
                                    Manage Deals
                                </Link>

                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-green-50/90">

                                <span className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-lime-300" />
                                    Farmer-direct sourcing
                                </span>

                                <span className="flex items-center gap-2">
                                    <Leaf size={16} className="text-lime-300" />
                                    Fresh agricultural produce
                                </span>

                            </div>

                        </div>


                        {/* DECORATIVE HERO ART */}

                        <div className="buyer-float relative hidden h-52 w-52 items-center justify-center lg:flex xl:h-60 xl:w-60">

                            <div className="absolute inset-0 rounded-full border border-white/15" />

                            <div className="absolute inset-5 rounded-full border border-white/15" />

                            <div className="absolute inset-10 rounded-full bg-white/10 backdrop-blur-sm" />

                            <div className="relative flex h-28 w-28 items-center justify-center rounded-[32px] bg-gradient-to-br from-lime-200 to-green-300 text-green-900 shadow-2xl shadow-green-950/30">
                                <Sprout size={65} strokeWidth={1.35} />
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


                {/* ERROR STATE */}

                {error && (
                    <div className="buyer-animate mt-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="font-bold text-red-800">
                                Unable to load dashboard
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchDashboardStatistics}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>

                    </div>
                )}


                {/* STATISTICS SECTION */}

                <section className="mt-9">

                    <div
                        className="buyer-animate mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
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
                                A quick look at your marketplace activity.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchDashboardStatistics}
                            disabled={loading}
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

                        {stats.map((stat, index) => {

                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.title}
                                    className="buyer-stat-card buyer-animate rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                                    style={{
                                        animationDelay: `${230 + index * 100}ms`,
                                    }}
                                >

                                    <div className="flex items-start justify-between gap-3">

                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} ${stat.iconColor}`}
                                        >
                                            <Icon size={23} strokeWidth={1.8} />
                                        </div>

                                        <div className="rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            Overview
                                        </div>

                                    </div>

                                    <p className="mt-5 text-sm font-semibold text-gray-500">
                                        {stat.title}
                                    </p>

                                    {loading ? (
                                        <div className="buyer-skeleton mt-3 h-10 w-20 rounded-lg" />
                                    ) : (
                                        <p className="mt-1 text-4xl font-extrabold tracking-tight text-gray-900">
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
                                                transform: loading ? "scaleX(0.25)" : "scaleX(1)",
                                                transformOrigin: "left",
                                            }}
                                        />
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="mt-10">

                    <div
                        className="buyer-animate mb-5"
                        style={{ animationDelay: "580ms" }}
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


                    <div className="grid gap-5 md:grid-cols-2">

                        {/* BROWSE MARKETPLACE */}

                        <Link
                            to="/buyer/produce"
                            className="buyer-action-card buyer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                            style={{ animationDelay: "630ms" }}
                        >

                            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-green-50 transition-transform duration-500 group-hover:scale-150" />

                            <div className="relative flex items-start justify-between gap-4">

                                <div className="buyer-icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                    <Search size={27} strokeWidth={1.8} />
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
                                    Discover & Shop
                                </p>

                                <h3 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-2xl">
                                    Browse Marketplace
                                </h3>

                                <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
                                    Discover fresh produce listed directly
                                    by farmers, compare available products
                                    and explore the latest offers.
                                </p>

                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-700 transition-all duration-300 group-hover:gap-3">
                                    Explore produce
                                    <ArrowRight size={16} />
                                </div>

                            </div>

                            <div className="relative mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                                <Leaf size={15} className="text-green-600" />
                                Find produce from your farming community
                            </div>

                        </Link>


                        {/* MY DEALS */}

                        <Link
                            to="/buyer/deals"
                            className="buyer-action-card buyer-animate group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
                            style={{ animationDelay: "730ms" }}
                        >

                            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-50 transition-transform duration-500 group-hover:scale-150" />

                            <div className="relative flex items-start justify-between gap-4">

                                <div className="buyer-icon-box flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                    <ShoppingCart size={27} strokeWidth={1.8} />
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
                                    Track & Manage
                                </p>

                                <h3 className="mt-2 text-xl font-extrabold text-gray-900 sm:text-2xl">
                                    My Deals
                                </h3>

                                <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
                                    Review your offers, track accepted
                                    deals, monitor payments and follow
                                    your purchase progress.
                                </p>

                                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-all duration-300 group-hover:gap-3">
                                    View my deals
                                    <ArrowRight size={16} />
                                </div>

                            </div>

                            <div className="relative mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-medium text-gray-400">
                                <CheckCircle2 size={15} className="text-blue-600" />
                                Keep track of your transactions
                            </div>

                        </Link>

                    </div>

                </section>


                {/* BOTTOM INFORMATION BANNER */}

                <section
                    className="buyer-animate relative mt-8 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-white via-green-50/70 to-emerald-50 p-6 sm:p-8"
                    style={{ animationDelay: "820ms" }}
                >

                    <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-green-100/60 blur-2xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-200">
                                <TrendingUp size={24} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                                    Growing Together
                                </p>

                                <h2 className="mt-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                                    Better connections. Smarter purchases.
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                    Support farmers, discover fresh produce
                                    and make agricultural trade simpler
                                    with KrishiConnect.
                                </p>
                            </div>

                        </div>

                        <Link
                            to="/buyer/produce"
                            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-green-200 transition-all duration-300 hover:-translate-y-1 hover:bg-green-800 hover:shadow-lg"
                        >
                            Start Exploring
                            <ArrowRight
                                size={16}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                    </div>

                </section>


                {/* FOOTER */}

                <footer className="buyer-animate mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-200/80 py-5 text-center text-xs text-gray-400 sm:flex-row sm:text-left">

                    <p className="flex items-center gap-2">
                        <Leaf size={14} className="text-green-600" />
                        KrishiConnect — Connecting farms to markets.
                    </p>

                    <p>Built for a better agricultural future.</p>

                </footer>

            </div>

        </main>
    );
};

export default BuyerDashboard;
