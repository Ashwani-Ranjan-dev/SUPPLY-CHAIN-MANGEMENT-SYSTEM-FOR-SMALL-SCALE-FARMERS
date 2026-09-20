import {
    useEffect,
    useState,
} from "react";

import {
    Truck,
    MapPin,
    User,
    Package,
    RefreshCw,
    CheckCircle2,
    Clock3,
    Navigation,
} from "lucide-react";

import {
    getFarmerDeliveries,
    updateDeliveryStatus,
} from "../../services/deliveryServices.js";


const FarmerDeliveries = () => {
    const [deliveries, setDeliveries] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    const loadDeliveries = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getFarmerDeliveries();

            setDeliveries(
                data.deliveries || []
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to load deliveries."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadDeliveries();
    }, []);


    const handleStatusUpdate = async (
        id,
        status
    ) => {
        try {
            setActionLoading(id);
            setError("");

            const data =
                await updateDeliveryStatus(
                    id,
                    status
                );

            setDeliveries((current) =>
                current.map((delivery) =>
                    delivery._id === id
                        ? data.delivery
                        : delivery
                )
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to update delivery."
            );
        } finally {
            setActionLoading(null);
        }
    };


    const statusConfig = {
        NOT_ASSIGNED: {
            label: "Not Assigned",
            style:
                "bg-gray-100 text-gray-700 border-gray-200",
        },

        ASSIGNED: {
            label: "Assigned",
            style:
                "bg-blue-50 text-blue-700 border-blue-200",
        },

        PICKED_UP: {
            label: "Picked Up",
            style:
                "bg-indigo-50 text-indigo-700 border-indigo-200",
        },

        IN_TRANSIT: {
            label: "In Transit",
            style:
                "bg-amber-50 text-amber-700 border-amber-200",
        },

        DELIVERED: {
            label: "Delivered",
            style:
                "bg-green-50 text-green-700 border-green-200",
        },

        CANCELLED: {
            label: "Cancelled",
            style:
                "bg-red-50 text-red-700 border-red-200",
        },
    };


    const nextStatus = {
        ASSIGNED: "PICKED_UP",
        PICKED_UP: "IN_TRANSIT",
        IN_TRANSIT: "DELIVERED",
    };


    return (
        <div className="min-h-screen bg-[#f7faf7]">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                            <Truck size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Deliveries
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track your produce from
                                pickup to delivery.
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadDeliveries}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                </div>


                {/* Error */}
                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}


                {/* Loading */}
                {loading && (
                    <div className="space-y-5">

                        {[1, 2, 3].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-72 animate-pulse rounded-2xl bg-white"
                                />
                            )
                        )}

                    </div>
                )}


                {/* Empty */}
                {!loading &&
                    deliveries.length ===
                    0 && (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                <Truck size={30} />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-gray-900">
                                No deliveries yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Delivery information will
                                appear here when one of
                                your deals is accepted.
                            </p>

                        </div>
                    )}


                {/* Delivery cards */}
                {!loading &&
                    deliveries.length > 0 && (
                        <div className="space-y-5">

                            {deliveries.map(
                                (delivery) => {
                                    const config =
                                        statusConfig[
                                        delivery.status
                                        ];

                                    const next =
                                        nextStatus[
                                        delivery.status
                                        ];

                                    const paymentPaid =
                                        delivery.paymentStatus ===
                                        "PAID";

                                    const produce =
                                        delivery.produce;

                                    const buyer =
                                        delivery.buyer;

                                    return (
                                        <div
                                            key={
                                                delivery._id
                                            }
                                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                        >

                                            {/* Top */}
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                                <div className="flex items-start gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                        <Package
                                                            size={
                                                                22
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <h2 className="text-lg font-bold text-gray-900">
                                                            {produce?.crop ||
                                                                "Produce"}
                                                        </h2>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {delivery.quantity}{" "}
                                                            {
                                                                delivery.unit
                                                            }
                                                        </p>
                                                    </div>

                                                </div>


                                                <span
                                                    className={`w-fit rounded-full border px-3 py-1.5 text-xs font-bold ${config.style}`}
                                                >
                                                    {
                                                        config.label
                                                    }
                                                </span>

                                            </div>


                                            {/* Progress */}
                                            <div className="mt-7">

                                                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">

                                                    <span>
                                                        Assigned
                                                    </span>

                                                    <span>
                                                        Picked Up
                                                    </span>

                                                    <span>
                                                        In Transit
                                                    </span>

                                                    <span>
                                                        Delivered
                                                    </span>

                                                </div>


                                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">

                                                    <div
                                                        className="h-full rounded-full bg-green-600 transition-all"
                                                        style={{
                                                            width:
                                                                delivery.status ===
                                                                    "ASSIGNED"
                                                                    ? "25%"
                                                                    : delivery.status ===
                                                                        "PICKED_UP"
                                                                        ? "50%"
                                                                        : delivery.status ===
                                                                            "IN_TRANSIT"
                                                                            ? "75%"
                                                                            : delivery.status ===
                                                                                "DELIVERED"
                                                                                ? "100%"
                                                                                : "0%",
                                                        }}
                                                    />

                                                </div>

                                            </div>


                                            {/* Information */}
                                            <div className="mt-6 grid gap-4 md:grid-cols-3">

                                                <div className="rounded-xl border border-gray-100 p-4">

                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                        <User
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        Buyer
                                                    </div>

                                                    <p className="mt-2 font-semibold text-gray-900">
                                                        {buyer?.name ||
                                                            "Buyer"}
                                                    </p>

                                                    {buyer?.village && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                            <MapPin
                                                                size={
                                                                    13
                                                                }
                                                            />
                                                            {
                                                                buyer.village
                                                            }
                                                        </p>
                                                    )}

                                                </div>


                                                <div className="rounded-xl border border-gray-100 p-4">

                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                        <MapPin
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        Pickup
                                                    </div>

                                                    <p className="mt-2 text-sm text-gray-600">
                                                        {
                                                            delivery.pickupLocation
                                                        }
                                                    </p>

                                                </div>


                                                <div className="rounded-xl border border-gray-100 p-4">

                                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                        <Navigation
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        Payment
                                                    </div>

                                                    <p
                                                        className={`mt-2 text-sm font-bold ${paymentPaid
                                                                ? "text-green-600"
                                                                : "text-amber-600"
                                                            }`}
                                                    >
                                                        {paymentPaid
                                                            ? "PAID"
                                                            : "PAYMENT PENDING"}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* Action */}
                                            {next && (
                                                <div className="mt-5 border-t border-gray-100 pt-5">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actionLoading ===
                                                            delivery._id ||
                                                            !paymentPaid
                                                        }
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                delivery._id,
                                                                next
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                                    >
                                                        {actionLoading ===
                                                            delivery._id ? (
                                                            <>
                                                                <RefreshCw
                                                                    size={
                                                                        16
                                                                    }
                                                                    className="animate-spin"
                                                                />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2
                                                                    size={
                                                                        16
                                                                    }
                                                                />
                                                                Mark as{" "}
                                                                {
                                                                    statusConfig[
                                                                        next
                                                                    ].label
                                                                }
                                                            </>
                                                        )}
                                                    </button>


                                                    {!paymentPaid && (
                                                        <p className="mt-2 text-xs text-amber-600">
                                                            Delivery
                                                            progression
                                                            will be
                                                            enabled
                                                            after
                                                            payment
                                                            confirmation.
                                                        </p>
                                                    )}

                                                </div>
                                            )}

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

            </div>

        </div>
    );
};

export default FarmerDeliveries;