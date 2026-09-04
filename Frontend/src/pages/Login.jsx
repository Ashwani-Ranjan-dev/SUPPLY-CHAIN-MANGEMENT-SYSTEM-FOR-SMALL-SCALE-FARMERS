import { useState } from "react";
import { ArrowLeft, ShieldCheck, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import OtpInput from "../components/ui/otpinput";

import {
    sendOtp,
    verifyOtp,
} from "../services/authServices.js";

const Login = () => {
    const navigate = useNavigate();

    const [phone, setPhone] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [step, setStep] =
        useState("phone");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const handleSendOtp = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setMessage("");

        if (
            !/^[6-9]\d{9}$/.test(phone)
        ) {
            setError(
                "Enter a valid 10-digit Indian mobile number."
            );

            return;
        }

        setLoading(true);

        try {
            const response =
                await sendOtp(phone);

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

        if (otp.length !== 6) {
            setError(
                "Please enter the complete 6-digit OTP."
            );

            return;
        }

        setLoading(true);

        try {
            await verifyOtp(
                phone,
                otp
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
        <main className="
            min-h-screen
            bg-[#f7faf7]
            lg:p-6
        ">
            <div className="
                mx-auto
                flex
                min-h-screen
                max-w-[1500px]
                overflow-hidden
                bg-white
                shadow-xl
                lg:min-h-[calc(100vh-3rem)]
                lg:rounded-3xl
            ">
                <AuthBrandPanel />

                <section className="
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
                ">
                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <div className="
                            mb-12
                            flex
                            items-center
                            gap-3
                            lg:hidden
                        ">
                            <div className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-600
                            ">
                                <Sprout
                                    className="
                                        h-6
                                        w-6
                                        text-white
                                    "
                                />
                            </div>

                            <span className="
                                text-xl
                                font-bold
                                text-gray-900
                            ">
                                KrishiConnect
                            </span>
                        </div>

                        {step === "phone" ? (
                            <>
                                <div className="mb-8">
                                    <div className="
                                        mb-4
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-green-50
                                    ">
                                        <ShieldCheck
                                            className="
                                                h-6
                                                w-6
                                                text-green-600
                                            "
                                        />
                                    </div>

                                    <p className="
                                        mb-3
                                        text-sm
                                        font-semibold
                                        text-green-600
                                    ">
                                        SECURE LOGIN
                                    </p>

                                    <h1 className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-gray-900
                                    ">
                                        Welcome back
                                    </h1>

                                    <p className="
                                        mt-3
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    ">
                                        Sign in using your
                                        registered mobile
                                        number. No password
                                        required.
                                    </p>
                                </div>

                                <form
                                    onSubmit={
                                        handleSendOtp
                                    }
                                    className="space-y-6"
                                >
                                    <Input
                                        label="Mobile Number"
                                        name="phone"
                                        placeholder="9876543210"
                                        value={phone}
                                        onChange={(event) =>
                                            setPhone(
                                                event.target.value
                                                    .replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                    .slice(
                                                        0,
                                                        10
                                                    )
                                            )
                                        }
                                        required
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
                                        Send OTP
                                    </Button>

                                    <p className="
                                        text-center
                                        text-sm
                                        text-gray-500
                                    ">
                                        New to
                                        KrishiConnect?{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/register"
                                                )
                                            }
                                            className="
                                                font-semibold
                                                text-green-600
                                                hover:text-green-700
                                            "
                                        >
                                            Create account
                                        </button>
                                    </p>
                                </form>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep(
                                            "phone"
                                        );
                                        setOtp("");
                                        setError("");
                                    }}
                                    className="
                                        mb-8
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-gray-500
                                        transition
                                        hover:text-green-600
                                    "
                                >
                                    <ArrowLeft
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                    Change number
                                </button>

                                <div className="mb-8">
                                    <p className="
                                        mb-3
                                        text-sm
                                        font-semibold
                                        text-green-600
                                    ">
                                        VERIFY MOBILE
                                    </p>

                                    <h1 className="
                                        text-3xl
                                        font-bold
                                        tracking-tight
                                        text-gray-900
                                    ">
                                        Enter your OTP
                                    </h1>

                                    <p className="
                                        mt-3
                                        text-sm
                                        leading-6
                                        text-gray-500
                                    ">
                                        We sent a 6-digit
                                        verification code
                                        to
                                        <span className="
                                            ml-1
                                            font-semibold
                                            text-gray-800
                                        ">
                                            +91 {phone}
                                        </span>
                                    </p>
                                </div>

                                <form
                                    onSubmit={
                                        handleVerifyOtp
                                    }
                                    className="space-y-6"
                                >
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

                                    <Button
                                        type="submit"
                                        loading={
                                            loading
                                        }
                                    >
                                        Verify & Continue
                                    </Button>

                                    <p className="
                                        text-center
                                        text-sm
                                        text-gray-500
                                    ">
                                        Didn't receive
                                        the code?{" "}
                                        <button
                                            type="button"
                                            onClick={
                                                handleSendOtp
                                            }
                                            className="
                                                font-semibold
                                                text-green-600
                                                hover:text-green-700
                                            "
                                        >
                                            Resend OTP
                                        </button>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Login;