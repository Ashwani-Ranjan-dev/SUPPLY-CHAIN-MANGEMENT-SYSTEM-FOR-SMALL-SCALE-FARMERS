import {
    Check,
    X,
    User,
    Package,
    IndianRupee,
    MapPin,
    Clock,
} from "lucide-react";

const FarmerDealCard = ({
    deal,
    onAccept,
    onReject,
    actionLoading,
}) => {
    const statusStyles = {
        PENDING:
            "bg-amber-50 text-amber-700 border-amber-200",

        ACCEPTED:
            "bg-green-50 text-green-700 border-green-200",

        REJECTED:
            "bg-red-50 text-red-700 border-red-200",

        CANCELLED:
            "bg-gray-100 text-gray-600 border-gray-200",

        COMPLETED:
            "bg-blue-50 text-blue-700 border-blue-200",
    };

    const buyer = deal.buyer;
    const produce = deal.produce;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <Package size={21} />
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900">
                            {produce?.crop || "Produce"}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Deal #{deal._id.slice(-6)}
                        </p>
                    </div>

                </div>

                <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        statusStyles[
                            deal.status
                        ] || statusStyles.PENDING
                    }`}
                >
                    {deal.status}
                </span>

            </div>


            {/* Buyer */}
            <div className="mt-5 rounded-xl bg-gray-50 p-4">

                <div className="flex items-center gap-2">
                    <User
                        size={17}
                        className="text-green-600"
                    />

                    <span className="text-sm font-semibold text-gray-800">
                        Buyer
                    </span>
                </div>

                <p className="mt-2 font-semibold text-gray-900">
                    {buyer?.name || "Buyer"}
                </p>

                <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">

                    {buyer?.village && (
                        <span className="flex items-center gap-1">
                            <MapPin size={13} />
                            {buyer.village}
                        </span>
                    )}

                    {buyer?.phone && (
                        <span>
                            {buyer.phone}
                        </span>
                    )}

                </div>

            </div>


            {/* Deal information */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">
                        Quantity
                    </p>

                    <p className="mt-1 font-bold text-gray-900">
                        {deal.quantity}{" "}
                        {deal.unit}
                    </p>
                </div>


                <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">
                        Offered Price
                    </p>

                    <p className="mt-1 flex items-center font-bold text-gray-900">
                        <IndianRupee size={14} />
                        {deal.offeredPrice}
                    </p>
                </div>


                <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">
                        Total Value
                    </p>

                    <p className="mt-1 flex items-center font-bold text-green-700">
                        <IndianRupee size={14} />
                        {deal.totalAmount}
                    </p>
                </div>


                <div className="rounded-xl border border-gray-100 p-3">
                    <p className="text-xs text-gray-500">
                        Requested
                    </p>

                    <p className="mt-1 flex items-center gap-1 font-semibold text-gray-700">
                        <Clock size={14} />
                        {new Date(
                            deal.createdAt
                        ).toLocaleDateString()}
                    </p>
                </div>

            </div>


            {/* Message */}
            {deal.message && (
                <div className="mt-4 rounded-xl border border-green-100 bg-green-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                        Buyer Message
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-700">
                        {deal.message}
                    </p>
                </div>
            )}


            {/* Actions */}
            {deal.status === "PENDING" && (
                <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">

                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                            onReject(deal._id)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={17} />

                        {actionLoading
                            ? "Processing..."
                            : "Reject"}
                    </button>


                    <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                            onAccept(deal._id)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Check size={17} />

                        {actionLoading
                            ? "Processing..."
                            : "Accept"}
                    </button>

                </div>
            )}

        </div>
    );
};

export default FarmerDealCard;