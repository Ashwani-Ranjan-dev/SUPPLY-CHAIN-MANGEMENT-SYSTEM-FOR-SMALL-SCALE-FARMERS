const Button = ({
    children,
    type = "button",
    disabled = false,
    loading = false,
    className = "",
    onClick,
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`
                w-full
                rounded-xl
                bg-green-600
                px-5
                py-3.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-green-700
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-green-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60
                ${className}
            `}
        >
            {loading ? "Creating account..." : children}
        </button>
    );
};

export default Button;