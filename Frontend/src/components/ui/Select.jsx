const Select = ({
    label,
    name,
    value,
    onChange,
    options,
    placeholder,
    required = false,
}) => {
    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                "
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    text-sm
                    text-gray-800
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-4
                    focus:ring-green-500/10
                "
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;