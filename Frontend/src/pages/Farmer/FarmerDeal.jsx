import { useEffect, useMemo, useState } from "react";
import {
    Handshake,
    RefreshCw,
} from "lucide-react";

import FarmerDealCard from "../../components/Farmer/FarmerDealCard";

import {
    getFarmerDeals,
    acceptDeal,
    rejectDeal,
} from "../../services/dealServices.js";

const FarmerDeals = () => {
    const [deals, setDeals] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeFilter, setActiveFilter] =
        useState("ALL");

    const [actionLoading, setActionLoading] =
        useState(null);


    const loadDeals = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getFarmerDeals();

            setDeals(data.deals || []);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to load deals."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadDeals();
    }, []);


    const handleAccept = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const data =
                await acceptDeal(id);

            setDeals((current) =>
                current.map((deal) =>
                    deal._id === id
                        ? {
                              ...deal,
                              status:
                                  data.deal.status,
                          }
                        : deal
                )
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to accept deal."
            );
        } finally {
            setActionLoading(null);
        }
    };


    const handleReject = async (id) => {
        try {
            setActionLoading(id);
            setError("");

            const data =
                await rejectDeal(id);

            setDeals((current) =>
                current.map((deal) =>
                    deal._id === id
                        ? {
                              ...deal,
                              status:
                                  data.deal.status,
                          }
                        : deal
                )
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to reject deal."
            );
        } finally {
            setActionLoading(null);
        }
    };


    const filters = [
        "ALL",
        "PENDING",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
    ];


    const filteredDeals = useMemo(() => {
        if (activeFilter === "ALL") {
            return deals;
        }

        return deals.filter(
            (deal) =>
                deal.status === activeFilter
        );
    }, [deals, activeFilter]);


    return (
        <div className="min-h-screen bg-[#f7faf7]">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Page header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <Handshake size={24} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    My Deals
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage buyer offers and
                                    confirmed deals.
                                </p>
                            </div>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadDeals}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </div>


                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}


                {/* Filters */}
                <div className="mb-6 overflow-x-auto">

                    <div className="flex min-w-max gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">

                        {filters.map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() =>
                                    setActiveFilter(
                                        filter
                                    )
                                }
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                    activeFilter ===
                                    filter
                                        ? "bg-green-600 text-white"
                                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                                }`}
                            >
                                {filter}
                            </button>
                        ))}

                    </div>

                </div>


                {/* Loading */}
                {loading && (
                    <div className="grid gap-5 lg:grid-cols-2">

                        {[1, 2, 3, 4].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
                                />
                            )
                        )}

                    </div>
                )}


                {/* Empty */}
                {!loading &&
                    filteredDeals.length ===
                        0 && (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                <Handshake
                                    size={30}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-gray-900">
                                No deals found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Buyer offers will appear
                                here when someone sends
                                you a deal for your
                                produce.
                            </p>

                        </div>
                    )}


                {/* Deals */}
                {!loading &&
                    filteredDeals.length >
                        0 && (
                        <div className="grid gap-5 lg:grid-cols-2">

                            {filteredDeals.map(
                                (deal) => (
                                    <FarmerDealCard
                                        key={
                                            deal._id
                                        }
                                        deal={deal}
                                        onAccept={
                                            handleAccept
                                        }
                                        onReject={
                                            handleReject
                                        }
                                        actionLoading={
                                            actionLoading ===
                                            deal._id
                                        }
                                    />
                                )
                            )}

                        </div>
                    )}

            </div>

        </div>
    );
};

export default FarmerDeals;