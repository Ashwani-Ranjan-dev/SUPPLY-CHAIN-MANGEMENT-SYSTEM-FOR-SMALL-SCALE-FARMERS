import { useRef } from "react";

const OtpInput = ({
    value,
    onChange,
}) => {
    const inputsRef = useRef([]);

    // Always create 6 OTP input boxes
    const digits = Array.from(
        { length: 6 },
        (_, index) => value[index] || ""
    );

    const handleChange = (
        index,
        event
    ) => {
        const digit =
            event.target.value
                .replace(/\D/g, "")
                .slice(-1);

        const updated = [...digits];

        updated[index] = digit;

        const otp =
            updated.join("");

        onChange(otp);

        // Move to next input automatically
        if (
            digit &&
            index < 5
        ) {
            inputsRef.current[
                index + 1
            ]?.focus();
        }
    };

    const handleKeyDown = (
        index,
        event
    ) => {
        if (
            event.key === "Backspace" &&
            !digits[index] &&
            index > 0
        ) {
            inputsRef.current[
                index - 1
            ]?.focus();
        }
    };

    return (
        <div className="flex justify-between gap-2">
            {digits.map(
                (digit, index) => (
                    <input
                        key={index}
                        ref={(element) => {
                            inputsRef.current[
                                index
                            ] = element;
                        }}
                        type="text"
                        value={digit}
                        onChange={(event) =>
                            handleChange(
                                index,
                                event
                            )
                        }
                        onKeyDown={(event) =>
                            handleKeyDown(
                                index,
                                event
                            )
                        }
                        inputMode="numeric"
                        maxLength={1}
                        className="
                            h-12
                            w-12
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            text-center
                            text-lg
                            font-bold
                            outline-none
                            transition
                            focus:border-green-500
                            focus:ring-4
                            focus:ring-green-500/10
                            sm:h-14
                            sm:w-14
                        "
                    />
                )
            )}
        </div>
    );
};

export default OtpInput;