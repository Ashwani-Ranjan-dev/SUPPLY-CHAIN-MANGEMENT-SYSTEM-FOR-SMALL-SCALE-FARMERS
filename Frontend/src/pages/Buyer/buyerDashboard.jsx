import { useEffect, useState } from "react";

import {
    MapPin,
    Search,
    ShoppingCart,
    Clock3,
    CheckCircle2,
    RefreshCw,
    ArrowRight,
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
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Active Deals",
            value: statistics.activeDeals,
            icon: ShoppingCart,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Pending Deals",
            value: statistics.pendingDeals,
            icon: Clock3,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            title: "Completed Deals",
            value: statistics.completedDeals,
            icon: CheckCircle2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
    ];


    return (
        <main className="min-h-screen px-5 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>
                        <p className="text-sm font-bold tracking-wider text-green-600">
                            KRISHICONNECT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Welcome, {user?.name}
                        </h1>

                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">

                            <MapPin className="h-4 w-4" />

                            {user?.village || "Location not available"}

                        </div>
                    </div>


                    <div className="flex items-center gap-3">

                        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                            Buyer
                        </div>

                        <LogoutButton />

                    </div>

                </div>


                {/* ERROR STATE */}
                {error && (
                    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="font-semibold text-red-800">
                                Unable to load dashboard
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchDashboardStatistics}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                            <RefreshCw className="h-4 w-4" />

                            Retry
                        </button>

                    </div>
                )}


                {/* STATISTICS */}


                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                    {stats.map((stat) => {

                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                            >

                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.iconBg}`}
                                >
                                    <Icon
                                        className={`h-5 w-5 ${stat.iconColor}`}
                                    />
                                </div>

                                <p className="mt-5 text-sm text-gray-500">
                                    {stat.title}
                                </p>

                                {loading ? (
                                    <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-gray-100" />
                                ) : (
                                    <p className="mt-1 text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                )}

                            </div>
                        );
                    })}

                </div>


          
                {/* QUICK ACTIONS */}

                <div className="mt-6 grid gap-5 md:grid-cols-2">

                    {/* Browse Produce */}

                    <Link
                        to="/buyer/produce"
                        className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50">
                            <Search className="h-5 w-5 text-green-600" />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-gray-900">
                            Browse Marketplace
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Discover fresh produce listed directly
                            by farmers and explore available offers.
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 group-hover:text-green-700">
                            Browse produce

                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>

                    </Link>


                    {/* My Deals */}

                    <Link
                        to="/buyer/deals"
                        className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-gray-900">
                            My Deals
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            View your offers, accepted deals,
                            payments and transaction progress.
                        </p>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                            View my deals

                            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>

                    </Link>

                </div>

                {/* BUYER INFORMATION CARD */}
                <div className="mt-6 overflow-hidden rounded-3xl bg-blue-700 p-7 text-white shadow-lg">

                    <p className="text-sm font-semibold text-blue-100">
                        BUYER DASHBOARD
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                        Discover produce directly from farmers.
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
                        Explore farmer listings, compare available
                        produce, create deals and manage your
                        agricultural purchases from one place.
                    </p>

                </div>

            </div>
        </main>
    );
};

export default BuyerDashboard;