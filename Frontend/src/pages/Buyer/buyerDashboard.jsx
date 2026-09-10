import {
    MapPin,
    Search,
    ShoppingCart,
    TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const BuyerDashboard = () => {
    const { user } = useAuth();

    return (
        <main className="min-h-screen bg-[#f5faf5] px-5 py-8 sm:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
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

                            {user?.village}
                        </div>
                    </div>

                    <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        Buyer
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50">
                            <Search className="h-5 w-5 text-green-600" />
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Available Produce
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Active Deals
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50">
                            <TrendingUp className="h-5 w-5 text-amber-600" />
                        </div>

                        <p className="mt-5 text-sm text-gray-500">
                            Market Activity
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-900">
                            0
                        </p>
                    </div>

                </div>

                {/* Welcome Card */}
                <div className="mt-6 rounded-3xl bg-blue-700 p-7 text-white shadow-lg">
                    <p className="text-sm font-semibold text-blue-100">
                        BUYER DASHBOARD
                    </p>

                    <h2 className="mt-2 text-2xl font-bold">
                        Discover produce directly from farmers.
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
                        Soon you will be able to discover farmer listings,
                        compare prices, negotiate deals and manage your
                        agricultural purchases.
                    </p>
                </div>

            </div>
        </main>
    );
};

export default BuyerDashboard;