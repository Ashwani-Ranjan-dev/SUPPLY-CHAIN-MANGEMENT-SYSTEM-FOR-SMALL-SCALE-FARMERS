import React, { useEffect, useState } from "react";

import {
    AlertCircle,
    CheckCircle2,
    Clock3,
    Loader2,
    MapPin,
    Package,
    RefreshCw,
    XCircle,
} from "lucide-react";

import DealPayment from "./DealPayment";

const API_URL = import.meta.env.VITE_API_URL;


const BuyerDeals = () => {

    const [deals, setDeals] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [activeFilter, setActiveFilter] =
        useState("ALL");


    // ==================================================
    // FETCH BUYER DEALS
    // ==================================================

    const fetchBuyerDeals = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/deals/buyer`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load your deals."
                );
            }

            setDeals(
                Array.isArray(data.deals)
                    ? data.deals
                    : []
            );

        } catch (error) {

            console.error(
                "Fetch buyer deals error:",
                error
            );

            setError(
                error.message ||
                "Unable to load your deals."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // INITIAL LOAD
    // ==================================================

    useEffect(() => {

        fetchBuyerDeals();

    }, []);


    // ==================================================
    // FILTER DEALS
    // ==================================================

    const filteredDeals =
        activeFilter === "ALL"
            ? deals
            : deals.filter(
                (deal) =>
                    deal.status === activeFilter
            );


    // ==================================================
    // STATUS CONFIG
    // ==================================================

    const getStatusConfig = (status) => {

        switch (status) {

            case "ACCEPTED":
                return {
                    label: "Accepted",
                    icon: CheckCircle2,
                    className:
                        "bg-green-50 text-green-700",
                };

            case "PENDING":
                return {
                    label: "Pending",
                    icon: Clock3,
                    className:
                        "bg-amber-50 text-amber-700",
                };

            case "REJECTED":
                return {
                    label: "Rejected",
                    icon: XCircle,
                    className:
                        "bg-red-50 text-red-700",
                };

            case "CANCELLED":
                return {
                    label: "Cancelled",
                    icon: XCircle,
                    className:
                        "bg-gray-100 text-gray-600",
                };

            case "COMPLETED":
                return {
                    label: "Completed",
                    icon: CheckCircle2,
                    className:
                        "bg-blue-50 text-blue-700",
                };

            default:
                return {
                    label: status || "Unknown",
                    icon: AlertCircle,
                    className:
                        "bg-gray-100 text-gray-600",
                };

        }

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <main className="min-h-screen bg-[#f5faf5] px-5 py-8 sm:px-8">

                <div className="mx-auto max-w-6xl">

                    <div className="flex items-center justify-center py-20">

                        <Loader2
                            className="
                                h-8
                                w-8
                                animate-spin
                                text-green-600
                            "
                        />

                    </div>

                </div>

            </main>

        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <main className="min-h-screen bg-[#f5faf5] px-5 py-8 sm:px-8">

            <div className="mx-auto max-w-6xl">

                {/* ====================================== */}
                {/* HEADER */}
                {/* ====================================== */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p
                            className="
                                text-sm
                                font-bold
                                tracking-wider
                                text-green-600
                            "
                        >
                            KRISHICONNECT
                        </p>

                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                text-gray-900
                            "
                        >
                            My Deals
                        </h1>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-gray-500
                            "
                        >
                            Track your offers, accepted deals
                            and payments.
                        </p>

                    </div>


                    <button
                        onClick={fetchBuyerDeals}
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-gray-700
                            shadow-sm
                            transition
                            hover:bg-gray-50
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        <RefreshCw className="h-4 w-4" />

                        Refresh

                    </button>

                </div>


                {/* ====================================== */}
                {/* ERROR */}
                {/* ====================================== */}

                {error && (

                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            border
                            border-red-100
                            bg-red-50
                            p-4
                            text-red-700
                        "
                    >

                        <AlertCircle
                            className="
                                mt-0.5
                                h-5
                                w-5
                                shrink-0
                            "
                        />

                        <div>

                            <p className="font-semibold">
                                Unable to load deals
                            </p>

                            <p className="mt-1 text-sm">
                                {error}
                            </p>

                        </div>

                    </div>

                )}


                {/* ====================================== */}
                {/* FILTERS */}
                {/* ====================================== */}

                <div
                    className="
                        mt-6
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    {[
                        "ALL",
                        "PENDING",
                        "ACCEPTED",
                        "REJECTED",
                        "COMPLETED",
                    ].map((filter) => (

                        <button
                            key={filter}
                            onClick={() =>
                                setActiveFilter(filter)
                            }
                            className={`
                                rounded-xl
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                transition
                                ${
                                    activeFilter === filter
                                        ? "bg-green-600 text-white"
                                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                                }
                            `}
                        >
                            {filter === "ALL"
                                ? "All"
                                : filter.charAt(0) +
                                  filter
                                      .slice(1)
                                      .toLowerCase()}
                        </button>

                    ))}

                </div>


                {/* ====================================== */}
                {/* EMPTY STATE */}
                {/* ====================================== */}

                {filteredDeals.length === 0 && (

                    <div
                        className="
                            mt-6
                            rounded-3xl
                            border
                            border-gray-100
                            bg-white
                            p-10
                            text-center
                            shadow-sm
                        "
                    >

                        <Package
                            className="
                                mx-auto
                                h-10
                                w-10
                                text-gray-300
                            "
                        />

                        <h2
                            className="
                                mt-4
                                text-lg
                                font-bold
                                text-gray-900
                            "
                        >
                            No deals found
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                text-gray-500
                            "
                        >
                            Your deals will appear here once
                            you make an offer on farmer produce.
                        </p>

                    </div>

                )}


                {/* ====================================== */}
                {/* DEAL LIST */}
                {/* ====================================== */}

                <div className="mt-6 space-y-5">

                    {filteredDeals.map((deal) => {

                        const status =
                            getStatusConfig(
                                deal.status
                            );

                        const StatusIcon =
                            status.icon;

                        const payment =
                            deal.payment;

                        return (

                            <div
                                key={deal._id}
                                className="
                                    rounded-3xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-6
                                    shadow-sm
                                "
                            >

                                {/* ========================== */}
                                {/* DEAL HEADER */}
                                {/* ========================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-4
                                        sm:flex-row
                                        sm:items-start
                                        sm:justify-between
                                    "
                                >

                                    <div>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <h2
                                                className="
                                                    text-xl
                                                    font-bold
                                                    text-gray-900
                                                "
                                            >
                                                {deal.produce?.crop ||
                                                    "Produce"}
                                            </h2>


                                            <span
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    ${status.className}
                                                `}
                                            >

                                                <StatusIcon
                                                    className="
                                                        h-3.5
                                                        w-3.5
                                                    "
                                                />

                                                {status.label}

                                            </span>

                                        </div>


                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                text-gray-500
                                            "
                                        >
                                            Deal ID:{" "}
                                            {deal._id}
                                        </p>

                                    </div>


                                    <div className="text-left sm:text-right">

                                        <p
                                            className="
                                                text-sm
                                                text-gray-500
                                            "
                                        >
                                            Total Amount
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-2xl
                                                font-bold
                                                text-gray-900
                                            "
                                        >
                                            ₹
                                            {Number(
                                                deal.totalAmount || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>

                                </div>


                                {/* ========================== */}
                                {/* DEAL DETAILS */}
                                {/* ========================== */}

                                <div
                                    className="
                                        mt-6
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                        lg:grid-cols-4
                                    "
                                >

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Quantity
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {deal.quantity}{" "}
                                            {deal.unit}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Offered Price
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            ₹
                                            {Number(
                                                deal.offeredPrice || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Farmer
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {deal.farmer?.name ||
                                                "Farmer"}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Payment
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {payment?.status ||
                                                "Not available"}
                                        </p>

                                    </div>

                                </div>


                                {/* ========================== */}
                                {/* LOCATION */}
                                {/* ========================== */}

                                {deal.produce?.location && (

                                    <div
                                        className="
                                            mt-5
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-gray-500
                                        "
                                    >

                                        <MapPin
                                            className="
                                                h-4
                                                w-4
                                                text-gray-400
                                            "
                                        />

                                        {deal.produce.location}

                                    </div>

                                )}


                                {/* ========================== */}
                                {/* MESSAGE */}
                                {/* ========================== */}

                                {deal.message && (

                                    <div
                                        className="
                                            mt-5
                                            rounded-2xl
                                            bg-gray-50
                                            p-4
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-gray-400
                                            "
                                        >
                                            Your Message
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-gray-700
                                            "
                                        >
                                            {deal.message}
                                        </p>

                                    </div>

                                )}


                                {/* ========================== */}
                                {/* PAYMENT */}
                                {/* ========================== */}

                                {deal.status === "ACCEPTED" &&
                                    payment && (

                                    <div
                                        className="
                                            mt-6
                                            border-t
                                            border-gray-100
                                            pt-5
                                        "
                                    >

                                        <DealPayment
                                            deal={{
                                                ...deal,
                                                payment,
                                            }}
                                        />

                                    </div>

                                )}

                            </div>

                        );

                    })}

                </div>

            </div>

        </main>

    );

};


export default BuyerDeals;