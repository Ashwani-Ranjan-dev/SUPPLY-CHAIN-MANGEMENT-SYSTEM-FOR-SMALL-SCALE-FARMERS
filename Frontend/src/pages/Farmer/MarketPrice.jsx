import { useEffect, useState } from "react";
import {
    Search,
    RefreshCw,
    TrendingUp,
} from "lucide-react";

import MarketPriceListCard from "../../components/Farmer/MarketPriceListCard";

import {
  getMarketPrice,
} from "../../services/MarketPriceServices.js";

const MarketPrices = () => {
    const [prices, setPrices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const loadPrices = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getMarketPrice();

            setPrices(data.prices);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to load market prices."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPrices();
    }, []);

    const filteredPrices =
        prices.filter((price) =>
            price.crop
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    return (
        <div className="min-h-screen bg-[#f7faf7]">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                <TrendingUp
                                    size={23}
                                />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    Market Prices
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    Check current reference prices before negotiating with buyers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={loadPrices}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />
                        Refresh Prices
                    </button>
                </div>

                <div className="mb-7 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search crop..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-72 animate-pulse rounded-2xl bg-gray-200"
                                />
                            )
                        )}
                    </div>
                ) : filteredPrices.length ===
                  0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">

                        <TrendingUp
                            size={40}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 text-lg font-bold text-gray-800">
                            No market prices found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Try searching for another crop.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {filteredPrices.map(
                            (price) => (
                                <MarketPriceListCard
                                    key={
                                        price._id
                                    }
                                    price={
                                        price
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

export default MarketPrices;