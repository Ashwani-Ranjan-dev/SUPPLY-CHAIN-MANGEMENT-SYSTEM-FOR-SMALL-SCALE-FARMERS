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
    CheckCircle2,
    X,
} from "lucide-react";

import {
    getOpenPooledLots,
    getPooledLotById,
    generatePooledLots,
} from "../../services/PoolingServices.js";
import { createPooledDeal } from "../../services/pooledDealServices.js";

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
    const [windowDays, setWindowDays] = useState("3");
    const [generating, setGenerating] = useState(false);
    const [generateMessage, setGenerateMessage] = useState("");
    const [generateError, setGenerateError] = useState("");
    const [offerLotId, setOfferLotId] = useState(null);
    const [offerPrice, setOfferPrice] = useState("");
    const [offerMessage, setOfferMessage] = useState("");
    const [submittingOffer, setSubmittingOffer] = useState(false);
    const [offerNotice, setOfferNotice] = useState("");
    const [offerError, setOfferError] = useState("");

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

    const handleGenerateLots = async () => {
        try {
            setGenerating(true);
            setGenerateError("");
            setGenerateMessage("");

            const result = await generatePooledLots(Number(windowDays));
            setGenerateMessage(
                result.message ||
                `Pooled lot generation completed. ${result.count ?? result.data?.length ?? ""}`.trim()
            );
            await fetchLots();
        } catch (err) {
            setGenerateError(err.message || "Unable to generate pooled lots.");
        } finally {
            setGenerating(false);
        }
    };

    const openOfferForm = (lotId) => {
        setOfferLotId(lotId);
        setOfferPrice("");
        setOfferMessage("");
        setOfferNotice("");
        setOfferError("");
    };

    const handleCreateOffer = async (lot) => {
        const price = Number(offerPrice);

        if (!Number.isFinite(price) || price <= 0) {
            setOfferError("Enter an offer price greater than zero.");
            return;
        }

        if (offerMessage.length > 500) {
            setOfferError("Message must be 500 characters or fewer.");
            return;
        }

        try {
            setSubmittingOffer(true);
            setOfferError("");
            setOfferNotice("");

            const result = await createPooledDeal(
                lot._id,
                price,
                offerMessage.trim()
            );

            setOfferNotice(
                result.message || "Your pooled offer was submitted successfully."
            );
            setOfferLotId(null);
            setOfferPrice("");
            setOfferMessage("");
        } catch (err) {
            setOfferError(err.message || "Unable to submit pooled offer.");
        } finally {
            setSubmittingOffer(false);
        }
    };

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
                            Explore combined produce lots from multiple farmers and discover larger
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

                {/* Generate pooled lots */}
                <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-lg font-bold text-gray-900">
                                Generate Eligible Lots
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Find compatible active farmer listings and group them into pooled lots based on crop, unit, location, quality, and availability.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                Availability window
                                <select
                                    value={windowDays}
                                    onChange={(event) => setWindowDays(event.target.value)}
                                    disabled={generating}
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                >
                                    <option value="1">1 day</option>
                                    <option value="3">3 days</option>
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="30">30 days</option>
                                </select>
                            </label>
                            <button
                                type="button"
                                onClick={handleGenerateLots}
                                disabled={generating}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Sprout size={17} className={generating ? "animate-pulse" : ""} />
                                {generating ? "Generating..." : "Generate Lots"}
                            </button>
                        </div>
                    </div>
                    {generateMessage && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                            <p>{generateMessage}</p>
                        </div>
                    )}
                    {generateError && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <p>{generateError}</p>
                        </div>
                    )}
                </section>

                {offerNotice && (
                    <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                        <p>{offerNotice}</p>
                    </div>
                )}
                {offerError && !offerLotId && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle size={19} className="mt-0.5 shrink-0" />
                        <p>{offerError}</p>
                    </div>
                )}

                {/* Summary */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Available pooled lots</p>
                            <Package className="text-green-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">{lots.length}</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Contributing farmers</p>
                            <Users className="text-green-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {new Set(
                                lots.flatMap((lot) =>
                                    (lot.listings || []).map(
                                        (item) => item.farmer?._id || item.farmer
                                    )
                                )
                            ).size}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">Active status</p>
                            <CheckCircle2 className="text-green-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold text-gray-900">
                            {loading ? "Loading..." : "Active"}
                        </p>
                    </div>
                </div>

                {/* Lots Grid */}
                {!loading && lots.length > 0 && (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {lots.map((lot) => {
                            const isExpanded = expandedLotId === lot._id;
                            const isMakingOffer = offerLotId === lot._id;

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
                                                    {formatQuantity(lot.totalQuantity, lot.unit)}
                                                </p>
                                            </div>

                                            <div className="rounded-xl bg-gray-50 p-4">
                                                <p className="text-xs font-medium text-gray-500">
                                                    Farmers
                                                </p>
                                                <p className="mt-1 text-lg font-bold text-gray-900">
                                                    {new Set(
                                                        (lot.listings || []).map(
                                                            (item) => item.farmer?._id || item.farmer
                                                        )
                                                    ).size}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-start gap-2 text-sm text-gray-500">
                                            <CalendarDays size={17} className="mt-0.5 shrink-0" />
                                            <span>
                                                Available {formatDate(lot.earliestAvailableFrom)} – {formatDate(lot.latestAvailableFrom)}
                                            </span>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="mt-5 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => isMakingOffer ? setOfferLotId(null) : openOfferForm(lot._id)}
                                                className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                                            >
                                                {isMakingOffer ? "Cancel Offer" : "Make Offer"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleLotDetails(lot._id)}
                                                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                {isExpanded ? (
                                                    <>
                                                        Hide Details <ChevronUp size={16} />
                                                    </>
                                                ) : (
                                                    <>
                                                        View Details <ChevronDown size={16} />
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Offer Form */}
                                        {isMakingOffer && (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleCreateOffer(lot);
                                                }}
                                                className="mt-4 space-y-4 rounded-xl border border-green-100 bg-green-50/50 p-4"
                                            >
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        Offer for {lot.crop}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Available quantity: {formatQuantity(lot.totalQuantity, lot.unit)}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`offer-price-${lot._id}`}
                                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                                    >
                                                        Your offer price per {lot.unit} (₹)
                                                    </label>
                                                    <input
                                                        id={`offer-price-${lot._id}`}
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        required
                                                        value={offerPrice}
                                                        onChange={(event) => setOfferPrice(event.target.value)}
                                                        placeholder="Enter price per unit"
                                                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`offer-message-${lot._id}`}
                                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                                    >
                                                        Message to farmers (optional)
                                                    </label>
                                                    <textarea
                                                        id={`offer-message-${lot._id}`}
                                                        rows={3}
                                                        maxLength={500}
                                                        value={offerMessage}
                                                        onChange={(event) => setOfferMessage(event.target.value)}
                                                        placeholder="Add delivery or negotiation details..."
                                                        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                                    />
                                                    <p className="mt-1 text-right text-xs text-gray-400">
                                                        {offerMessage.length}/500
                                                    </p>
                                                </div>

                                                <div className="rounded-lg bg-white p-3">
                                                    <p className="text-xs text-gray-500">Estimated total offer</p>
                                                    <p className="mt-1 text-xl font-bold text-green-700">
                                                        ₹{(
                                                            Number(lot.totalQuantity || 0) *
                                                            Math.max(0, Number(offerPrice) || 0)
                                                        ).toLocaleString("en-IN", {
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400">
                                                        Based on the full pooled quantity. Final acceptance depends on all contributing farmers.
                                                    </p>
                                                </div>

                                                {offerError && (
                                                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                                                        <p>{offerError}</p>
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={submittingOffer}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {submittingOffer ? "Submitting offer..." : "Submit Pooled Offer"}
                                                </button>
                                            </form>
                                        )}

                                        {/* Expanded Details */}
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

                                                {selectedLot?._id === lot._id && (
                                                    <>
                                                        <h3 className="font-semibold text-gray-900">
                                                            Contributing listings
                                                        </h3>

                                                        <div className="mt-3 space-y-3">
                                                            {(selectedLot.listings || []).map((listing, index) => (
                                                                <div
                                                                    key={listing.produce?._id || index}
                                                                    className="rounded-xl border border-gray-200 p-4"
                                                                >
                                                                    <div className="flex items-start justify-between gap-3">
                                                                        <div>
                                                                            <p className="font-semibold text-gray-900">
                                                                                {listing.farmer?.name || "Farmer"}
                                                                            </p>
                                                                            <p className="mt-1 text-sm text-gray-500">
                                                                                {listing.farmer?.village || selectedLot.location}
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
                                                                        <IndianRupee size={15} />
                                                                        {Number(
                                                                            listing.expectedPrice || 0
                                                                        ).toLocaleString("en-IN")}{" "}
                                                                        per {selectedLot.unit}
                                                                    </div>
                                                                </div>
                                                            ))}
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