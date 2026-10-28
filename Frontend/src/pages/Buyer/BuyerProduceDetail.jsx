import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    MapPin,
    Sprout,
    UserRound,
    Package,
    IndianRupee,
    CalendarDays,
    RefreshCw,
    AlertCircle,
    Image as ImageIcon,
} from "lucide-react";

import { getMarketplaceProduceById } from "../../services/buyerServices";

const BuyerProduceDetails = () => {
    const { id } = useParams();

    const [produce, setProduce] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState(false);

    const fetchProduceDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setImageError(false);

            const data = await getMarketplaceProduceById(id);
            setProduce(data.produce || null);
        } catch (err) {
            setError(err.message || "Unable to load produce details.");
            setProduce(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduceDetails();
    }, [fetchProduceDetails]);

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <div className="mb-6 h-6 w-36 animate-pulse rounded bg-gray-200" />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="h-72 animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
                    <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
                </div>
            </div>
        );
    }

    if (error || !produce) {
        return (
            <div className="mx-auto max-w-3xl p-6">
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                    <AlertCircle
                        className="mx-auto mb-3 text-red-500"
                        size={36}
                    />

                    <h2 className="text-xl font-bold text-gray-900">
                        Unable to load produce
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        {error || "This listing is no longer available."}
                    </p>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={fetchProduceDetails}
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700"
                        >
                            <RefreshCw size={16} />
                            Try again
                        </button>

                        <Link
                            to="/buyer/produce"
                            className="rounded-xl border border-gray-200 px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Back to marketplace
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const farmer = produce.farmer || {};

    const details = [
        {
            label: "Available quantity",
            value: `${produce.quantity} ${produce.unit}`,
            icon: Package,
        },
        {
            label: "Quality",
            value: produce.quality || "Not specified",
            icon: Sprout,
        },
        {
            label: "Location",
            value: produce.location || farmer.village || "Not specified",
            icon: MapPin,
        },
        {
            label: "Available from",
            value: produce.availableFrom
                ? new Date(produce.availableFrom).toLocaleDateString("en-IN")
                : "Available now",
            icon: CalendarDays,
        },
    ];

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
            <Link
                to="/buyer/produce"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700"
            >
                <ArrowLeft size={18} />
                Back to marketplace
            </Link>

            <div className="grid items-start gap-6 lg:grid-cols-3">
                <section className="space-y-6 lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        {/* Produce image */}
                        <div className="relative h-64 overflow-hidden bg-green-50 sm:h-80 lg:h-96">
                            {produce.imageUrl && !imageError ? (
                                <img
                                    src={produce.imageUrl}
                                    alt={`${produce.crop || "Produce"} offered by ${farmer.name || "farmer"}`}
                                    className="h-full w-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center gap-3 text-green-700">
                                    <ImageIcon size={52} strokeWidth={1.5} />
                                    <p className="text-sm font-medium">
                                        No image available
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Produce information */}
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                                        {produce.status || "ACTIVE"}
                                    </span>

                                    <h1 className="mt-4 text-3xl font-bold text-gray-900">
                                        {produce.crop}
                                    </h1>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                        <MapPin size={16} />
                                        {produce.location ||
                                            farmer.village ||
                                            "Location not specified"}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-green-50 p-4">
                                    <Sprout
                                        size={30}
                                        className="text-green-700"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                {details.map(({ label, value, icon: Icon }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                                    >
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Icon size={17} />
                                            {label}
                                        </div>

                                        <p className="mt-2 font-semibold text-gray-900">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Description
                                </h2>

                                <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-600">
                                    {produce.description ||
                                        "The farmer has not added a description."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">
                            Expected price
                        </p>

                        <div className="mt-2 flex items-center gap-1">
                            <IndianRupee
                                size={25}
                                className="text-green-700"
                            />

                            <span className="text-3xl font-bold text-gray-900">
                                {Number(
                                    produce.expectedPrice
                                ).toLocaleString("en-IN")}
                            </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                            per {produce.unit}
                        </p>

                        <div className="my-6 border-t border-gray-100" />

                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-green-50 p-3">
                                <UserRound
                                    size={20}
                                    className="text-green-700"
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Listed by
                                </p>

                                <h2 className="mt-1 font-bold text-gray-900">
                                    {farmer.name || "Farmer"}
                                </h2>

                                <p className="mt-1 text-sm text-gray-600">
                                    {farmer.village ||
                                        produce.location ||
                                        "Location not specified"}
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 rounded-xl bg-amber-50 p-3 text-sm leading-5 text-amber-800">
                            This is the farmer's expected price. The final
                            amount depends on the quantity and agreed offer
                            price.
                        </p>

                        <Link
                            to={`/buyer/produce/${produce._id}/deal`}
                            className="mt-5 flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                        >
                            Make an Offer
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default BuyerProduceDetails;
