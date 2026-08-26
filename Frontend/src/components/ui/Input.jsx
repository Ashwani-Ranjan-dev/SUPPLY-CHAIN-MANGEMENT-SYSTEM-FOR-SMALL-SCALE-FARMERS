const Input = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
    error,
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
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
                    placeholder:text-gray-400
                    focus:ring-4
                    ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                            : "border-gray-200 focus:border-green-500 focus:ring-green-500/10"
                    }
                `}
            />

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;