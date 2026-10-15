
import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Package,
    MapPin,
    CalendarDays,
    Users,
    ChevronDown,
    ChevronUp,
    AlertCircle,
    Sprout,
    IndianRupee,
} from "lucide-react";

import {
    getOpenPooledLots,
    getPooledLotById,
} from "../../services/PoolingServices.js";

const formatDate = (value) => {
    if (!value) return "Not specified";

    return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatQuantity = (quantity, unit) =>
    `${Number(quantity || 0).toLocaleString("en-IN")} ${unit || ""}`;

const BuyerPooledLots = () => {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedLotId, setExpandedLotId] = useState(null);
    const [selectedLot, setSelectedLot] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    const fetchLots = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getOpenPooledLots();
            setLots(result.data || []);
        } catch (err) {
            setError(err.message || "Unable to load pooled lots.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLots();
    }, [fetchLots]);

    const toggleLotDetails = async (lotId) => {
        if (expandedLotId === lotId) {
            setExpandedLotId(null);
            setSelectedLot(null);
            setDetailError("");
            return;
        }

        try {
            setExpandedLotId(lotId);
            setSelectedLot(null);
            setDetailError("");
            setDetailLoading(true);

            const result = await getPooledLotById(lotId);
            setSelectedLot(result.data);
        } catch (err) {
            setDetailError(
                err.message || "Unable to load lot details."
            );
        } finally {
            setDetailLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Page heading */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
                            <Sprout size={18} />
                            KrishiConnect Marketplace
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Pooled Produce
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
                            Explore combined produce lots from
                            multiple farmers and discover larger
                            quantities in one place.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={fetchLots}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Available pooled lots
                            </p>
                            <Package className="text-green-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {lots.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Contributing farmers
                            </p>
                            <Users className="text-green-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {new Set(
                                lots.flatMap((lot) =>
                                    (lot.listings || []).map(
                                        (item) =>
                                            item.farmer?._id ||
                                            item.farmer
                                    )
                                )
                            ).size}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Crops available
                            </p>
                            <Sprout className="text-green-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {new Set(
                                lots.map((lot) =>
                                    (lot.crop || "").toLowerCase()
                                )
                            ).size}
                        </p>
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
                        <AlertCircle
                            className="shrink-0 text-red-600"
                            size={20}
                        />
                        <p className="flex-1 text-sm text-red-700">
                            {error}
                        </p>
                        <button
                            type="button"
                            onClick={fetchLots}
                            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-100"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6"
                            >
                                <div className="h-5 w-1/3 rounded bg-gray-200" />
                                <div className="mt-4 h-8 w-1/2 rounded bg-gray-200" />
                                <div className="mt-5 h-4 w-full rounded bg-gray-100" />
                                <div className="mt-3 h-4 w-2/3 rounded bg-gray-100" />
                                <div className="mt-6 h-10 rounded-xl bg-gray-100" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && lots.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                            <Package
                                className="text-green-600"
                                size={28}
                            />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-gray-900">
                            No pooled lots available
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Compatible farmer listings will appear
                            here when pooled lots have been created.
                            Try refreshing later.
                        </p>

                        <button
                            type="button"
                            onClick={fetchLots}
                            className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Check again
                        </button>
                    </div>
                )}

                {/* Pooled lot cards */}
                {!loading && lots.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {lots.map((lot) => {
                            const isExpanded =
                                expandedLotId === lot._id;

                            return (
                                <article
                                    key={lot._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                >
                                    <div className="p-5 sm:p-6">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    <Sprout size={14} />
                                                    Pooled produce
                                                </span>

                                                <h2 className="mt-3 text-xl font-bold capitalize text-gray-900">
                                                    {lot.crop}
                                                </h2>

                                                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                                                    <MapPin size={15} />
                                                    {lot.location}
                                                </p>
                                            </div>

                                            <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-600">
                                                {lot.quality}
                                            </span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <div className="rounded-xl bg-green-50 p-4">
                                                <p className="text-xs font-medium text-green-700">
                                                    Combined quantity
                                                </p>
                                                <p className="mt-1 text-lg font-bold text-gray-900">
                                                    {formatQuantity(
                                                        lot.totalQuantity,
                                                        lot.unit
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-medium text-gray-500">
                                                    Farmers
                                                </p>
                                                <p className="mt-1 text-lg font-bold text-gray-900">
                                                    {new Set(
                                                        (lot.listings || []).map(
                                                            (item) =>
                                                                item.farmer?._id ||
                                                                item.farmer
                                                        )
                                                    ).size}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                                            <CalendarDays
                                                size={17}
                                                className="mt-0.5 shrink-0"
                                            />
                                            <span>
                                                Available{" "}
                                                {formatDate(
                                                    lot.earliestAvailableFrom
                                                )}
                                                {" – "}
                                                {formatDate(
                                                    lot.latestAvailableFrom
                                                )}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                toggleLotDetails(lot._id)
                                            }
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                                        >
                                            {isExpanded
                                                ? "Hide details"
                                                : "View farmers and produce"}
                                            {isExpanded ? (
                                                <ChevronUp size={17} />
                                            ) : (
                                                <ChevronDown size={17} />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="mt-5 border-t border-gray-100 pt-5">
                                                {detailLoading && (
                                                    <p className="text-sm text-gray-500">
                                                        Loading lot details...
                                                    </p>
                                                )}

                                                {detailError && (
                                                    <p className="text-sm text-red-600">
                                                        {detailError}
                                                    </p>
                                                )}

                                                {selectedLot?._id ===
                                                    lot._id && (
                                                    <>
                                                        <h3 className="font-semibold text-gray-900">
                                                            Contributing listings
                                                        </h3>

                                                        <div className="mt-3 space-y-3">
                                                            {(
                                                                selectedLot.listings ||
                                                                []
                                                            ).map(
                                                                (listing, index) => (
                                                                    <div
                                                                        key={
                                                                            listing.produce?._id ||
                                                                            index
                                                                        }
                                                                        className="rounded-xl border border-gray-200 p-4"
                                                                    >
                                                                        <div className="flex items-start justify-between gap-3">
                                                                            <div>
                                                                                <p className="font-semibold text-gray-900">
                                                                                    {listing.farmer?.name ||
                                                                                        "Farmer"}
                                                                                </p>
                                                                                <p className="mt-1 text-sm text-gray-500">
                                                                                    {listing.farmer?.village ||
                                                                                        selectedLot.location}
                                                                                </p>
                                                                            </div>

                                                                            <p className="text-right text-sm font-bold text-gray-900">
                                                                                {formatQuantity(
                                                                                    listing.quantity,
                                                                                    selectedLot.unit
                                                                                )}
                                                                            </p>
                                                                        </div>

                                                                        <div className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                                                                            <IndianRupee
                                                                                size={15}
                                                                            />
                                                                            {Number(
                                                                                listing.expectedPrice || 0
                                                                            ).toLocaleString(
                                                                                "en-IN"
                                                                            )}
                                                                            {" per "}
                                                                            {selectedLot.unit}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerPooledLots;
