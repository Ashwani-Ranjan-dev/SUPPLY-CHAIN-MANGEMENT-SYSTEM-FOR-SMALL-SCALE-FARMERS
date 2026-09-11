const DashboardStatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
}) => {
    return (
        <div
            className="
                rounded-2xl
                border border-green-100
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-md
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <p
                        className="
                            text-sm
                            font-medium
                            text-gray-500
                        "
                    >
                        {title}
                    </p>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            text-gray-900
                        "
                    >
                        {value}
                    </p>

                    <p
                        className="
                            mt-1
                            text-xs
                            text-gray-500
                        "
                    >
                        {subtitle}
                    </p>
                </div>

                <div
                    className="
                        flex h-11 w-11
                        items-center justify-center
                        rounded-xl
                        bg-green-50
                        text-green-600
                    "
                >
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
};

export default DashboardStatCard;