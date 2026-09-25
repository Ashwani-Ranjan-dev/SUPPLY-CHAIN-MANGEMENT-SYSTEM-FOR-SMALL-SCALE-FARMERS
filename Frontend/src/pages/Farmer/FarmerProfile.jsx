import { useEffect, useState } from "react";
import {
    User,
    Phone,
    MapPin,
    Sprout,
    ShieldCheck,
    Edit3,
    Save,
    X,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import FarmerSidebar from "../../components/Farmer/farmerSideBar";
import FarmerHeader from "../../components/Farmer/FarmerHeader";

import {
    getFarmerProfile,
    updateFarmerProfile,
} from "../../services/farmerServices.js";

const FarmerProfile = () => {
    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        village: "",
        produceInterest: "",
        farmerType: "SMALL",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFarmerProfile();

            setProfile(data.farmer);

            setFormData({
                name: data.farmer.name || "",
                village: data.farmer.village || "",
                produceInterest:
                    data.farmer.produceInterest || "",
                farmerType:
                    data.farmer.farmerType || "SMALL",
            });
        } catch (error) {
            setError(
                error.message ||
                    "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setSuccess("");
        setError("");
        setEditing(true);
    };

    const handleCancel = () => {
        if (!profile) return;

        setFormData({
            name: profile.name || "",
            village: profile.village || "",
            produceInterest:
                profile.produceInterest || "",
            farmerType:
                profile.farmerType || "SMALL",
        });

        setError("");
        setEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const data =
                await updateFarmerProfile(formData);

            setProfile(data.farmer);

            setFormData({
                name: data.farmer.name || "",
                village: data.farmer.village || "",
                produceInterest:
                    data.farmer.produceInterest || "",
                farmerType:
                    data.farmer.farmerType || "SMALL",
            });

            setEditing(false);
            setSuccess(
                "Your profile has been updated successfully."
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#f7faf7]">
                <FarmerSidebar />

                <main className="flex flex-1 items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

                        <p className="text-sm font-medium text-gray-500">
                            Loading your profile...
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#f7faf7]">
            <FarmerSidebar />

            <div className="flex min-w-0 flex-1 flex-col">
                <FarmerHeader />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-5xl">

                        {/* Page Header */}
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="rounded-lg bg-green-100 p-2 text-green-700">
                                        <User
                                            size={20}
                                        />
                                    </div>

                                    <span className="text-sm font-semibold text-green-700">
                                        Farmer Account
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                    My Profile
                                </h1>

                                <p className="mt-1 text-sm text-gray-500">
                                    Manage your personal and
                                    farming information.
                                </p>
                            </div>

                            {!editing && (
                                <button
                                    onClick={handleEdit}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                                >
                                    <Edit3 size={17} />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Alerts */}
                        {success && (
                            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                <CheckCircle2
                                    size={19}
                                />
                                {success}
                            </div>
                        )}

                        {error && (
                            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle
                                    size={19}
                                />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6 lg:grid-cols-3">

                                {/* Profile Card */}
                                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700">
                                            {profile?.name
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>

                                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                                            {profile?.name}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Farmer
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                            <ShieldCheck
                                                size={14}
                                            />

                                            {profile?.phoneVerified
                                                ? "Phone Verified"
                                                : "Phone Not Verified"}
                                        </div>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Personal Information
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Your basic account details.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        {/* Name */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Full Name
                                            </label>

                                            <div className="relative">
                                                <User
                                                    size={18}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={
                                                        formData.name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    disabled={
                                                        !editing
                                                    }
                                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Mobile Number
                                            </label>

                                            <div className="relative">
                                                <Phone
                                                    size={18}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    value={
                                                        profile?.phone ||
                                                        ""
                                                    }
                                                    disabled
                                                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-3 pl-10 pr-4 text-sm text-gray-500"
                                                />
                                            </div>

                                            <p className="mt-1.5 text-xs text-gray-400">
                                                Phone number is
                                                linked to OTP
                                                authentication.
                                            </p>
                                        </div>

                                        {/* Village */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Village / Location
                                            </label>

                                            <div className="relative">
                                                <MapPin
                                                    size={18}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    name="village"
                                                    value={
                                                        formData.village
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    disabled={
                                                        !editing
                                                    }
                                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Produce Interest */}
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Produce Interest
                                            </label>

                                            <div className="relative">
                                                <Sprout
                                                    size={18}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                />

                                                <input
                                                    type="text"
                                                    name="produceInterest"
                                                    value={
                                                        formData.produceInterest
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    disabled={
                                                        !editing
                                                    }
                                                    placeholder="e.g. Rice, Wheat"
                                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:text-gray-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Farmer Type */}
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                                Farmer Type
                                            </label>

                                            <div className="grid gap-3 sm:grid-cols-2">
                                                <label
                                                    className={`cursor-pointer rounded-xl border p-4 transition ${
                                                        formData.farmerType ===
                                                        "SMALL"
                                                            ? "border-green-500 bg-green-50"
                                                            : "border-gray-200 bg-white"
                                                    } ${
                                                        !editing
                                                            ? "cursor-not-allowed opacity-70"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="farmerType"
                                                        value="SMALL"
                                                        checked={
                                                            formData.farmerType ===
                                                            "SMALL"
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        disabled={
                                                            !editing
                                                        }
                                                        className="sr-only"
                                                    />

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                Small / Marginal
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Assisted Mode
                                                                features
                                                            </p>
                                                        </div>

                                                        {formData.farmerType ===
                                                            "SMALL" && (
                                                            <CheckCircle2
                                                                size={
                                                                    20
                                                                }
                                                                className="text-green-600"
                                                            />
                                                        )}
                                                    </div>
                                                </label>

                                                <label
                                                    className={`cursor-pointer rounded-xl border p-4 transition ${
                                                        formData.farmerType ===
                                                        "LARGE"
                                                            ? "border-green-500 bg-green-50"
                                                            : "border-gray-200 bg-white"
                                                    } ${
                                                        !editing
                                                            ? "cursor-not-allowed opacity-70"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="farmerType"
                                                        value="LARGE"
                                                        checked={
                                                            formData.farmerType ===
                                                            "LARGE"
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        disabled={
                                                            !editing
                                                        }
                                                        className="sr-only"
                                                    />

                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                Large / FPO
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Trade Mode
                                                                features
                                                            </p>
                                                        </div>

                                                        {formData.farmerType ===
                                                            "LARGE" && (
                                                            <CheckCircle2
                                                                size={
                                                                    20
                                                                }
                                                                className="text-green-600"
                                                            />
                                                        )}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {editing && (
                                        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={
                                                    handleCancel
                                                }
                                                disabled={
                                                    saving
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <X size={17} />
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                disabled={
                                                    saving
                                                }
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Save size={17} />

                                                {saving
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Account Security */}
                        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                                    <ShieldCheck
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <h2 className="font-bold text-gray-900">
                                        Account Security
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-gray-500">
                                        Your mobile number is
                                        protected through OTP-based
                                        authentication. Profile
                                        changes do not modify your
                                        authentication credentials.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FarmerProfile;