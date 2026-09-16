import {
    ArrowDown,
    ArrowUp,
    MapPin,
} from "lucide-react";

const MarketPriceListCard = ({
    price,
}) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between gap-4">

                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {price.crop}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={14} />

                        {price.market}
                    </div>
                </div>

                <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    {price.unit}
                </span>
            </div>

            <div className="mt-5 rounded-xl bg-green-50 p-4">

                <p className="text-xs font-medium text-gray-500">
                    Modal Price
                </p>

                <p className="mt-1 text-2xl font-bold text-green-700">
                    ₹
                    {price.modalPrice.toLocaleString(
                        "en-IN"
                    )}
                </p>

                <p className="text-xs text-gray-500">
                    per {price.unit.toLowerCase()}
                </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <ArrowDown
                            size={13}
                        />
                        Min
                    </div>

                    <p className="mt-1 font-bold text-gray-800">
                        ₹
                        {price.minPrice.toLocaleString(
                            "en-IN"
                        )}
                    </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                        <ArrowUp
                            size={13}
                        />
                        Max
                    </div>

                    <p className="mt-1 font-bold text-gray-800">
                        ₹
                        {price.maxPrice.toLocaleString(
                            "en-IN"
                        )}
                    </p>
                </div>

            </div>

            <p className="mt-4 text-xs text-gray-400">
                Updated{" "}
                {new Date(
                    price.updatedAt
                ).toLocaleDateString(
                    "en-IN"
                )}
            </p>
        </div>
    );
};

export default MarketPriceListCard;