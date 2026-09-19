import { useEffect, useMemo, useState } from "react";

import {
    CreditCard,
    IndianRupee,
    RefreshCw,
    CheckCircle2,
    Clock3,
    AlertCircle,
    User,
    Package,
} from "lucide-react";

import { getFarmerPayments } from "../../services/PaymentServices.js";


const FarmerPayments = () => {
    const [payments, setPayments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getFarmerPayments();

            setPayments(
                data.payments || []
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to load payments."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadPayments();
    }, []);


    const summary = useMemo(() => {
        const pending =
            payments
                .filter(
                    (payment) =>
                        payment.status ===
                        "PENDING"
                )
                .reduce(
                    (sum, payment) =>
                        sum + payment.amount,
                    0
                );

        const paid =
            payments
                .filter(
                    (payment) =>
                        payment.status ===
                        "PAID"
                )
                .reduce(
                    (sum, payment) =>
                        sum + payment.amount,
                    0
                );

        return {
            pending,
            paid,
            total: payments.length,
        };
    }, [payments]);


    const statusConfig = {
        PENDING: {
            icon: Clock3,
            style:
                "border-amber-200 bg-amber-50 text-amber-700",
        },

        PROCESSING: {
            icon: RefreshCw,
            style:
                "border-blue-200 bg-blue-50 text-blue-700",
        },

        PAID: {
            icon: CheckCircle2,
            style:
                "border-green-200 bg-green-50 text-green-700",
        },

        FAILED: {
            icon: AlertCircle,
            style:
                "border-red-200 bg-red-50 text-red-700",
        },

        REFUNDED: {
            icon: AlertCircle,
            style:
                "border-gray-200 bg-gray-50 text-gray-600",
        },
    };


    return (
        <div className="min-h-screen bg-[#f7faf7]">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                            <CreditCard
                                size={24}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Payments
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track payments linked
                                to your accepted deals.
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadPayments}
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


                {/* Summary */}
                <div className="mb-7 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Payment Records
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {summary.total}
                        </p>
                    </div>


                    <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">
                        <p className="text-sm text-amber-700">
                            Pending Amount
                        </p>

                        <p className="mt-2 flex items-center text-2xl font-bold text-amber-800">
                            <IndianRupee
                                size={20}
                            />

                            {summary.pending}
                        </p>
                    </div>


                    <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 shadow-sm">
                        <p className="text-sm text-green-700">
                            Paid Amount
                        </p>

                        <p className="mt-2 flex items-center text-2xl font-bold text-green-800">
                            <IndianRupee
                                size={20}
                            />

                            {summary.paid}
                        </p>
                    </div>

                </div>


                {/* Loading */}
                {loading && (
                    <div className="space-y-4">

                        {[1, 2, 3].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-44 animate-pulse rounded-2xl bg-white"
                                />
                            )
                        )}

                    </div>
                )}


                {/* Empty */}
                {!loading &&
                    payments.length ===
                        0 && (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                <CreditCard
                                    size={30}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-gray-900">
                                No payment records
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Payment records will
                                appear here after a
                                buyer's deal is accepted.
                            </p>

                        </div>
                    )}


                {/* Payments */}
                {!loading &&
                    payments.length > 0 && (
                        <div className="space-y-4">

                            {payments.map(
                                (payment) => {
                                    const config =
                                        statusConfig[
                                            payment.status
                                        ] ||
                                        statusConfig.PENDING;

                                    const StatusIcon =
                                        config.icon;

                                    const crop =
                                        payment.deal
                                            ?.produce
                                            ?.crop ||
                                        "Produce";

                                    return (
                                        <div
                                            key={
                                                payment._id
                                            }
                                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                                        >

                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                                {/* Left */}
                                                <div className="flex items-start gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                        <Package
                                                            size={
                                                                22
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold text-gray-900">
                                                            {crop}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            Payment
                                                            #{payment._id.slice(
                                                                -8
                                                            )}
                                                        </p>

                                                        {payment.buyer && (
                                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                                <User
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                {
                                                                    payment
                                                                        .buyer
                                                                        .name
                                                                }
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>


                                                {/* Amount */}
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Amount
                                                    </p>

                                                    <p className="mt-1 flex items-center text-xl font-bold text-gray-900">
                                                        <IndianRupee
                                                            size={
                                                                18
                                                            }
                                                        />

                                                        {
                                                            payment.amount
                                                        }{" "}
                                                        {
                                                            payment.currency
                                                        }
                                                    </p>
                                                </div>


                                                {/* Status */}
                                                <div
                                                    className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.style}`}
                                                >
                                                    <StatusIcon
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    {
                                                        payment.status
                                                    }
                                                </div>

                                            </div>

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

export default FarmerPayments;