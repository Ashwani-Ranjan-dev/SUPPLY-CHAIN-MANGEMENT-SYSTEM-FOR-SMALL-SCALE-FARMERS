import { useState } from "react";
import { Sprout, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import OtpInput from "../components/ui/otpinput";

import {
    sendOtp,
    verifyOtp,
} from "../services/authServices.js";

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] =
        useState("details");

    const [formData, setFormData] =
        useState({
            name: "",
            phone: "",
            role: "FARMER",
            village: "",
            produceInterest: "",
            farmerType: "",
        });

    const [otp, setOtp] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleRoleChange = (role) => {
        setFormData((previous) => ({
            ...previous,
            role,
            farmerType:
                role === "FARMER"
                    ? previous.farmerType
                    : "",
            produceInterest:
                role === "FARMER"
                    ? previous.produceInterest
                    : "",
        }));
    };

    const validateForm = () => {
        if (
            !formData.name.trim()
        ) {
            return "Please enter your full name.";
        }

        if (
            !/^[6-9]\d{9}$/.test(
                formData.phone
            )
        ) {
            return "Enter a valid 10-digit Indian mobile number.";
        }

        if (
            !formData.village.trim()
        ) {
            return "Please enter your village or location.";
        }

        if (
            formData.role === "FARMER" &&
            !formData.farmerType
        ) {
            return "Please select your farmer type.";
        }

        return "";
    };

    const handleSendOtp = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setMessage("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(
                validationError
            );

            return;
        }

        setLoading(true);

        try {
            const response =
                await sendOtp(
                    formData.phone
                );

            setMessage(
                response.message
            );

            setStep("otp");
        } catch (error) {
            setError(
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (otp.length !== 6) {
            setError(
                "Please enter the complete 6-digit OTP."
            );

            return;
        }

        setLoading(true);

        try {
            await verifyOtp(
                formData.phone,
                otp,
                {
                    name: formData.name,
                    role: formData.role,
                    village:
                        formData.village,
                    produceInterest:
                        formData.produceInterest,
                    farmerType:
                        formData.farmerType,
                }
            );

            navigate("/dashboard");
        } catch (error) {
            setError(
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="
                min-h-screen
                bg-[#f7faf7]
                lg:p-6
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    min-h-screen
                    max-w-[1500px]
                    overflow-hidden
                    bg-white
                    shadow-xl
                    lg:min-h-[calc(100vh-3rem)]
                    lg:rounded-3xl
                "
            >
                <AuthBrandPanel />

                <section
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        px-5
                        py-10
                        sm:px-8
                        lg:w-[52%]
                        xl:w-1/2
                        xl:px-16
                    "
                >
                    <div
                        className="
                            w-full
                            max-w-md
                        "
                    >
                        {/* Mobile Branding */}
                        <div
                            className="
                                mb-10
                                flex
                                items-center
                                gap-3
                                lg:hidden
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-green-600
                                "
                            >
                                <Sprout
                                    className="
                                        h-6
                                        w-6
                                        text-white
                                    "
                                />
                            </div>

                            <span
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                "
                            >
                                KrishiConnect
                            </span>
                        </div>

                        {step === "details" ? (
                            <form
                                onSubmit={
                                    handleSendOtp
                                }
                                className="
                                    space-y-5
                                "
                            >
                                <div
                                    className="
                                        mb-8
                                    "
                                >
                                    <div
                                        className="
                                            mb-4
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-green-50
                                        "
                                    >
                                        <UserRound
                                            className="
                                                h-6
                                                w-6
                                                text-green-600
                                            "
                                        />
                                    </div>

                                    <p
                                        className="
                                            mb-2
                                            text-sm
                                            font-semibold
                                            text-green-600
                                        "
                                    >
                                        JOIN KRISHICONNECT
                                    </p>

                                    <h1
                                        className="
                                            text-3xl
                                            font-bold
                                            tracking-tight
                                            text-gray-900
                                        "
                                    >
                                        Create your account
                                    </h1>

                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            leading-6
                                            text-gray-500
                                        "
                                    >
                                        Tell us a little
                                        about yourself to
                                        get started.
                                    </p>
                                </div>

                                <Input
                                    label="Full Name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                <Input
                                    label="Mobile Number"
                                    name="phone"
                                    placeholder="9876543210"
                                    value={
                                        formData.phone
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        const value =
                                            event.target.value
                                                .replace(
                                                    /\D/g,
                                                    ""
                                                )
                                                .slice(
                                                    0,
                                                    10
                                                );

                                        setFormData(
                                            (
                                                previous
                                            ) => ({
                                                ...previous,
                                                phone: value,
                                            })
                                        );
                                    }}
                                    required
                                />

                                {/* Role */}
                                <div
                                    className="
                                        space-y-2
                                    "
                                >
                                    <label
                                        className="
                                            block
                                            text-sm
                                            font-medium
                                            text-gray-700
                                        "
                                    >
                                        I am joining as
                                    </label>

                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-3
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange(
                                                    "FARMER"
                                                )
                                            }
                                            className={`
                                                rounded-xl
                                                border
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                transition
                                                ${
                                                    formData.role ===
                                                    "FARMER"
                                                        ? "border-green-500 bg-green-50 text-green-700"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                                                }
                                            `}
                                        >
                                            🌾 Farmer
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange(
                                                    "BUYER"
                                                )
                                            }
                                            className={`
                                                rounded-xl
                                                border
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                transition
                                                ${
                                                    formData.role ===
                                                    "BUYER"
                                                        ? "border-green-500 bg-green-50 text-green-700"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                                                }
                                            `}
                                        >
                                            🛒 Buyer
                                        </button>
                                    </div>
                                </div>

                                <Input
                                    label="Village / Location"
                                    name="village"
                                    placeholder="Enter your village or location"
                                    value={
                                        formData.village
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                                {formData.role ===
                                    "FARMER" && (
                                    <>
                                        <Select
                                            label="Farmer Type"
                                            name="farmerType"
                                            value={
                                                formData.farmerType
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Select farmer type"
                                            required
                                            options={[
                                                {
                                                    value: "SMALL",
                                                    label: "Small / Marginal Farmer",
                                                },
                                                {
                                                    value: "LARGE",
                                                    label: "Large Farmer / FPO",
                                                },
                                            ]}
                                        />

                                        <Input
                                            label="Produce Interest"
                                            name="produceInterest"
                                            placeholder="e.g. Onion, Wheat, Rice"
                                            value={
                                                formData.produceInterest
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </>
                                )}

                                {error && (
                                    <Alert
                                        type="error"
                                        message={
                                            error
                                        }
                                    />
                                )}

                                <Button
                                    type="submit"
                                    loading={
                                        loading
                                    }
                                >
                                    Continue with OTP
                                </Button>

                                <p
                                    className="
                                        text-center
                                        text-sm
                                        text-gray-500
                                    "
                                >
                                    Already have an
                                    account?{" "}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/login"
                                            )
                                        }
                                        className="
                                            font-semibold
                                            text-green-600
                                            hover:text-green-700
                                        "
                                    >
                                        Login
                                    </button>
                                </p>
                            </form>
                        ) : (
                            <form
                                onSubmit={
                                    handleVerifyOtp
                                }
                                className="
                                    space-y-6
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(
                                            "details"
                                        );
                                        setOtp("");
                                        setError("");
                                        setMessage("");
                                    }}
                                    className="
                                        mb-3
                                        text-sm
                                        font-medium
                                        text-gray-500
                                        hover:text-green-600
                                    "
                                >
                                    ← Edit details
                                </button>

                                <div
                                    className="
                                        mb-8
                                    "
                                >
                                    <p
                                        className="
                                            mb-2
                                            text-sm
                                            font-semibold
                                            text-green-600
                                        "
                                    >
                                        VERIFY MOBILE
                                    </p>

                                    <h1
                                        className="
                                            text-3xl
                                            font-bold
                                            text-gray-900
                                        "
                                    >
                                        Verify your number
                                    </h1>

                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            leading-6
                                            text-gray-500
                                        "
                                    >
                                        Enter the 6-digit
                                        OTP sent to{" "}
                                        <span
                                            className="
                                                font-semibold
                                                text-gray-800
                                            "
                                        >
                                            +91{" "}
                                            {
                                                formData.phone
                                            }
                                        </span>
                                    </p>
                                </div>

                                <OtpInput
                                    value={otp}
                                    onChange={
                                        setOtp
                                    }
                                />

                                {error && (
                                    <Alert
                                        type="error"
                                        message={
                                            error
                                        }
                                    />
                                )}

                                {message && (
                                    <Alert
                                        type="success"
                                        message={
                                            message
                                        }
                                    />
                                )}

                                <Button
                                    type="submit"
                                    loading={
                                        loading
                                    }
                                >
                                    Verify & Create Account
                                </Button>

                                <button
                                    type="button"
                                    onClick={
                                        handleSendOtp
                                    }
                                    className="
                                        w-full
                                        text-center
                                        text-sm
                                        font-semibold
                                        text-green-600
                                        hover:text-green-700
                                    "
                                >
                                    Resend OTP
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Register;