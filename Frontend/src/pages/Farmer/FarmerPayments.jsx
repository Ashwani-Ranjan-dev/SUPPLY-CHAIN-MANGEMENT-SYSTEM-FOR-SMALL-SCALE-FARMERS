import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    CreditCard,
    IndianRupee,
    RefreshCw,
    CheckCircle2,
    Clock3,
    AlertCircle,
    User,
    Package,
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    Wallet,
    TrendingUp,
    Receipt,
    ShieldCheck,
    CircleDollarSign,
} from "lucide-react";

import { getFarmerPayments } from "../../services/PaymentServices.js";

const FarmerPayments = () => {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getFarmerPayments();

            setPayments(data.payments || []);
        } catch (error) {
            setError(
                error.message || "Unable to load payments."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const summary = useMemo(() => {
        const pending = payments
            .filter((p) => p.status === "PENDING")
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const paid = payments
            .filter((p) => p.status === "PAID")
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        return {
            pending,
            paid,
            total: payments.length,
        };
    }, [payments]);

    const statusConfig = {
        PENDING: {
            icon: Clock3,
            label: "Pending",
            style: "bg-amber-50 text-amber-700 border-amber-200",
            dot: "bg-amber-500",
        },
        PROCESSING: {
            icon: RefreshCw,
            label: "Processing",
            style: "bg-blue-50 text-blue-700 border-blue-200",
            dot: "bg-blue-500",
        },
        PAID: {
            icon: CheckCircle2,
            label: "Payment Received",
            style: "bg-green-50 text-green-700 border-green-200",
            dot: "bg-green-500",
        },
        FAILED: {
            icon: AlertCircle,
            label: "Failed",
            style: "bg-red-50 text-red-700 border-red-200",
            dot: "bg-red-500",
        },
        REFUNDED: {
            icon: AlertCircle,
            label: "Refunded",
            style: "bg-gray-100 text-gray-600 border-gray-200",
            dot: "bg-gray-500",
        },
    };

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "Date unavailable";
        }

        return parsed.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });
    };

    const getPaymentDate = (payment) => {
        return (
            payment.paidAt ||
            payment.createdAt ||
            payment.updatedAt
        );
    };

    return (
        <div className="min-h-screen bg-[#f6f9f6] text-gray-800">

            {/* Animation styles */}
            <style>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes softPulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .45;
                    }
                }

                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-fade-up {
                    animation: fadeUp .55s ease-out both;
                }

                .pending-pulse {
                    animation: softPulse 1.8s ease-in-out infinite;
                }

                .payment-card {
                    animation: fadeUp .5s ease-out both;
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease,
                        border-color .25s ease;
                }

                .payment-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(15, 23, 42, .07);
                    border-color: #bbf7d0;
                }

                .summary-card {
                    transition: transform .25s ease, box-shadow .25s ease;
                }

                .summary-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 28px rgba(15, 23, 42, .07);
                }

                .skeleton {
                    position: relative;
                    overflow: hidden;
                    background: #e9eee9;
                }

                .skeleton::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,.7),
                        transparent
                    );
                    animation: shimmer 1.5s infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-fade-up,
                    .pending-pulse,
                    .payment-card,
                    .skeleton::after {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Back Button */}
                <button
                    onClick={() => navigate("/farmer/dashboard")}
                    className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-x-1 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                >
                    <ArrowLeft size={17} />
                    Back to Dashboard
                </button>

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center animate-fade-up">

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-sm">
                            <Wallet size={27} />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    Payment Management
                                </h1>

                                <span className="rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700">
                                    Farmer Account
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-gray-500">
                                Monitor your earnings and track every transaction.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={loadPayments}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:border-green-300 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={17}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh Records
                    </button>
                </div>

                {/* Security Notice */}
                <div className="mb-7 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50/70 p-4 animate-fade-up">
                    <ShieldCheck
                        size={21}
                        className="mt-0.5 shrink-0 text-green-700"
                    />

                    <div>
                        <p className="text-sm font-bold text-green-900">
                            Your payment records
                        </p>
                        <p className="mt-1 text-xs leading-5 text-green-800">
                            View payment transactions associated with your accepted deals.
                            Amounts and statuses are retrieved from your KrishiConnect account.
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={18} />
                            {error}
                        </div>

                        <button
                            onClick={loadPayments}
                            className="font-bold underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="mb-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Total */}
                    <div className="summary-card animate-fade-up rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                <Receipt size={22} />
                            </div>

                            <span className="text-xs font-semibold text-gray-400">
                                TRANSACTIONS
                            </span>
                        </div>

                        <p className="mt-5 text-sm font-medium text-gray-500">
                            Total Payment Records
                        </p>

                        <h2 className="mt-1 text-3xl font-extrabold text-gray-900">
                            {summary.total}
                        </h2>

                        <p className="mt-2 text-xs text-gray-400">
                            All recorded transactions
                        </p>
                    </div>

                    {/* Pending */}
                    <div className="summary-card animate-fade-up rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                <Clock3 size={22} />
                            </div>

                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                Pending
                            </span>
                        </div>

                        <p className="mt-5 text-sm font-medium text-gray-500">
                            Pending Amount
                        </p>

                        <h2 className="mt-1 flex items-center text-3xl font-extrabold text-gray-900">
                            <IndianRupee size={25} />
                            {formatAmount(summary.pending)}
                        </h2>

                        <p className="mt-2 text-xs text-amber-600">
                            Awaiting payment completion
                        </p>
                    </div>

                    {/* Paid */}
                    <div className="summary-card animate-fade-up rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                <TrendingUp size={22} />
                            </div>

                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                                Received
                            </span>
                        </div>

                        <p className="mt-5 text-sm font-medium text-gray-500">
                            Total Amount Received
                        </p>

                        <h2 className="mt-1 flex items-center text-3xl font-extrabold text-green-700">
                            <IndianRupee size={25} />
                            {formatAmount(summary.paid)}
                        </h2>

                        <p className="mt-2 text-xs text-green-600">
                            Successfully completed payments
                        </p>
                    </div>
                </div>

                {/* Transaction Heading */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900">
                            Transaction History
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Detailed records of your buyer payments.
                        </p>
                    </div>

                    {!loading && (
                        <span className="text-xs font-semibold text-gray-500">
                            {payments.length} transaction(s) found
                        </span>
                    )}
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-gray-100 bg-white p-5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="skeleton h-12 w-12 rounded-xl" />

                                    <div className="flex-1 space-y-3">
                                        <div className="skeleton h-4 w-32 rounded" />
                                        <div className="skeleton h-3 w-48 rounded" />
                                    </div>

                                    <div className="skeleton h-8 w-28 rounded-lg" />
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="skeleton h-10 rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && payments.length === 0 && (
                    <div className="animate-fade-up rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 text-green-600">
                            <CreditCard size={35} />
                        </div>

                        <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                            No transactions yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Your payment history will appear here when payment
                            records are created for your accepted deals.
                        </p>

                        <button
                            onClick={() => navigate("/farmer/dashboard")}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                        >
                            <ArrowLeft size={16} />
                            Return to Dashboard
                        </button>
                    </div>
                )}

                {/* Transactions */}
                {!loading && payments.length > 0 && (
                    <div className="space-y-4">
                        {payments.map((payment, index) => {
                            const config =
                                statusConfig[payment.status] ||
                                statusConfig.PENDING;

                            const StatusIcon = config.icon;

                            const crop =
                                payment.deal?.produce?.crop || "Produce";

                            const buyer =
                                payment.buyer?.name || "Buyer";

                            const transactionId =
                                payment.razorpayPaymentId ||
                                payment.transactionId ||
                                payment._id;

                            return (
                                <div
                                    key={payment._id}
                                    style={{
                                        animationDelay: `${index * 90}ms`,
                                    }}
                                    className="payment-card rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                >
                                    {/* Transaction Top */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                <Package size={23} />
                                            </div>

                                            <div>
                                                <h3 className="text-base font-extrabold text-gray-900">
                                                    {crop}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Transaction ID:{" "}
                                                    <span className="font-semibold text-gray-600">
                                                        {String(transactionId).slice(-12)}
                                                    </span>
                                                </p>

                                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                                    <User size={15} className="text-gray-400" />
                                                    {buyer}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Amount */}
                                        <div className="sm:text-right">
                                            <p className="text-xs font-medium text-gray-400">
                                                Transaction Amount
                                            </p>

                                            <p className="mt-1 flex items-center text-2xl font-extrabold text-gray-900 sm:justify-end">
                                                <IndianRupee size={21} />
                                                {formatAmount(payment.amount)}
                                            </p>

                                            <p className="mt-1 text-xs font-medium text-gray-400">
                                                {payment.currency || "INR"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-5 border-t border-dashed border-gray-200" />

                                    {/* Transaction Details */}
                                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">

                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <CalendarDays size={14} />
                                                Date
                                            </div>

                                            <p className="mt-2 text-sm font-bold text-gray-700">
                                                {formatDate(getPaymentDate(payment))}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <CreditCard size={14} />
                                                Payment Method
                                            </div>

                                            <p className="mt-2 text-sm font-bold text-gray-700">
                                                {payment.method || "Online Payment"}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <CircleDollarSign size={14} />
                                                Currency
                                            </div>

                                            <p className="mt-2 text-sm font-bold text-gray-700">
                                                {payment.currency || "INR"}
                                            </p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <ShieldCheck size={14} />
                                                Payment Status
                                            </div>

                                            <div
                                                className={`mt-1.5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.style}`}
                                            >
                                                <span
                                                    className={`h-2 w-2 rounded-full ${config.dot} ${
                                                        payment.status === "PENDING"
                                                            ? "pending-pulse"
                                                            : ""
                                                    }`}
                                                />

                                                <StatusIcon size={13} />

                                                {config.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3">
                                        <p className="text-xs text-gray-500">
                                            KrishiConnect Transaction Record
                                        </p>

                                        {payment.status === "PAID" ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700">
                                                <CheckCircle2 size={15} />
                                                Successfully Received
                                            </span>
                                        ) : payment.status === "PENDING" ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                                                <Clock3 size={15} />
                                                Awaiting Completion
                                            </span>
                                        ) : (
                                            <span className="text-xs font-semibold text-gray-500">
                                                {config.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-10 border-t border-gray-200 py-6 text-center">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} KrishiConnect · Farmer Payment Management
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Farmer to Market · Transparent Transactions
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FarmerPayments;
