
import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    Package,
    MapPin,
    Users,
    IndianRupee,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";

import { getBuyerPooledDeals } from "../../services/pooledDealServices";

const statusStyles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    CANCELLED: "bg-gray-100 text-gray-600 border-gray-200",
    COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const responseStyles = {
    PENDING: "text-amber-700 bg-amber-50",
    ACCEPTED: "text-green-700 bg-green-50",
    REJECTED: "text-red-700 bg-red-50",
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const BuyerPooledDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadDeals = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const result = await getBuyerPooledDeals();
            setDeals(result.data || []);
        } catch (err) {
            setError(err.message || "Unable to load pooled deals.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDeals();
    }, [loadDeals]);

    const totalOffers = deals.length;
    const acceptedOffers = deals.filter(
        (deal) => deal.status === "ACCEPTED"
    ).length;
    const pendingOffers = deals.filter(
        (deal) => deal.status === "PENDING"
    ).length;

    if (loading) {
        return (
            <div className="space-y-5 p-4 sm:p-6">
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
                <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-24 animate-pulse rounded-2xl bg-gray-100"
                        />
                    ))}
                </div>
                <div className="h-48 animate-pulse rounded-2xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            KRISHICONNECT / MARKETPLACE
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                            My Pooled Deals
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Track your pooled offers and farmer responses.
                        </p>
                    </div>

                    <button
                        onClick={() => loadDeals(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="font-semibold">
                                Could not load pooled deals
                            </p>
                            <p className="mt-1">{error}</p>
                            <button
                                onClick={() => loadDeals()}
                                className="mt-2 font-semibold underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total Offers"
                        value={totalOffers}
                        icon={Package}
                        color="text-blue-600"
                        bg="bg-blue-50"
                    />
                    <StatCard
                        title="Awaiting Responses"
                        value={pendingOffers}
                        icon={Clock}
                        color="text-amber-600"
                        bg="bg-amber-50"
                    />
                    <StatCard
                        title="Accepted Offers"
                        value={acceptedOffers}
                        icon={CheckCircle2}
                        color="text-green-600"
                        bg="bg-green-50"
                    />
                </div>

                {!error && deals.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <Package size={27} />
                        </div>
                        <h2 className="mt-4 text-lg font-bold text-gray-900">
                            No pooled offers yet
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            Explore pooled produce and submit an offer to
                            farmers. Your offers will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {deals.map((deal) => {
                            const lot =
                                deal.pooledLot &&
                                typeof deal.pooledLot === "object"
                                    ? deal.pooledLot
                                    : {};

                            const contributions = deal.contributions || [];

                            return (
                                <section
                                    key={deal._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-bold text-gray-900">
                                                {lot.crop || "Pooled Produce"}
                                            </h2>
                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin size={15} />
                                                    {lot.location || "Location unavailable"}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Users size={15} />
                                                    {contributions.length} contributions
                                                </span>
                                            </div>
                                            <p className="mt-2 break-all text-xs text-gray-400">
                                                Offer ID: {deal._id}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                                                statusStyles[deal.status] ||
                                                statusStyles.PENDING
                                            }`}
                                        >
                                            {deal.status || "PENDING"}
                                        </span>
                                    </div>

                                    <div className="grid gap-4 border-b border-gray-100 bg-gray-50/70 p-5 sm:grid-cols-3">
                                        <Metric
                                            label="Total quantity"
                                            value={`${deal.quantity ?? 0} ${deal.unit || lot.unit || ""}`}
                                        />
                                        <Metric
                                            label="Offered price / unit"
                                            value={formatCurrency(deal.offeredPrice)}
                                        />
                                        <Metric
                                            label="Total offer amount"
                                            value={formatCurrency(deal.totalAmount)}
                                            highlight
                                        />
                                    </div>

                                    <div className="p-5">
                                        <h3 className="mb-4 text-sm font-bold text-gray-900">
                                            Farmer responses
                                        </h3>

                                        {contributions.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No contribution details available.
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {contributions.map(
                                                    (contribution, index) => {
                                                        const farmer =
                                                            contribution.farmer &&
                                                            typeof contribution.farmer === "object"
                                                                ? contribution.farmer
                                                                : {};

                                                        const responseStatus =
                                                            contribution.responseStatus ||
                                                            "PENDING";

                                                        return (
                                                            <div
                                                                key={`${contribution.produce?._id || contribution.produce || index}-${index}`}
                                                                className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                                                            >
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">
                                                                        {farmer.name ||
                                                                            `Farmer ${index + 1}`}
                                                                    </p>
                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {contribution.quantity}{" "}
                                                                        {deal.unit || lot.unit}{" "}
                                                                        contribution
                                                                    </p>
                                                                    {farmer.village && (
                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            {farmer.village}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <span
                                                                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                                        responseStyles[responseStatus] ||
                                                                        responseStyles.PENDING
                                                                    }`}
                                                                >
                                                                    {responseStatus}
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}

                                        {deal.message && (
                                            <div className="mt-4 rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Your message
                                                </p>
                                                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                                                    {deal.message}
                                                </p>
                                            </div>
                                        )}

                                        <p className="mt-4 text-xs text-gray-400">
                                            Submitted{" "}
                                            {deal.createdAt
                                                ? new Date(
                                                      deal.createdAt
                                                  ).toLocaleString("en-IN")
                                                : "date unavailable"}
                                        </p>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className={`rounded-xl p-2.5 ${bg} ${color}`}>
                <Icon size={21} />
            </div>
        </div>
        <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

const Metric = ({ label, value, highlight = false }) => (
    <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p
            className={`mt-1 flex items-center gap-1 text-lg font-bold ${
                highlight ? "text-green-700" : "text-gray-900"
            }`}
        >
            {highlight && <IndianRupee size={17} />}
            {highlight ? value.replace("₹", "") : value}
        </p>
    </div>
);

export default BuyerPooledDeals;
