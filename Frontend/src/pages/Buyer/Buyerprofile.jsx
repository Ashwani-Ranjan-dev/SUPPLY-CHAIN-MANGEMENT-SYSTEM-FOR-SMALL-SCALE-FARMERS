import { useEffect, useState } from "react";

import {
    User,
    Phone,
    MapPin,
    ShieldCheck,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getbuyerprofile } from "../../services/buyerServices";


const BuyerProfile = () => {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==================================================
    // FETCH BUYER PROFILE
    // ==================================================

    const fetchBuyerProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getbuyerprofile();

            console.log(
                "Buyer profile response:",
                data
            );

            // Backend returns:
            //
            // {
            //     success: true,
            //     buyer: {...}
            // }

            setProfile(data.buyer);

        } catch (error) {

            console.error(
                "Fetch buyer profile error:",
                error
            );

            setError(
                error.message ||
                "Unable to load buyer profile."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==================================================
    // LOAD PROFILE
    // ==================================================

    useEffect(() => {

        fetchBuyerProfile();

    }, []);


    // ==================================================
    // LOADING STATE
    // ==================================================

    if (loading) {

        return (
            <main className="min-h-screen px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-4xl">

                    <div className="animate-pulse">

                        <div className="h-4 w-32 rounded bg-gray-200" />

                        <div className="mt-3 h-9 w-64 rounded bg-gray-200" />

                        <div className="mt-2 h-4 w-48 rounded bg-gray-200" />

                    </div>


                    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">

                        <div className="flex items-center gap-5">

                            <div className="h-20 w-20 rounded-full bg-gray-200" />

                            <div className="flex-1">

                                <div className="h-6 w-48 rounded bg-gray-200" />

                                <div className="mt-3 h-4 w-32 rounded bg-gray-200" />

                            </div>

                        </div>


                        <div className="mt-8 grid gap-5 sm:grid-cols-2">

                            {[1, 2, 3, 4].map((item) => (

                                <div
                                    key={item}
                                    className="h-20 animate-pulse rounded-2xl bg-gray-100"
                                />

                            ))}

                        </div>

                    </div>

                </div>

            </main>
        );
    }


    // ==================================================
    // ERROR STATE
    // ==================================================

    if (error) {

        return (
            <main className="min-h-screen px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-4xl">

                    <div className="rounded-3xl border border-red-100 bg-red-50 p-7">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100">

                                <User className="h-5 w-5 text-red-600" />

                            </div>


                            <div>

                                <h2 className="text-lg font-bold text-red-800">
                                    Unable to load profile
                                </h2>

                                <p className="mt-1 text-sm text-red-600">
                                    {error}
                                </p>

                            </div>

                        </div>


                        <div className="mt-5 flex flex-wrap gap-3">

                            <button
                                type="button"
                                onClick={fetchBuyerProfile}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >

                                <RefreshCw className="h-4 w-4" />

                                Retry

                            </button>


                            <Link
                                to="/buyer/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >

                                <ArrowLeft className="h-4 w-4" />

                                Dashboard

                            </Link>

                        </div>

                    </div>

                </div>

            </main>
        );
    }


    // ==================================================
    // PROFILE VALUES
    // ==================================================

    const name = profile?.name || "Not available";

    const phone = profile?.phone || "Not available";

    const village = profile?.village || "Not available";

    const role = profile?.role || "BUYER";

    const phoneVerified = profile?.phoneVerified;


    // ==================================================
    // PROFILE PAGE
    // ==================================================

    return (

        <main className="min-h-screen px-5 py-8 sm:px-8">

            <div className="mx-auto max-w-4xl">


                {/* ================================================== */}
                {/* HEADER */}
                {/* ================================================== */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <p className="text-sm font-bold tracking-wider text-green-600">
                            KRISHICONNECT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Buyer Profile
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            View your account information and profile details.
                        </p>

                    </div>


                    <Link
                        to="/buyer/dashboard"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                    >

                        <ArrowLeft className="h-4 w-4" />

                        Dashboard

                    </Link>

                </div>


                {/* ================================================== */}
                {/* PROFILE CARD */}
                {/* ================================================== */}

                <div className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">


                    {/* PROFILE HEADER */}

                    <div className="bg-blue-700 px-7 py-8 text-white sm:px-9">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10">

                                <User className="h-9 w-9 text-white" />

                            </div>


                            <div>

                                <h2 className="text-2xl font-bold">
                                    {name}
                                </h2>

                                <p className="mt-1 text-sm text-blue-100">
                                    Buyer Account
                                </p>


                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">

                                    <ShieldCheck className="h-3.5 w-3.5" />

                                    {role}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* PROFILE DETAILS */}

                    <div className="p-7 sm:p-9">

                        <div className="mb-6">

                            <h3 className="text-lg font-bold text-gray-900">
                                Personal Information
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Your registered buyer account details.
                            </p>

                        </div>


                        <div className="grid gap-5 sm:grid-cols-2">


                            {/* NAME */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">

                                        <User className="h-5 w-5 text-blue-600" />

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {name}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* PHONE */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">

                                        <Phone className="h-5 w-5 text-green-600" />

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Phone Number
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {phone}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* VILLAGE */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">

                                        <MapPin className="h-5 w-5 text-amber-600" />

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Location
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {village}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ACCOUNT TYPE */}

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">

                                        <ShieldCheck className="h-5 w-5 text-purple-600" />

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Account Type
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {role}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* PHONE VERIFICATION */}

                        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">

                                    <ShieldCheck className="h-5 w-5 text-emerald-600" />

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Phone Verification
                                    </p>

                                    <p className="mt-1 font-semibold text-gray-900">

                                        {phoneVerified
                                            ? "Phone number verified"
                                            : "Phone number not verified"
                                        }

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* REFRESH */}

                        <div className="mt-7 flex justify-end">

                            <button
                                type="button"
                                onClick={fetchBuyerProfile}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >

                                <RefreshCw className="h-4 w-4" />

                                Refresh Profile

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
};


export default BuyerProfile;