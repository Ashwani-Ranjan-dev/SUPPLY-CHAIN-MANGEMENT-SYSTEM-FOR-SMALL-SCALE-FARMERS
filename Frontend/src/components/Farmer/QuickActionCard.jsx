const QuickActionCard = ({
    title,
    description,
    icon: Icon,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className="
                flex
                w-full
                items-center
                gap-4
                rounded-2xl
                border border-green-100
                bg-white
                p-4
                text-left
                transition
                hover:-translate-y-0.5
                hover:border-green-200
                hover:shadow-md
            "
        >
            <div
                className="
                    flex h-11 w-11
                    shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-green-50
                    text-green-600
                "
            >
                <Icon size={21} />
            </div>

            <div>
                <p
                    className="
                        font-semibold
                        text-gray-900
                    "
                >
                    {title}
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-gray-500
                    "
                >
                    {description}
                </p>
            </div>
        </button>
    );
};

export default QuickActionCard;