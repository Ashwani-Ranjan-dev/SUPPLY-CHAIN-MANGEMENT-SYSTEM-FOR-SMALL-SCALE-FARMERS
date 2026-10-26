import { useEffect, useMemo, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    AlertCircle,
    BarChart3,
    RefreshCw,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import { getMarketPriceHistory } from "../../services/MarketPriceServices";

const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(value ?? 0);

const formatDate = (value) =>
    new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });

export default function MarketPriceHistoryChart({ prices = [] }) {
    const [crop, setCrop] = useState("");
    const [market, setMarket] = useState("");
    const [days, setDays] = useState(30);
    const [history, setHistory] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Triggers a fresh history request when the Refresh button is clicked.
    const [refreshKey, setRefreshKey] = useState(0);

    const crops = useMemo(
        () =>
            [
                ...new Set(
                    prices.map((item) => item.crop).filter(Boolean)
                ),
            ].sort(),
        [prices]
    );

    const markets = useMemo(
        () => [
            ...new Set(
                prices
                    .filter((item) => item.crop === crop)
                    .map((item) => item.market)
                    .filter(Boolean)
            ),
        ].sort(),
        [prices, crop]
    );

    useEffect(() => {
        if (!crops.length) {
            setCrop("");
            return;
        }

        if (!crops.includes(crop)) {
            setCrop(crops[0]);
        }
    }, [crops, crop]);

    useEffect(() => {
        if (!markets.length) {
            setMarket("");
            return;
        }

        if (!markets.includes(market)) {
            setMarket(markets[0]);
        }
    }, [markets, market]);

    useEffect(() => {
        if (!crop || !market) {
            setHistory([]);
            setSummary(null);
            return;
        }

        let cancelled = false;

        const loadHistory = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getMarketPriceHistory({
                    crop,
                    market,
                    days,
                });

                if (cancelled) return;

                setHistory(data.history || []);
                setSummary(data.summary || null);
            } catch (err) {
                if (cancelled) return;

                setHistory([]);
                setSummary(null);
                setError(
                    err.message || "Unable to load price history."
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadHistory();

        return () => {
            cancelled = true;
        };
    }, [crop, market, days, refreshKey]);

    const change = summary?.percentageChange;
    const hasChange = typeof change === "number";

    return (
        <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3
                            className="text-green-600"
                            size={24}
                        />

                        <h2 className="text-xl font-bold text-gray-900">
                            Mandi Price Trends
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Historical modal price per reported unit
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setRefreshKey((value) => value + 1)
                    }
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700">
                    Crop

                    <select
                        value={crop}
                        onChange={(event) => {
                            setCrop(event.target.value);
                            setMarket("");
                        }}
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5"
                    >
                        {crops.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                    Mandi

                    <select
                        value={market}
                        onChange={(event) =>
                            setMarket(event.target.value)
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5"
                    >
                        {markets.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm font-medium text-gray-700">
                    Period

                    <select
                        value={days}
                        onChange={(event) =>
                            setDays(Number(event.target.value))
                        }
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2.5"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                    </select>
                </label>
            </div>

            {loading && (
                <div className="flex h-72 items-center justify-center text-gray-500">
                    <RefreshCw
                        className="mr-2 animate-spin"
                        size={20}
                    />
                    Loading price history...
                </div>
            )}

            {!loading && error && (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-700">
                    <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="font-semibold">
                            Unable to load chart
                        </p>

                        <p className="mt-1 text-sm">
                            {error}
                        </p>
                    </div>
                </div>
            )}

            {!loading && !error && history.length === 0 && (
                <div className="flex h-56 flex-col items-center justify-center rounded-xl bg-gray-50 px-4 text-center">
                    <BarChart3
                        size={34}
                        className="mb-3 text-gray-400"
                    />

                    <p className="font-semibold text-gray-700">
                        No historical observations yet
                    </p>

                    <p className="mt-1 max-w-md text-sm text-gray-500">
                        Price trends will appear when saved mandi records
                        contain dates within the selected period.
                        Current prices alone do not create historical
                        observations.
                    </p>
                </div>
            )}

            {!loading && !error && history.length > 0 && (
                <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Latest modal price
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-900">
                                {formatPrice(summary?.latestModalPrice)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Earliest modal price
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-900">
                                {formatPrice(summary?.firstModalPrice)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Change across observations
                            </p>

                            <p
                                className={`mt-1 flex items-center gap-2 text-xl font-bold ${
                                    !hasChange
                                        ? "text-gray-700"
                                        : change > 0
                                          ? "text-green-600"
                                          : change < 0
                                            ? "text-red-600"
                                            : "text-gray-700"
                                }`}
                            >
                                {hasChange && change > 0 && (
                                    <TrendingUp size={20} />
                                )}

                                {hasChange && change < 0 && (
                                    <TrendingDown size={20} />
                                )}

                                {hasChange
                                    ? `${change > 0 ? "+" : ""}${change}%`
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="h-72 w-full sm:h-96">
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <LineChart
                                data={history}
                                margin={{
                                    top: 10,
                                    right: 12,
                                    left: 12,
                                    bottom: 8,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    minTickGap={24}
                                />

                                <YAxis
                                    width={85}
                                    tickFormatter={(value) =>
                                        `₹${Number(value).toLocaleString(
                                            "en-IN"
                                        )}`
                                    }
                                />

                                <Tooltip
                                    labelFormatter={(value) =>
                                        formatDate(value)
                                    }
                                    formatter={(value) => [
                                        formatPrice(value),
                                        "Modal price",
                                    ]}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="modalPrice"
                                    name="Modal price"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    connectNulls={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <p className="text-xs text-gray-500">
                        Based on {history.length} saved observation
                        {history.length === 1 ? "" : "s"} for {crop} at{" "}
                        {market}. The percentage compares the earliest
                        and latest available observations, which may cover
                        less than the selected period.
                    </p>
                </>
            )}
        </section>
    );
}
