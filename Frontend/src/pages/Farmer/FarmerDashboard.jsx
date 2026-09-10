import {
    Leaf,
    MapPin,
    Package,
    TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const FarmerDashboard = () => {
    const { user } = useAuth();

    return (
        <main className="min-h-screen bg-[#f5faf5] px-5 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>
                        <div className="flex items-center gap-2">
                            <Leaf className="h-5 w-5 text-green-600" />

                            <p className="text-sm font-bold tracking-wider text-green-600">
                                KRISHICONNECT
                            </p>
                        </div>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Welcome, {user?.name}
                        </h1>

                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />

                            {user?.village}
                        </div>
                    </div>

                    <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        Farmer
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50">
                            <Package className="h-5 w-5 text-green-600" />
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Active Listings
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Market Opportunities
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50">
                            <Leaf className="h-5 w-5 text-amber-600" />
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Farmer Type
                        </p>

                        <p className="mt-1 text-xl font-bold text-gray-900">
                            {user?.farmerType === "SMALL"
                                ? "Small / Marginal"
                                : "Large / FPO"}
                        </p>
                    </div>

                </div>

                {/* Welcome Card */}
                <div className="mt-6 rounded-3xl bg-green-700 p-7 text-white shadow-lg">
                    <p className="text-sm font-semibold text-green-100">
                        FARMER DASHBOARD
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                        Your agricultural marketplace starts here.
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50">
                        Soon you will be able to create produce listings,
                        discover market prices, negotiate directly with
                        buyers, manage deals and track deliveries.
                    </p>
                </div>

            </div>
        </main>
    );
};

export default FarmerDashboard;