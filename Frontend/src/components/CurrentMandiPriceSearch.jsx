
import { useEffect, useState } from "react";
import {
    Search,
    MapPin,
    RefreshCw,
    AlertCircle,
    CalendarDays,
    IndianRupee,
} from "lucide-react";

import {
    getMarketPriceStates,
    getCurrentMarketPrices,
} from "../services/MarketPriceServices";

const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") {
        return "Not available";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function CurrentMandiPriceSearch() {
    const [states, setStates] = useState([]);
    const [state, setState] = useState("");
    const [crop, setCrop] = useState("");
    const [prices, setPrices] = useState([]);

    const [statesLoading, setStatesLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadStates = async () => {
            setStatesLoading(true);

            try {
                const data = await getMarketPriceStates();

                if (cancelled) return;

                const availableStates = data.states || [];
                setStates(availableStates);

                if (availableStates.length > 0) {
                    setState((current) =>
                        availableStates.includes(current)
                            ? current
                            : availableStates[0]
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Unable to load states.");
                }
            } finally {
                if (!cancelled) setStatesLoading(false);
            }
        };

        loadStates();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleSearch = async (event) => {
        event.preventDefault();

        if (!state || !crop.trim()) {
            setError("Please select a state and enter a crop name.");
            return;
        }

        setSearchLoading(true);
        setSearched(true);
        setError("");
        setPrices([]);

        try {
            const data = await getCurrentMarketPrices({
                state,
                crop: crop.trim(),
            });

            setPrices(data.prices || []);
        } catch (err) {
            setError(err.message || "Unable to search mandi prices.");
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div>
                <div className="flex items-center gap-2">
                    <MapPin className="text-green-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">
                        Find Current Mandi Prices
                    </h2>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    Select a state and search for a crop to compare available
                    mandi prices.
                </p>
            </div>

            <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 items-end gap-4 sm:grid-cols-3"
            >
                <label className="text-sm font-medium text-gray-700">
                    Select state
                    <select
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                        disabled={statesLoading || states.length === 0}
                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                    >
                        <option value="">
                            {statesLoading
                                ? "Loading states..."
                                : "Choose a state"}
                        </option>

                        {states.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                    Crop name
                    <input
                        type="text"
                        value={crop}
                        onChange={(event) => setCrop(event.target.value)}
                        placeholder="e.g. Tomato, Wheat, Rice"
                        className="mt-1 w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                </label>

                <button
                    type="submit"
                    disabled={statesLoading || searchLoading || !state}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {searchLoading ? (
                        <RefreshCw className="animate-spin" size={18} />
                    ) : (
                        <Search size={18} />
                    )}
                    {searchLoading ? "Searching..." : "Find Prices"}
                </button>
            </form>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {!statesLoading && !error && states.length === 0 && (
                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    No states are available yet. Check your saved market-price
                    records in MongoDB.
                </div>
            )}

            {searchLoading && (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-12 text-gray-500">
                    <RefreshCw size={20} className="animate-spin" />
                    Searching saved mandi prices...
                </div>
            )}

            {!searchLoading && searched && !error && prices.length === 0 && (
                <div className="rounded-xl bg-gray-50 px-4 py-10 text-center">
                    <Search size={32} className="mx-auto mb-3 text-gray-400" />
                    <h3 className="font-semibold text-gray-800">
                        No matching mandi prices found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try another crop name or select a different state.
                    </p>
                </div>
            )}

            {!searchLoading && prices.length > 0 && !error && (
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">
                            {prices.length} mandi result
                            {prices.length === 1 ? "" : "s"}
                        </h3>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            {state}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {prices.map((item, index) => (
                            <article
                                key={[
                                    item._id || "",
                                    item.market || "",
                                    item.location || "",
                                    item.variety || "",
                                    index,
                                ].join("-")}
                                className="rounded-2xl border border-gray-200 p-4 transition hover:border-green-300 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">
                                            {item.crop}
                                        </h4>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                                            <MapPin size={15} />
                                            {item.market}
                                        </p>
                                        {item.location && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.location}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-xl bg-green-50 p-2 text-green-700">
                                        <IndianRupee size={21} />
                                    </div>
                                </div>

                                <div className="mt-5 rounded-xl bg-green-50 p-4">
                                    <p className="text-sm text-green-800">
                                        Modal price
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-green-800">
                                        {formatPrice(item.modalPrice)}
                                    </p>
                                    <p className="mt-1 text-xs text-green-700">
                                        per {String(item.unit || "QUINTAL").toLowerCase()}
                                    </p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Minimum price
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-800">
                                            {formatPrice(item.minPrice)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Maximum price
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-800">
                                            {formatPrice(item.maxPrice)}
                                        </p>
                                    </div>
                                </div>

                                {item.variety && (
                                    <p className="mt-3 text-sm text-gray-600">
                                        Variety: {item.variety}
                                    </p>
                                )}

                                <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                                    <CalendarDays size={15} />
                                    Price observation:{" "}
                                    {formatDate(item.priceDate || item.updatedAt)}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500">
                Prices reflect the latest available saved observations. Check
                the observation date before using a price for a transaction.
            </p>
        </section>
    );
}
