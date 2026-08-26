import { useState } from "react";

import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Alert from "../components/ui/Alert.jsx";

import { createUser } from "../services/UserServices.js";
import { validateRegistration } from "../utils/Validation.js";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        role: "FARMER",
        farmerType: "SMALL",
        village: "",
        district: "",
        state: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const validationErrors =
            validateRegistration(formData);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            const userData = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim() || undefined,

                role: formData.role,

                farmerType:
                    formData.role === "FARMER"
                        ? formData.farmerType
                        : undefined,

                location: {
                    village: formData.village.trim(),
                    district: formData.district.trim(),
                    state: formData.state.trim(),
                },
            };

            const response = await createUser(userData);

            setMessage(
                response.message ||
                "Account created successfully."
            );

            setErrors({});

            setFormData({
                name: "",
                phone: "",
                email: "",
                role: "FARMER",
                farmerType: "SMALL",
                village: "",
                district: "",
                state: "",
            });
        } catch (error) {
            setError(error.message);
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
                    <div className="w-full max-w-xl">
                        {/* Mobile brand */}
                        <div className="
                            mb-10
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
                                <span className="text-xl">🌱</span>
                            </div>

                            <span className="
                                text-xl
                                font-bold
                                text-gray-900
                            ">
                                KrishiConnect
                            </span>
                        </div>

                        {/* Header */}
                        <div className="mb-8">
                            <p className="
                                mb-3
                                text-sm
                                font-semibold
                                text-green-600
                            ">
                                GET STARTED
                            </p>

                            <h2 className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-gray-900
                                sm:text-4xl
                            ">
                                Create your account
                            </h2>

                            <p className="
                                mt-3
                                text-sm
                                leading-6
                                text-gray-500
                            ">
                                Join KrishiConnect and become part of
                                a smarter agricultural marketplace.
                            </p>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div className="
                                grid
                                gap-5
                                sm:grid-cols-2
                            ">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    error={errors.name}
                                />

                                <Input
                                    label="Mobile Number"
                                    name="phone"
                                    placeholder="Enter mobile number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    error={errors.phone}
                                />
                            </div>

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                            />

                            {/* Role */}
                            <div className="space-y-3">
                                <label className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                ">
                                    I want to join as
                                </label>

                                <div className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                ">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                role: "FARMER",
                                            }))
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            transition
                                            ${formData.role === "FARMER"
                                                ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/10"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                                            }
                                        `}
                                    >
                                        🌾 Farmer
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                role: "BUYER",
                                            }))
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            px-4
                                            py-3
                                            text-sm
                                            font-semibold
                                            transition
                                            ${formData.role === "BUYER"
                                                ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/10"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                                            }
                                        `}
                                    >
                                        🛒 Buyer
                                    </button>
                                </div>
                            </div>

                            {/* Farmer Type */}
                            {formData.role === "FARMER" && (
                                <Select
                                    label="Farmer Category"
                                    name="farmerType"
                                    value={formData.farmerType}
                                    onChange={handleChange}
                                    error={errors.farmerType}
                                    
                                >
                                    <option value="SMALL">
                                        Small / Marginal Farmer
                                    </option>

                                    <option value="COMMERCIAL">
                                        Commercial Farmer
                                    </option>

                                    <option value="FPO">
                                        Farmer Producer Organization
                                    </option>
                                </Select>
                            )}

                            {/* Location */}
                            <div>
                                <p className="
                                    mb-3
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    Location
                                </p>

                                <div className="
                                    grid
                                    gap-4
                                    sm:grid-cols-3
                                ">
                                    <Input
                                        label="Village"
                                        name="village"
                                        placeholder="Village"
                                        value={formData.village}
                                        onChange={handleChange}
                                        error={errors.village}
                                    />

                                    <Input
                                        label="District"
                                        name="district"
                                        placeholder="District"
                                        value={formData.district}
                                        onChange={handleChange}
                                        error={errors.district}
                                    />

                                    <Input
                                        label="State"
                                        name="state"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                        error={errors.state}

                                    />
                                </div>
                            </div>

                            {/* Messages */}
                            {message && (
                                <Alert
                                    type="success"
                                    message={message}
                                    onClose={() => setMessage("")}
                                />
                            )}

                            {error && (
                                <Alert
                                    type="error"
                                    message={error}
                                    onClose={() => setError("")}
                                />
                            )}

                            <Button
                                type="submit"
                                loading={loading}
                            >
                                Create Account
                            </Button>

                            <p className="
                                text-center
                                text-sm
                                text-gray-500
                            ">
                                Already have an account?{" "}
                                <span className="
                                    cursor-pointer
                                    font-semibold
                                    text-green-600
                                    hover:text-green-700
                                ">
                                    Sign in
                                </span>
                            </p>
                        </form>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Register;