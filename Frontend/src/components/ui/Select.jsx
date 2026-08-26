const Select = ({
    label,
    name,
    value,
    onChange,
    children,
    error,
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                className={`
                    w-full
                    rounded-xl
                    border
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:ring-4
                    ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-500/10"
                    }
                `}
            >
                {children}
            </select>

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;