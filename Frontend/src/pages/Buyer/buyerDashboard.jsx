import {
    MapPin,
    Search,
    ShoppingCart,
    TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import LogoutButton from "../../components/auth/LogoutButton";

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

                    <LogoutButton />
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

                {/* Buyer Actions */}
                <div className="mt-6 grid gap-5 md:grid-cols-2">

                    <Link
                        to="/buyer/deals"
                        className="
                            group
                            rounded-3xl
                            border
                            border-gray-100
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-blue-50
                            "
                        >

                            <ShoppingCart
                                className="
                                    h-5
                                    w-5
                                    text-blue-600
                                "
                            />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-lg
                                font-bold
                                text-gray-900
                            "
                        >
                            My Deals
                        </h3>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-gray-500
                            "
                        >
                            View your negotiations, accepted
                            deals and complete payments.
                        </p>


                        <p
                            className="
                                mt-4
                                text-sm
                                font-semibold
                                text-blue-600
                                group-hover:text-blue-700
                            "
                        >
                            View my deals →
                        </p>

                    </Link>


                    <Link
                        to="/buyer/produce"
                        className="
                            group
                            rounded-3xl
                            border
                            border-gray-100
                            bg-white
                            p-6
                            shadow-sm
                            transition
                            hover:-translate-y-1
                            hover:shadow-md
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-2xl
                                bg-green-50
                            "
                        >

                            <Search
                                className="
                                    h-5
                                    w-5
                                    text-green-600
                                "
                            />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-lg
                                font-bold
                                text-gray-900
                            "
                        >
                            Browse Produce
                        </h3>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-gray-500
                            "
                        >
                            Discover produce listed directly
                            by farmers.
                        </p>


                        <p
                            className="
                                mt-4
                                text-sm
                                font-semibold
                                text-green-600
                                group-hover:text-green-700
                            "
                        >
                            Browse produce →
                        </p>

                    </Link>

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