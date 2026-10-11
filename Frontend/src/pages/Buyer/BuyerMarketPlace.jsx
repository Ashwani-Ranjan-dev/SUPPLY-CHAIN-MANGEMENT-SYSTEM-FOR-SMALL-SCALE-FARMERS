import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    MapPin,
    Package,
    Sprout,
    ArrowRight,
    RefreshCw,
    AlertCircle,
    SlidersHorizontal,
} from "lucide-react";
import { getMarketplaceProduce } from "../../services/buyerServices";

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(price ?? 0);

const BuyerMarketplace = () => {
    const [produce, setProduce] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [quality, setQuality] = useState("ALL");
    const [sortBy, setSortBy] = useState("newest");

    const fetchProduce = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMarketplaceProduce();
            setProduce(Array.isArray(data.produce) ? data.produce : []);
        } catch (err) {
            setError(err.message || "Unable to load available produce.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduce();
    }, []);

    const filteredProduce = useMemo(() => {
        const term = search.trim().toLowerCase();

        const results = produce.filter((item) => {
            const farmerName =
                typeof item.farmer === "object"
                    ? item.farmer?.name || ""
                    : "";

            const matchesSearch = [
                item.crop,
                item.location,
                item.description,
                farmerName,
            ].some((value) =>
                String(value || "").toLowerCase().includes(term)
            );

            const matchesQuality =
                quality === "ALL" || item.quality === quality;

            return matchesSearch && matchesQuality;
        });

        return [...results].sort((a, b) => {
            if (sortBy === "price-low") {
                return Number(a.expectedPrice) - Number(b.expectedPrice);
            }

            if (sortBy === "price-high") {
                return Number(b.expectedPrice) - Number(a.expectedPrice);
            }

            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }, [produce, search, quality, sortBy]);

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white shadow-sm sm:p-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-green-100">
                            KRISHICONNECT MARKETPLACE
                        </p>
                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            Discover fresh produce
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
                            Browse available crops directly from farmers and
                            find produce that fits your requirements.
                        </p>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                        <Sprout size={34} />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_190px_190px]">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search crop, farmer or location..."
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />
                    </div>

                    <div className="relative">
                        <SlidersHorizontal
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                            value={quality}
                            onChange={(event) => setQuality(event.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-green-500"
                        >
                            <option value="ALL">All qualities</option>
                            <option value="STANDARD">Standard</option>
                            <option value="GOOD">Good</option>
                            <option value="PREMIUM">Premium</option>
                        </select>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-500"
                    >
                        <option value="newest">Newest listings</option>
                        <option value="price-low">Price: low to high</option>
                        <option value="price-high">Price: high to low</option>
                    </select>
                </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Available produce
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {loading
                            ? "Loading listings..."
                            : `${filteredProduce.length} listing${filteredProduce.length === 1 ? "" : "s"} found`}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchProduce}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            className="mt-0.5 shrink-0 text-red-600"
                            size={20}
                        />
                        <div>
                            <p className="font-semibold text-red-800">
                                Unable to load marketplace
                            </p>
                            <p className="mt-1 text-sm text-red-700">{error}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={fetchProduce}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
                        >
                            <div className="h-5 w-2/5 rounded bg-gray-200" />
                            <div className="mt-4 h-4 w-3/5 rounded bg-gray-100" />
                            <div className="mt-6 h-20 rounded-xl bg-gray-100" />
                            <div className="mt-5 h-10 rounded-lg bg-gray-100" />
                        </div>
                    ))}
                </div>
            ) : !error && filteredProduce.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
                        <Package size={27} />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900">
                        No produce found
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Try a different search or quality filter, or check
                        again later for new farmer listings.
                    </p>
                    {(search || quality !== "ALL") && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setQuality("ALL");
                            }}
                            className="mt-4 font-semibold text-green-700 hover:text-green-800"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : !error ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProduce.map((item) => (
                        <article
                            key={item._id}
                            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                        <Sprout size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="truncate text-lg font-bold capitalize text-gray-900">
                                            {item.crop}
                                        </h3>
                                        <p className="mt-1 truncate text-sm text-gray-500">
                                            {item.farmer?.name || "Farmer"}
                                        </p>
                                    </div>
                                </div>

                                <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Available
                                </span>
                            </div>

                            <div className="flex-1 space-y-4 p-5">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin
                                        size={16}
                                        className="shrink-0 text-green-700"
                                    />
                                    <span className="truncate">
                                        {item.location || "Location not provided"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Quantity
                                        </p>
                                        <p className="mt-1 font-bold text-gray-900">
                                            {item.quantity} {item.unit}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-xs text-gray-500">
                                            Quality
                                        </p>
                                        <p className="mt-1 font-bold capitalize text-gray-900">
                                            {String(item.quality || "STANDARD").toLowerCase()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500">
                                        Farmer's expected price
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-green-700">
                                        {formatPrice(item.expectedPrice)}
                                        <span className="ml-1 text-sm font-medium text-gray-500">
                                            / {item.unit}
                                        </span>
                                    </p>
                                </div>

                                {item.description && (
                                    <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                                        {item.description}
                                    </p>
                                )}

                                <div className="text-xs text-gray-500">
                                    Available from:{" "}
                                    {item.availableFrom
                                        ? new Date(item.availableFrom).toLocaleDateString("en-IN")
                                        : "Not specified"}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 p-5">
                                <Link
                                    to={`/buyer/produce/${item._id}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                                >
                                    View details
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default BuyerMarketplace;