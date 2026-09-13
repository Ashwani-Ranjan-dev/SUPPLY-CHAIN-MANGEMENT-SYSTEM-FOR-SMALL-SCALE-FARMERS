import {
    Sprout,
    Handshake,
    IndianRupee,
    Truck,
    Plus,
    TrendingUp,
    ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import FarmerSidebar from "../../components/Farmer/farmerSideBar";
import FarmerHeader from "../../components/Farmer/FarmerHeader";
import DashboardStatCard from "../../components/Farmer/DashboardStatCard";
import MarketPriceCard from "../../components/Farmer/MarketPriceCard";
import QuickActionCard from "../../components/Farmer/QuickActionCard";
import { useEffect, useState } from "react";
import { getFarmerDashboard } from "../../services/farmerServices.js";
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Data Fetching State (Placed inside the component)
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getFarmerDashboard();
                setDashboardData(data);
            } catch (err) {
                console.error("Dashboard Loading Error: ", err);
                setError(err.message || "Unable to Load Dashboard.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const isSmallFarmer = user?.farmerType === "SMALL";

    // Loading UI
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7faf7]">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />
                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Error UI
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7faf7] p-6">
                <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900">
                        Unable to load dashboard
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f7faf7]">
            <FarmerSidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <FarmerHeader setMobileOpen={setMobileOpen} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {/* Welcome Section */}
                        <section className="mb-8 rounded-3xl bg-green-700 p-6 text-white shadow-sm sm:p-8">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                                        <Sprout size={14} />
                                        {isSmallFarmer ? "Assisted Mode" : "Trade Mode"}
                                    </div>
                                    <h1 className="text-2xl font-bold sm:text-3xl">
                                        Good morning,{" "}
                                        {user?.name?.split(" ")[0] || "Farmer"}! 👋
                                    </h1>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-green-50">
                                        Manage your produce, discover market prices and connect directly with buyers.
                                    </p>
                                </div>

                                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-50"
                                onClick= {()=>navigate("/farmer/produce/new")}>
                                    <Plus size={18}/>
                                    Add Produce
                                </button>
                            </div>
                        </section>

                        {/* Stats */}
                        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <DashboardStatCard
                                title="My Produce"
                                value={dashboardData?.stats?.activeProduce ?? 0}
                                subtitle="Active listings"
                                icon={Sprout}
                            />
                            <DashboardStatCard
                                title="Active Deals"
                                value={dashboardData?.stats?.activeDeals ?? 0}
                                subtitle="Deals in progress"
                                icon={Handshake}
                            />
                            <DashboardStatCard
                                title="Total Earnings"
                                value={`₹${dashboardData?.stats?.totalEarnings ?? 0}`}
                                subtitle="Current month"
                                icon={IndianRupee}
                            />
                            <DashboardStatCard
                                title="Deliveries"
                                value={dashboardData?.stats?.pendingDeliveries ?? 0}
                                subtitle="Pending delivery"
                                icon={Truck}
                            />
                        </section>

                        {/* Main Grid */}
                        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                            {/* Market Prices */}
                            <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm xl:col-span-2">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Today's Market Prices
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Reference prices for your region
                                        </p>
                                    </div>

                                    <button className="hidden items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 sm:flex">
                                        View all
                                        <ArrowRight size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <MarketPriceCard
                                        crop="Wheat"
                                        price="2,450"
                                        unit="quintal"
                                        change="+4.2%"
                                    />
                                    <MarketPriceCard
                                        crop="Rice"
                                        price="2,180"
                                        unit="quintal"
                                        change="+2.8%"
                                    />
                                    <MarketPriceCard
                                        crop="Maize"
                                        price="2,050"
                                        unit="quintal"
                                        change="+3.5%"
                                    />
                                </div>
                            </div>

                            {/* Farmer Profile */}
                            <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            {user?.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {user?.village}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                                    <div>
                                        <p className="text-xs text-gray-500">Farmer Type</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {isSmallFarmer
                                                ? "Small / Marginal Farmer"
                                                : "Large Farmer / FPO"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Produce Interest</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {user?.produceInterest || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Quick Actions */}
                        <section className="mt-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Quick Actions
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Common actions for your farming activity
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <QuickActionCard
                                    title="Add New Produce"
                                    description="Create a new produce listing"
                                    icon={Plus}
                                    onClick={()=> navigate("/farmer/produce/new")}
                                />
                                <QuickActionCard
                                    title="Check Market Prices"
                                    description="Compare today's prices"
                                    icon={TrendingUp}
                                />
                                <QuickActionCard
                                    title="View My Deals"
                                    description="Track your active trades"
                                    icon={Handshake}
                                />
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FarmerDashboard;