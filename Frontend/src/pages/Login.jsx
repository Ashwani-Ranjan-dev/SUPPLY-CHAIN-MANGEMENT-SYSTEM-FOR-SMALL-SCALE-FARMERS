// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowLeft, ArrowRight, Leaf, ShieldCheck } from "lucide-react";

// import {
//     sendLoginOtp,
//     verifyLoginOtp,
// } from "../services/authServices.js";

// import { useAuth } from "../context/AuthContext.jsx";

// const Login = () => {
//     const navigate = useNavigate();
//     const { checkAuth } = useAuth();

//     const [phone, setPhone] = useState("");
//     const [otp, setOtp] = useState("");

//     const [step, setStep] = useState("phone");

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     // --------------------------------
//     // Send Login OTP
//     // --------------------------------
//     const handleSendOtp = async (e) => {
//         e.preventDefault();

//         setError("");
//         setSuccess("");

//         if (!/^[6-9]\d{9}$/.test(phone)) {
//             setError(
//                 "Please enter a valid 10-digit Indian mobile number."
//             );
//             return;
//         }

//         try {
//             setLoading(true);

//             const data = await sendLoginOtp(phone);

//             setSuccess(
//                 data.message ||
//                     "OTP sent successfully."
//             );

//             setStep("otp");
//         } catch (error) {
//             setError(
//                 error.message ||
//                     "Unable to send OTP."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --------------------------------
//     // Verify Login OTP
//     // --------------------------------
//     const handleVerifyOtp = async (e) => {
//         e.preventDefault();

//         setError("");
//         setSuccess("");

//         if (otp.length !== 6) {
//             setError("Please enter the 6-digit OTP.");
//             return;
//         }

//         try {
//             setLoading(true);

//             await verifyLoginOtp(phone, otp);

//             // Restore authenticated user
//             await checkAuth();

//             setSuccess("Login successful. Redirecting...");

//             setTimeout(() => {
//                 navigate("/dashboard", {
//                     replace: true,
//                 });
//             }, 500);
//         } catch (error) {
//             setError(
//                 error.message ||
//                     "Unable to verify OTP."
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --------------------------------
//     // Change phone number
//     // --------------------------------
//     const handleChangeNumber = () => {
//         setStep("phone");
//         setOtp("");
//         setError("");
//         setSuccess("");
//     };

//     return (
//         <div className="min-h-screen bg-[#f5faf5]">
//             <div className="grid min-h-screen lg:grid-cols-2">

//                 {/* =========================
//                     LEFT BRAND PANEL
//                 ========================= */}
//                 <section className="relative hidden overflow-hidden bg-green-700 lg:flex">
                    
//                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_35%)]" />

//                     <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

//                         {/* Logo */}
//                         <div>
//                             <div className="flex items-center gap-3">
//                                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
//                                     <Leaf className="h-6 w-6 text-white" />
//                                 </div>

//                                 <div>
//                                     <p className="text-lg font-bold tracking-wide text-white">
//                                         KRISHICONNECT
//                                     </p>

//                                     <p className="text-xs text-green-100">
//                                         Farmer to Market
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Main Content */}
//                         <div className="max-w-xl">

//                             <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-green-50 backdrop-blur">
//                                 <ShieldCheck className="h-4 w-4" />
//                                 Secure OTP Login
//                             </div>

//                             <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
//                                 Welcome back to
//                                 <span className="block text-green-100">
//                                     KrishiConnect
//                                 </span>
//                             </h1>

//                             <p className="mt-6 max-w-lg text-lg leading-8 text-green-50">
//                                 Connect with the agricultural
//                                 marketplace, discover better
//                                 opportunities, and manage your
//                                 trade from one simple platform.
//                             </p>

//                             <div className="mt-10 grid grid-cols-3 gap-4">

//                                 <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
//                                     <p className="text-2xl font-bold text-white">
//                                         01
//                                     </p>
//                                     <p className="mt-1 text-sm text-green-100">
//                                         Secure
//                                     </p>
//                                 </div>

//                                 <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
//                                     <p className="text-2xl font-bold text-white">
//                                         02
//                                     </p>
//                                     <p className="mt-1 text-sm text-green-100">
//                                         Simple
//                                     </p>
//                                 </div>

//                                 <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
//                                     <p className="text-2xl font-bold text-white">
//                                         03
//                                     </p>
//                                     <p className="mt-1 text-sm text-green-100">
//                                         Trusted
//                                     </p>
//                                 </div>

//                             </div>
//                         </div>

//                         {/* Bottom */}
//                         <p className="text-sm text-green-100">
//                             © {new Date().getFullYear()} KrishiConnect
//                         </p>

//                     </div>
//                 </section>

//                 {/* =========================
//                     RIGHT LOGIN PANEL
//                 ========================= */}
//                 <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

//                     <div className="w-full max-w-md">

//                         {/* Mobile Logo */}
//                         <div className="mb-8 flex items-center gap-3 lg:hidden">
//                             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-100">
//                                 <Leaf className="h-6 w-6 text-green-700" />
//                             </div>

//                             <div>
//                                 <p className="font-bold text-gray-900">
//                                     KRISHICONNECT
//                                 </p>

//                                 <p className="text-xs text-gray-500">
//                                     Farmer to Market
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Card */}
//                         <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:p-9">

//                             {step === "phone" ? (
//                                 <>
//                                     {/* Header */}
//                                     <div>
//                                         <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
//                                             <ShieldCheck className="h-6 w-6 text-green-600" />
//                                         </div>

//                                         <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
//                                             Secure Login
//                                         </p>

//                                         <h2 className="mt-2 text-3xl font-bold text-gray-900">
//                                             Welcome back
//                                         </h2>

//                                         <p className="mt-2 text-sm leading-6 text-gray-500">
//                                             Enter your registered mobile
//                                             number to continue.
//                                         </p>
//                                     </div>

//                                     {/* Alert */}
//                                     {error && (
//                                         <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
//                                             {error}
//                                         </div>
//                                     )}

//                                     {success && (
//                                         <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
//                                             {success}
//                                         </div>
//                                     )}

//                                     {/* Form */}
//                                     <form
//                                         onSubmit={handleSendOtp}
//                                         className="mt-7 space-y-5"
//                                     >

//                                         <div>
//                                             <label className="mb-2 block text-sm font-semibold text-gray-700">
//                                                 Mobile Number
//                                             </label>

//                                             <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-gray-50 transition focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-100">

//                                                 <div className="flex items-center border-r border-gray-200 px-4 text-sm font-semibold text-gray-600">
//                                                     +91
//                                                 </div>

//                                                 <input
//                                                     type="tel"
//                                                     inputMode="numeric"
//                                                     maxLength={10}
//                                                     value={phone}
//                                                     onChange={(e) =>
//                                                         setPhone(
//                                                             e.target.value.replace(
//                                                                 /\D/g,
//                                                                 ""
//                                                             )
//                                                         )
//                                                     }
//                                                     placeholder="Enter mobile number"
//                                                     className="w-full bg-transparent px-4 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
//                                                 />
//                                             </div>
//                                         </div>

//                                         <button
//                                             type="submit"
//                                             disabled={loading}
//                                             className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//                                         >
//                                             {loading
//                                                 ? "Sending OTP..."
//                                                 : "Send OTP"}

//                                             {!loading && (
//                                                 <ArrowRight className="h-4 w-4" />
//                                             )}
//                                         </button>

//                                     </form>

//                                     {/* Register */}
//                                     <div className="mt-7 border-t border-gray-100 pt-6 text-center">
//                                         <p className="text-sm text-gray-500">
//                                             Don't have an account?{" "}
//                                             <Link
//                                                 to="/register"
//                                                 className="font-semibold text-green-600 hover:text-green-700"
//                                             >
//                                                 Create account
//                                             </Link>
//                                         </p>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <>
//                                     {/* OTP Header */}
//                                     <button
//                                         type="button"
//                                         onClick={handleChangeNumber}
//                                         className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-600"
//                                     >
//                                         <ArrowLeft className="h-4 w-4" />
//                                         Change number
//                                     </button>

//                                     <div>
//                                         <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
//                                             Verify OTP
//                                         </p>

//                                         <h2 className="mt-2 text-3xl font-bold text-gray-900">
//                                             Enter your OTP
//                                         </h2>

//                                         <p className="mt-2 text-sm leading-6 text-gray-500">
//                                             We've sent a 6-digit verification
//                                             code to
//                                             <span className="ml-1 font-semibold text-gray-800">
//                                                 +91 {phone}
//                                             </span>
//                                         </p>
//                                     </div>

//                                     {/* Alert */}
//                                     {error && (
//                                         <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
//                                             {error}
//                                         </div>
//                                     )}

//                                     {success && (
//                                         <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
//                                             {success}
//                                         </div>
//                                     )}

//                                     {/* OTP Form */}
//                                     <form
//                                         onSubmit={handleVerifyOtp}
//                                         className="mt-7"
//                                     >
//                                         <label className="mb-3 block text-sm font-semibold text-gray-700">
//                                             Verification Code
//                                         </label>

//                                         <input
//                                             type="text"
//                                             inputMode="numeric"
//                                             maxLength={6}
//                                             value={otp}
//                                             onChange={(e) =>
//                                                 setOtp(
//                                                     e.target.value.replace(
//                                                         /\D/g,
//                                                         ""
//                                                     )
//                                                 )
//                                             }
//                                             placeholder="Enter 6-digit OTP"
//                                             className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-center text-xl font-bold tracking-[0.5em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
//                                         />

//                                         <button
//                                             type="submit"
//                                             disabled={loading}
//                                             className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//                                         >
//                                             {loading
//                                                 ? "Verifying..."
//                                                 : "Verify & Login"}

//                                             {!loading && (
//                                                 <ArrowRight className="h-4 w-4" />
//                                             )}
//                                         </button>
//                                     </form>

//                                     {/* Development note */}
//                                     <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3">
//                                         <p className="text-xs leading-5 text-amber-700">
//                                             <strong>Development mode:</strong>{" "}
//                                             Check your backend terminal
//                                             for the OTP.
//                                         </p>
//                                     </div>

//                                 </>
//                             )}

//                         </div>

//                     </div>
//                 </section>
//             </div>
//         </div>
//     );
// };

// export default Login;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  LoaderCircle,
  Phone,
} from "lucide-react";

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
  const [message, setMessage] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);

      await sendLoginOtp(phone);

      setStep("otp");
      setMessage("OTP sent successfully. Check your phone.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyLoginOtp(phone, otp);
      await checkAuth();

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhone = () => {
    setStep("phone");
    setOtp("");
    setError("");
    setMessage("");
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");

    try {
      setLoading(true);
      await sendLoginOtp(phone);
      setMessage("A new OTP has been sent to your phone.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-2xl bg-white shadow-[0_12px_60px_rgba(20,45,30,0.08)] sm:min-h-[calc(100vh-40px)] sm:rounded-3xl lg:min-h-[calc(100vh-64px)] lg:grid-cols-[1.02fr_0.98fr]">
        {/* Left visual panel */}
        <section className="relative hidden min-h-[680px] overflow-hidden bg-[#153e2c] lg:flex lg:flex-col lg:justify-between">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85"
            alt="Lush green agricultural fields"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#102e20]/85 via-[#153e2c]/45 to-[#102e20]/90" />

          <div className="relative z-10 flex items-center gap-3 px-12 pt-11 xl:px-16">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <Leaf size={24} strokeWidth={1.8} />
            </div>

            <span className="text-2xl font-bold tracking-tight text-white">
              Krishi<span className="font-medium text-green-200">Connect</span>
            </span>
          </div>

          <div className="relative z-10 max-w-2xl px-12 pb-14 xl:px-16 xl:pb-16">
            <div className="mb-6 h-1 w-12 rounded-full bg-green-300" />

            <h1 className="max-w-xl text-4xl font-semibold leading-[1.18] tracking-tight text-white xl:text-5xl">
              Bringing the farming community closer.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/80 xl:text-lg">
              A simpler way for farmers and buyers to connect, trade produce,
              and grow together.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              Connecting farms with opportunities
            </div>
          </div>
        </section>

        {/* Right login panel */}
        <section className="flex min-h-[650px] flex-col bg-white px-5 py-7 sm:px-10 sm:py-10 lg:min-h-[680px] lg:px-12 xl:px-20">
          {/* Mobile brand */}
          <Link
            to="/"
            className="mb-12 flex items-center gap-2.5 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-800 text-white">
              <Leaf size={22} />
            </span>

            <span className="text-xl font-bold tracking-tight text-gray-900">
              Krishi<span className="text-green-700">Connect</span>
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[410px]">
              <Link
                to="/"
                className="mb-12 hidden w-fit items-center gap-2 text-sm text-gray-500 transition hover:text-green-800 lg:inline-flex"
              >
                <ArrowLeft size={16} />
                Back to home
              </Link>

              <div className="mb-9">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
                  Welcome back
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-[36px]">
                  Sign in to your account
                </h2>

                <p className="mt-3 text-[15px] leading-6 text-gray-500">
                  {step === "phone"
                    ? "Enter your mobile number to continue securely."
                    : `Enter the verification code sent to +91 ${phone}.`}
                </p>
              </div>

              {step === "phone" ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Mobile number
                    </label>

                    <div className="flex h-[54px] overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-green-700 focus-within:ring-4 focus-within:ring-green-700/10">
                      <div className="flex items-center gap-2 border-r border-gray-200 px-4 text-sm font-medium text-gray-600">
                        <Phone size={17} className="text-gray-400" />
                        <span>+91</span>
                      </div>

                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="Enter 10-digit number"
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        maxLength={10}
                        required
                        className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      We’ll send you a one-time password for verification.
                    </p>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800"
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-green-800/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Verification code
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      maxLength={6}
                      required
                      autoFocus
                      className="h-[58px] w-full rounded-xl border border-gray-200 bg-white px-4 text-center text-2xl font-semibold tracking-[0.65em] text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                    />

                    <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                      <button
                        type="button"
                        onClick={handleChangePhone}
                        className="font-medium text-gray-500 transition hover:text-green-800"
                      >
                        Change number
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="font-semibold text-green-800 transition hover:text-green-950 disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800"
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-green-800/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle size={19} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify and sign in
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-green-800 transition hover:text-green-950"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-5 text-xs text-gray-400 sm:flex-row">
            <span>© {new Date().getFullYear()} KrishiConnect</span>
            <span>Built for a better farming ecosystem</span>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Login;