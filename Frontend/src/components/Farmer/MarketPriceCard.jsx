import {
    TrendingUp,
} from "lucide-react";

const MarketPriceCard = ({
    crop,
    price,
    unit,
    change,
}) => {
    return (
        <div
            className="
                flex items-center
                justify-between
                rounded-xl
                border border-gray-100
                bg-gray-50
                p-4
            "
        >
            <div>
                <p
                    className="
                        font-semibold
                        text-gray-900
                    "
                >
                    {crop}
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-gray-500
                    "
                >
                    Current market price
                </p>
            </div>

            <div className="text-right">
                <p
                    className="
                        font-bold
                        text-gray-900
                    "
                >
                    ₹{price}
                </p>

                <div
                    className="
                        mt-1
                        flex items-center
                        justify-end gap-1
                        text-xs
                        font-medium
                        text-green-600
                    "
                >
                    <TrendingUp size={13} />

                    {change}

                    <span className="text-gray-400">
                        / {unit}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MarketPriceCard;