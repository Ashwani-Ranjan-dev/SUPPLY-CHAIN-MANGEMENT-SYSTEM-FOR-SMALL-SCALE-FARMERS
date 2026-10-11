
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    IndianRupee,
    Package,
    Sprout,
} from "lucide-react";

import {
    getMarketplaceProduceById,
    createBuyerDeal,
} from "../../services/buyerServices";

const CreateDeal = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [produce, setProduce] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [offeredPrice, setOfferedPrice] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchProduce = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMarketplaceProduceById(id);
            setProduce(data.produce);
            setOfferedPrice(String(data.produce.expectedPrice ?? ""));
        } catch (err) {
            setError(err.message || "Unable to load produce.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduce();
    }, [fetchProduce]);

    const numericQuantity = Number(quantity);
    const numericPrice = Number(offeredPrice);
    const estimatedTotal =
        numericQuantity > 0 && numericPrice > 0
            ? numericQuantity * numericPrice
            : 0;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!produce) {
            setError("Produce details are unavailable.");
            return;
        }

        if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
            setError("Enter a quantity greater than zero.");
            return;
        }

        if (numericQuantity > produce.quantity) {
            setError(
                `The maximum available quantity is ${produce.quantity} ${produce.unit}.`
            );
            return;
        }

        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            setError("Enter an offered price greater than zero.");
            return;
        }

        try {
            setSubmitting(true);

            await createBuyerDeal({
                produce: produce._id,
                quantity: numericQuantity,
                offeredPrice: numericPrice,
                message: message.trim(),
            });

            setSuccess("Your offer was submitted successfully.");

            setTimeout(() => {
                navigate("/buyer/deals");
            }, 1000);
        } catch (err) {
            setError(err.message || "Unable to submit your offer.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
            </div>
        );
    }

    if (!produce) {
        return (
            <div className="mx-auto max-w-3xl p-6">
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                    <AlertCircle className="mx-auto mb-3 text-red-500" size={36} />
                    <h1 className="text-xl font-bold text-gray-900">
                        Unable to create offer
                    </h1>
                    <p className="mt-2 text-gray-600">
                        {error || "This listing is unavailable."}
                    </p>
                    <Link
                        to="/buyer/produce"
                        className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        Back to marketplace
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
            <Link
                to={`/buyer/produce/${id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-green-700"
            >
                <ArrowLeft size={18} />
                Back to produce details
            </Link>

            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Make an Offer
                </h1>
                <p className="mt-2 text-gray-600">
                    Submit your proposed quantity and price to the farmer.
                </p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-5">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                        <Sprout className="text-green-700" size={26} />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                        {produce.crop}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Farmer: {produce.farmer?.name || "Farmer"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {produce.location || produce.farmer?.village || "Location not specified"}
                    </p>

                    <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <Package size={17} />
                                Available
                            </span>
                            <span className="font-semibold text-gray-900">
                                {produce.quantity} {produce.unit}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <IndianRupee size={17} />
                                Expected price
                            </span>
                            <span className="font-semibold text-gray-900">
                                ₹{Number(produce.expectedPrice).toLocaleString("en-IN")}
                                {" / "}{produce.unit}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-3 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="flex gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                <CheckCircle2 size={18} className="shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="quantity"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Quantity ({produce.unit})
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="0.1"
                                max={produce.quantity}
                                step="any"
                                required
                                value={quantity}
                                onChange={(event) => setQuantity(event.target.value)}
                                placeholder={`Maximum ${produce.quantity} ${produce.unit}`}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Available: {produce.quantity} {produce.unit}
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="offeredPrice"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Your offered price (₹ per {produce.unit})
                            </label>
                            <input
                                id="offeredPrice"
                                type="number"
                                min="0.01"
                                step="0.01"
                                required
                                value={offeredPrice}
                                onChange={(event) => setOfferedPrice(event.target.value)}
                                placeholder="Enter your price per unit"
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Message to farmer (optional)
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                maxLength={500}
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Add delivery requirements or negotiation details..."
                                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                            <p className="mt-1 text-right text-xs text-gray-400">
                                {message.length}/500
                            </p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-4">
                            <p className="text-sm text-green-800">
                                Estimated total amount
                            </p>
                            <p className="mt-1 text-2xl font-bold text-green-800">
                                ₹{estimatedTotal.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                            <p className="mt-1 text-xs text-green-700">
                                Final deal terms are subject to the farmer's acceptance.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || Boolean(success)}
                            className="w-full rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting
                                ? "Submitting offer..."
                                : success
                                  ? "Offer submitted"
                                  : "Submit Offer"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default CreateDeal;
