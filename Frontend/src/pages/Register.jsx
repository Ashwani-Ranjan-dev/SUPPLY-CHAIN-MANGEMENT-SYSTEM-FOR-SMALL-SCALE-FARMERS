// import { useState } from "react";
// import { Sprout, UserRound } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// import AuthBrandPanel from "../components/auth/AuthBrandPanel";
// import Input from "../components/ui/Input";
// import Select from "../components/ui/Select";
// import Button from "../components/ui/Button";
// import Alert from "../components/ui/Alert";
// import OtpInput from "../components/ui/otpinput";

// import {
//     sendOtp,
//     verifyOtp,
// } from "../services/authServices.js";

// const Register = () => {
//     const navigate = useNavigate();

//     const [step, setStep] =
//         useState("details");

//     const [formData, setFormData] =
//         useState({
//             name: "",
//             phone: "",
//             role: "FARMER",
//             village: "",
//             produceInterest: "",
//             farmerType: "",
//         });

//     const [otp, setOtp] =
//         useState("");

//     const [loading, setLoading] =
//         useState(false);

//     const [error, setError] =
//         useState("");

//     const [message, setMessage] =
//         useState("");

//     const handleChange = (event) => {
//         const {
//             name,
//             value,
//         } = event.target;

//         setFormData((previous) => ({
//             ...previous,
//             [name]: value,
//         }));
//     };

//     const handleRoleChange = (role) => {
//         setFormData((previous) => ({
//             ...previous,
//             role,
//             farmerType:
//                 role === "FARMER"
//                     ? previous.farmerType
//                     : "",
//             produceInterest:
//                 role === "FARMER"
//                     ? previous.produceInterest
//                     : "",
//         }));
//     };

//     const validateForm = () => {
//         if (
//             !formData.name.trim()
//         ) {
//             return "Please enter your full name.";
//         }

//         if (
//             !/^[6-9]\d{9}$/.test(
//                 formData.phone
//             )
//         ) {
//             return "Enter a valid 10-digit Indian mobile number.";
//         }

//         if (
//             !formData.village.trim()
//         ) {
//             return "Please enter your village or location.";
//         }

//         if (
//             formData.role === "FARMER" &&
//             !formData.farmerType
//         ) {
//             return "Please select your farmer type.";
//         }

//         return "";
//     };

//     const handleSendOtp = async (
//         event
//     ) => {
//         event.preventDefault();

//         setError("");
//         setMessage("");

//         const validationError =
//             validateForm();

//         if (validationError) {
//             setError(
//                 validationError
//             );

//             return;
//         }

//         setLoading(true);

//         try {
//             const response =
//                 await sendOtp(
//                     formData.phone
//                 );

//             setMessage(
//                 response.message
//             );

//             setStep("otp");
//         } catch (error) {
//             setError(
//                 error.message
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVerifyOtp = async (
//         event
//     ) => {
//         event.preventDefault();

//         setError("");
//         setMessage("");

//         if (otp.length !== 6) {
//             setError(
//                 "Please enter the complete 6-digit OTP."
//             );

//             return;
//         }

//         setLoading(true);

//         try {
//             await verifyOtp(
//                 formData.phone,
//                 otp,
//                 {
//                     name: formData.name,
//                     role: formData.role,
//                     village:
//                         formData.village,
//                     produceInterest:
//                         formData.produceInterest,
//                     farmerType:
//                         formData.farmerType,
//                 }
//             );

//             navigate("/dashboard");
//         } catch (error) {
//             setError(
//                 error.message
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <main
//             className="
//                 min-h-screen
//                 bg-[#f7faf7]
//                 lg:p-6
//             "
//         >
//             <div
//                 className="
//                     mx-auto
//                     flex
//                     min-h-screen
//                     max-w-[1500px]
//                     overflow-hidden
//                     bg-white
//                     shadow-xl
//                     lg:min-h-[calc(100vh-3rem)]
//                     lg:rounded-3xl
//                 "
//             >
//                 <AuthBrandPanel />

//                 <section
//                     className="
//                         flex
//                         w-full
//                         items-center
//                         justify-center
//                         px-5
//                         py-10
//                         sm:px-8
//                         lg:w-[52%]
//                         xl:w-1/2
//                         xl:px-16
//                     "
//                 >
//                     <div
//                         className="
//                             w-full
//                             max-w-md
//                         "
//                     >
//                         {/* Mobile Branding */}
//                         <div
//                             className="
//                                 mb-10
//                                 flex
//                                 items-center
//                                 gap-3
//                                 lg:hidden
//                             "
//                         >
//                             <div
//                                 className="
//                                     flex
//                                     h-11
//                                     w-11
//                                     items-center
//                                     justify-center
//                                     rounded-xl
//                                     bg-green-600
//                                 "
//                             >
//                                 <Sprout
//                                     className="
//                                         h-6
//                                         w-6
//                                         text-white
//                                     "
//                                 />
//                             </div>

//                             <span
//                                 className="
//                                     text-xl
//                                     font-bold
//                                     text-gray-900
//                                 "
//                             >
//                                 KrishiConnect
//                             </span>
//                         </div>

//                         {step === "details" ? (
//                             <form
//                                 onSubmit={
//                                     handleSendOtp
//                                 }
//                                 className="
//                                     space-y-5
//                                 "
//                             >
//                                 <div
//                                     className="
//                                         mb-8
//                                     "
//                                 >
//                                     <div
//                                         className="
//                                             mb-4
//                                             flex
//                                             h-12
//                                             w-12
//                                             items-center
//                                             justify-center
//                                             rounded-2xl
//                                             bg-green-50
//                                         "
//                                     >
//                                         <UserRound
//                                             className="
//                                                 h-6
//                                                 w-6
//                                                 text-green-600
//                                             "
//                                         />
//                                     </div>

//                                     <p
//                                         className="
//                                             mb-2
//                                             text-sm
//                                             font-semibold
//                                             text-green-600
//                                         "
//                                     >
//                                         JOIN KRISHICONNECT
//                                     </p>

//                                     <h1
//                                         className="
//                                             text-3xl
//                                             font-bold
//                                             tracking-tight
//                                             text-gray-900
//                                         "
//                                     >
//                                         Create your account
//                                     </h1>

//                                     <p
//                                         className="
//                                             mt-3
//                                             text-sm
//                                             leading-6
//                                             text-gray-500
//                                         "
//                                     >
//                                         Tell us a little
//                                         about yourself to
//                                         get started.
//                                     </p>
//                                 </div>

//                                 <Input
//                                     label="Full Name"
//                                     name="name"
//                                     placeholder="Enter your full name"
//                                     value={
//                                         formData.name
//                                     }
//                                     onChange={
//                                         handleChange
//                                     }
//                                     required
//                                 />

//                                 <Input
//                                     label="Mobile Number"
//                                     name="phone"
//                                     placeholder="9876543210"
//                                     value={
//                                         formData.phone
//                                     }
//                                     onChange={(
//                                         event
//                                     ) => {
//                                         const value =
//                                             event.target.value
//                                                 .replace(
//                                                     /\D/g,
//                                                     ""
//                                                 )
//                                                 .slice(
//                                                     0,
//                                                     10
//                                                 );

//                                         setFormData(
//                                             (
//                                                 previous
//                                             ) => ({
//                                                 ...previous,
//                                                 phone: value,
//                                             })
//                                         );
//                                     }}
//                                     required
//                                 />

//                                 {/* Role */}
//                                 <div
//                                     className="
//                                         space-y-2
//                                     "
//                                 >
//                                     <label
//                                         className="
//                                             block
//                                             text-sm
//                                             font-medium
//                                             text-gray-700
//                                         "
//                                     >
//                                         I am joining as
//                                     </label>

//                                     <div
//                                         className="
//                                             grid
//                                             grid-cols-2
//                                             gap-3
//                                         "
//                                     >
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 handleRoleChange(
//                                                     "FARMER"
//                                                 )
//                                             }
//                                             className={`
//                                                 rounded-xl
//                                                 border
//                                                 px-4
//                                                 py-3
//                                                 text-sm
//                                                 font-semibold
//                                                 transition
//                                                 ${
//                                                     formData.role ===
//                                                     "FARMER"
//                                                         ? "border-green-500 bg-green-50 text-green-700"
//                                                         : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
//                                                 }
//                                             `}
//                                         >
//                                             🌾 Farmer
//                                         </button>

//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 handleRoleChange(
//                                                     "BUYER"
//                                                 )
//                                             }
//                                             className={`
//                                                 rounded-xl
//                                                 border
//                                                 px-4
//                                                 py-3
//                                                 text-sm
//                                                 font-semibold
//                                                 transition
//                                                 ${
//                                                     formData.role ===
//                                                     "BUYER"
//                                                         ? "border-green-500 bg-green-50 text-green-700"
//                                                         : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
//                                                 }
//                                             `}
//                                         >
//                                             🛒 Buyer
//                                         </button>
//                                     </div>
//                                 </div>

//                                 <Input
//                                     label="Village / Location"
//                                     name="village"
//                                     placeholder="Enter your village or location"
//                                     value={
//                                         formData.village
//                                     }
//                                     onChange={
//                                         handleChange
//                                     }
//                                     required
//                                 />

//                                 {formData.role ===
//                                     "FARMER" && (
//                                     <>
//                                         <Select
//                                             label="Farmer Type"
//                                             name="farmerType"
//                                             value={
//                                                 formData.farmerType
//                                             }
//                                             onChange={
//                                                 handleChange
//                                             }
//                                             placeholder="Select farmer type"
//                                             required
//                                             options={[
//                                                 {
//                                                     value: "SMALL",
//                                                     label: "Small / Marginal Farmer",
//                                                 },
//                                                 {
//                                                     value: "LARGE",
//                                                     label: "Large Farmer / FPO",
//                                                 },
//                                             ]}
//                                         />

//                                         <Input
//                                             label="Produce Interest"
//                                             name="produceInterest"
//                                             placeholder="e.g. Onion, Wheat, Rice"
//                                             value={
//                                                 formData.produceInterest
//                                             }
//                                             onChange={
//                                                 handleChange
//                                             }
//                                         />
//                                     </>
//                                 )}

//                                 {error && (
//                                     <Alert
//                                         type="error"
//                                         message={
//                                             error
//                                         }
//                                     />
//                                 )}

//                                 <Button
//                                     type="submit"
//                                     loading={
//                                         loading
//                                     }
//                                 >
//                                     Continue with OTP
//                                 </Button>

//                                 <p
//                                     className="
//                                         text-center
//                                         text-sm
//                                         text-gray-500
//                                     "
//                                 >
//                                     Already have an
//                                     account?{" "}
//                                     <button
//                                         type="button"
//                                         onClick={() =>
//                                             navigate(
//                                                 "/login"
//                                             )
//                                         }
//                                         className="
//                                             font-semibold
//                                             text-green-600
//                                             hover:text-green-700
//                                         "
//                                     >
//                                         Login
//                                     </button>
//                                 </p>
//                             </form>
//                         ) : (
//                             <form
//                                 onSubmit={
//                                     handleVerifyOtp
//                                 }
//                                 className="
//                                     space-y-6
//                                 "
//                             >
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         setStep(
//                                             "details"
//                                         );
//                                         setOtp("");
//                                         setError("");
//                                         setMessage("");
//                                     }}
//                                     className="
//                                         mb-3
//                                         text-sm
//                                         font-medium
//                                         text-gray-500
//                                         hover:text-green-600
//                                     "
//                                 >
//                                     ← Edit details
//                                 </button>

//                                 <div
//                                     className="
//                                         mb-8
//                                     "
//                                 >
//                                     <p
//                                         className="
//                                             mb-2
//                                             text-sm
//                                             font-semibold
//                                             text-green-600
//                                         "
//                                     >
//                                         VERIFY MOBILE
//                                     </p>

//                                     <h1
//                                         className="
//                                             text-3xl
//                                             font-bold
//                                             text-gray-900
//                                         "
//                                     >
//                                         Verify your number
//                                     </h1>

//                                     <p
//                                         className="
//                                             mt-3
//                                             text-sm
//                                             leading-6
//                                             text-gray-500
//                                         "
//                                     >
//                                         Enter the 6-digit
//                                         OTP sent to{" "}
//                                         <span
//                                             className="
//                                                 font-semibold
//                                                 text-gray-800
//                                             "
//                                         >
//                                             +91{" "}
//                                             {
//                                                 formData.phone
//                                             }
//                                         </span>
//                                     </p>
//                                 </div>

//                                 <OtpInput
//                                     value={otp}
//                                     onChange={
//                                         setOtp
//                                     }
//                                 />

//                                 {error && (
//                                     <Alert
//                                         type="error"
//                                         message={
//                                             error
//                                         }
//                                     />
//                                 )}

//                                 {message && (
//                                     <Alert
//                                         type="success"
//                                         message={
//                                             message
//                                         }
//                                     />
//                                 )}

//                                 <Button
//                                     type="submit"
//                                     loading={
//                                         loading
//                                     }
//                                 >
//                                     Verify & Create Account
//                                 </Button>

//                                 <button
//                                     type="button"
//                                     onClick={
//                                         handleSendOtp
//                                     }
//                                     className="
//                                         w-full
//                                         text-center
//                                         text-sm
//                                         font-semibold
//                                         text-green-600
//                                         hover:text-green-700
//                                     "
//                                 >
//                                     Resend OTP
//                                 </button>
//                             </form>
//                         )}
//                     </div>
//                 </section>
//             </div>
//         </main>
//     );
// };

// export default Register;


import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

  const [step, setStep] = useState("details");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "FARMER",
    village: "",
    produceInterest: "",
    farmerType: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

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
        role === "FARMER" ? previous.farmerType : "",
      produceInterest:
        role === "FARMER" ? previous.produceInterest : "",
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your full name.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (!formData.village.trim()) {
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

  const handleSendOtp = async (event) => {
    event?.preventDefault();

    setError("");
    setMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await sendOtp(formData.phone);

      setMessage(
        response?.message || "OTP sent successfully."
      );
      setOtp("");
      setStep("otp");
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

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(formData.phone, otp, {
        name: formData.name.trim(),
        role: formData.role,
        village: formData.village.trim(),
        produceInterest: formData.produceInterest,
        farmerType: formData.farmerType,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Verification failed. Please check your OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditDetails = () => {
    setStep("details");
    setOtp("");
    setError("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-2xl bg-white shadow-[0_12px_60px_rgba(20,45,30,0.08)] sm:min-h-[calc(100vh-40px)] sm:rounded-3xl lg:min-h-[calc(100vh-64px)] lg:grid-cols-[1.02fr_0.98fr]">

        {/* Left image and branding panel */}
        <section className="relative hidden overflow-hidden bg-[#153e2c] lg:flex lg:flex-col lg:justify-between">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85"
            alt="Green agricultural fields"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-[#102e20]/85 via-[#153e2c]/45 to-[#102e20]/90" />

          <Link
            to="/"
            className="relative z-10 flex items-center gap-3 px-12 pt-11 xl:px-16"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <Leaf size={24} strokeWidth={1.8} />
            </span>

            <span className="text-2xl font-bold tracking-tight text-white">
              Krishi<span className="font-medium text-green-200">Connect</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-2xl px-12 pb-14 xl:px-16 xl:pb-16">
            <div className="mb-6 h-1 w-12 rounded-full bg-green-300" />

            <h1 className="max-w-xl text-4xl font-semibold leading-[1.18] tracking-tight text-white xl:text-5xl">
              Your next opportunity starts here.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/80 xl:text-lg">
              Join a growing community where farmers and buyers
              connect to make agricultural trade simpler.
            </p>

            <div className="mt-10 flex items-center gap-3 text-sm font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              One community. More opportunities.
            </div>
          </div>
        </section>

        {/* Registration form panel */}
        <section className="flex flex-col bg-white px-5 py-7 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
          {/* Mobile branding */}
          <Link
            to="/"
            className="mb-9 flex items-center gap-2.5 lg:hidden"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-800 text-white">
              <Leaf size={22} />
            </span>

            <span className="text-xl font-bold tracking-tight text-gray-900">
              Krishi<span className="text-green-700">Connect</span>
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[430px] py-3">
              <Link
                to="/"
                className="mb-8 hidden w-fit items-center gap-2 text-sm text-gray-500 transition hover:text-green-800 lg:inline-flex"
              >
                <ArrowLeft size={16} />
                Back to home
              </Link>

              {step === "details" ? (
                <>
                  <div className="mb-7">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                      <UserRound
                        size={23}
                        className="text-green-700"
                      />
                    </div>

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
                      Create your account
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-[36px]">
                      Join KrishiConnect
                    </h2>

                    <p className="mt-3 text-[15px] leading-6 text-gray-500">
                      Enter your details to get started.
                    </p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <Input
                      label="Full name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <Input
                        label="Mobile number"
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);

                          setFormData((previous) => ({
                            ...previous,
                            phone: value,
                          }));
                        }}
                        required
                      />
                      <p className="mt-1.5 text-xs text-gray-400">
                        Use your 10-digit Indian mobile number.
                      </p>
                    </div>

                    {/* Account role */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account type
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleRoleChange("FARMER")}
                          aria-pressed={formData.role === "FARMER"}
                          className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
                            formData.role === "FARMER"
                              ? "border-green-700 bg-green-50 text-green-800 ring-1 ring-green-700"
                              : "border-gray-200 text-gray-600 hover:border-green-300"
                          }`}
                        >
                          <span aria-hidden="true">🌾</span>
                          Farmer
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange("BUYER")}
                          aria-pressed={formData.role === "BUYER"}
                          className={`flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition ${
                            formData.role === "BUYER"
                              ? "border-green-700 bg-green-50 text-green-800 ring-1 ring-green-700"
                              : "border-gray-200 text-gray-600 hover:border-green-300"
                          }`}
                        >
                          <span aria-hidden="true">🛒</span>
                          Buyer
                        </button>
                      </div>
                    </div>

                    <Input
                      label="Village / location"
                      name="village"
                      placeholder="Enter your village or location"
                      value={formData.village}
                      onChange={handleChange}
                      required
                    />

                    {formData.role === "FARMER" && (
                      <>
                        <Select
                          label="Farmer type"
                          name="farmerType"
                          value={formData.farmerType}
                          onChange={handleChange}
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
                          label="Produce interest (optional)"
                          name="produceInterest"
                          placeholder="e.g. Onion, Wheat, Rice"
                          value={formData.produceInterest}
                          onChange={handleChange}
                        />
                      </>
                    )}

                    {error && (
                      <Alert type="error" message={error} />
                    )}

                    {message && (
                      <Alert type="success" message={message} />
                    )}

                    <div className="pt-2">
                      <Button type="submit" loading={loading}>
                        Continue with OTP
                      </Button>
                    </div>

                    <p className="pt-2 text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-green-800 transition hover:text-green-950"
                      >
                        Sign in
                      </Link>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleEditDetails}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-green-800"
                  >
                    <ArrowLeft size={16} />
                    Edit details
                  </button>

                  <div className="mb-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                      <Leaf size={23} className="text-green-700" />
                    </div>

                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
                      Mobile verification
                    </p>

                    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-[36px]">
                      Verify your number
                    </h2>

                    <p className="mt-3 text-[15px] leading-6 text-gray-500">
                      Enter the 6-digit code sent to{" "}
                      <span className="font-semibold text-gray-800">
                        +91 {formData.phone}
                      </span>
                      .
                    </p>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <label className="mb-3 block text-sm font-medium text-gray-700">
                        Verification code
                      </label>

                      <OtpInput value={otp} onChange={setOtp} />
                    </div>

                    {error && (
                      <Alert type="error" message={error} />
                    )}

                    {message && (
                      <Alert type="success" message={message} />
                    )}

                    <Button type="submit" loading={loading}>
                      Verify and create account
                    </Button>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-green-800 transition hover:text-green-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Resend OTP
                      <ArrowRight size={16} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-5 text-xs text-gray-400 sm:flex-row">
            <span>
              © {new Date().getFullYear()} KrishiConnect
            </span>
            <span>Built for a better farming ecosystem</span>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default Register;