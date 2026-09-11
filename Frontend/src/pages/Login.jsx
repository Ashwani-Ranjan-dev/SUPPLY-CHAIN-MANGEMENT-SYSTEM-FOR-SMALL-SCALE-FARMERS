import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Leaf, ShieldCheck } from "lucide-react";

import {
    sendLoginOtp,
    verifyLoginOtp,
} from "../services/authServices.js";

import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [step, setStep] = useState("phone");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // --------------------------------
    // Send Login OTP
    // --------------------------------
    const handleSendOtp = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!/^[6-9]\d{9}$/.test(phone)) {
            setError(
                "Please enter a valid 10-digit Indian mobile number."
            );
            return;
        }

        try {
            setLoading(true);

            const data = await sendLoginOtp(phone);

            setSuccess(
                data.message ||
                    "OTP sent successfully."
            );

            setStep("otp");
        } catch (error) {
            setError(
                error.message ||
                    "Unable to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // Verify Login OTP
    // --------------------------------
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            await verifyLoginOtp(phone, otp);

            // Restore authenticated user
            await checkAuth();

            setSuccess("Login successful. Redirecting...");

            setTimeout(() => {
                navigate("/dashboard", {
                    replace: true,
                });
            }, 500);
        } catch (error) {
            setError(
                error.message ||
                    "Unable to verify OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    // --------------------------------
    // Change phone number
    // --------------------------------
    const handleChangeNumber = () => {
        setStep("phone");
        setOtp("");
        setError("");
        setSuccess("");
    };

    return (
        <div className="min-h-screen bg-[#f5faf5]">
            <div className="grid min-h-screen lg:grid-cols-2">

                {/* =========================
                    LEFT BRAND PANEL
                ========================= */}
                <section className="relative hidden overflow-hidden bg-green-700 lg:flex">
                    
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_35%)]" />

                    <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

                        {/* Logo */}
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                    <Leaf className="h-6 w-6 text-white" />
                                </div>

                                <div>
                                    <p className="text-lg font-bold tracking-wide text-white">
                                        KRISHICONNECT
                                    </p>

                                    <p className="text-xs text-green-100">
                                        Farmer to Market
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="max-w-xl">

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-green-50 backdrop-blur">
                                <ShieldCheck className="h-4 w-4" />
                                Secure OTP Login
                            </div>

                            <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                                Welcome back to
                                <span className="block text-green-100">
                                    KrishiConnect
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-lg leading-8 text-green-50">
                                Connect with the agricultural
                                marketplace, discover better
                                opportunities, and manage your
                                trade from one simple platform.
                            </p>

                            <div className="mt-10 grid grid-cols-3 gap-4">

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-2xl font-bold text-white">
                                        01
                                    </p>
                                    <p className="mt-1 text-sm text-green-100">
                                        Secure
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-2xl font-bold text-white">
                                        02
                                    </p>
                                    <p className="mt-1 text-sm text-green-100">
                                        Simple
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-2xl font-bold text-white">
                                        03
                                    </p>
                                    <p className="mt-1 text-sm text-green-100">
                                        Trusted
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Bottom */}
                        <p className="text-sm text-green-100">
                            © {new Date().getFullYear()} KrishiConnect
                        </p>

                    </div>
                </section>

                {/* =========================
                    RIGHT LOGIN PANEL
                ========================= */}
                <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
                                <Leaf className="h-6 w-6 text-green-700" />
                            </div>

                            <div>
                                <p className="font-bold text-gray-900">
                                    KRISHICONNECT
                                </p>

                                <p className="text-xs text-gray-500">
                                    Farmer to Market
                                </p>
                            </div>
                        </div>

                        {/* Card */}
                        <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:p-9">

                            {step === "phone" ? (
                                <>
                                    {/* Header */}
                                    <div>
                                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                                            <ShieldCheck className="h-6 w-6 text-green-600" />
                                        </div>

                                        <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                                            Secure Login
                                        </p>

                                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                            Welcome back
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                            Enter your registered mobile
                                            number to continue.
                                        </p>
                                    </div>

                                    {/* Alert */}
                                    {error && (
                                        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                                            {success}
                                        </div>
                                    )}

                                    {/* Form */}
                                    <form
                                        onSubmit={handleSendOtp}
                                        className="mt-7 space-y-5"
                                    >

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Mobile Number
                                            </label>

                                            <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">

                                                <div className="flex items-center border-r border-gray-200 px-4 text-sm font-semibold text-gray-600">
                                                    +91
                                                </div>

                                                <input
                                                    type="tel"
                                                    inputMode="numeric"
                                                    maxLength={10}
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setPhone(
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                        )
                                                    }
                                                    placeholder="Enter mobile number"
                                                    className="w-full bg-transparent px-4 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loading
                                                ? "Sending OTP..."
                                                : "Send OTP"}

                                            {!loading && (
                                                <ArrowRight className="h-4 w-4" />
                                            )}
                                        </button>

                                    </form>

                                    {/* Register */}
                                    <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                                        <p className="text-sm text-gray-500">
                                            Don't have an account?{" "}
                                            <Link
                                                to="/register"
                                                className="font-semibold text-green-600 hover:text-green-700"
                                            >
                                                Create account
                                            </Link>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* OTP Header */}
                                    <button
                                        type="button"
                                        onClick={handleChangeNumber}
                                        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Change number
                                    </button>

                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                                            Verify OTP
                                        </p>

                                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                            Enter your OTP
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                            We've sent a 6-digit verification
                                            code to
                                            <span className="ml-1 font-semibold text-gray-800">
                                                +91 {phone}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Alert */}
                                    {error && (
                                        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                                            {success}
                                        </div>
                                    )}

                                    {/* OTP Form */}
                                    <form
                                        onSubmit={handleVerifyOtp}
                                        className="mt-7"
                                    >
                                        <label className="mb-3 block text-sm font-semibold text-gray-700">
                                            Verification Code
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            placeholder="Enter 6-digit OTP"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center text-xl font-bold tracking-[0.5em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                        />

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {loading
                                                ? "Verifying..."
                                                : "Verify & Login"}

                                            {!loading && (
                                                <ArrowRight className="h-4 w-4" />
                                            )}
                                        </button>
                                    </form>

                                    {/* Development note */}
                                    <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3">
                                        <p className="text-xs leading-5 text-amber-700">
                                            <strong>Development mode:</strong>{" "}
                                            Check your backend terminal
                                            for the OTP.
                                        </p>
                                    </div>

                                </>
                            )}

                        </div>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default Login;