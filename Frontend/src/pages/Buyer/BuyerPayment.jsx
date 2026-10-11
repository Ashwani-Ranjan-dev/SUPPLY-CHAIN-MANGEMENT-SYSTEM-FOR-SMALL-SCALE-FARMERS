
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    CreditCard,
    Search,
    RefreshCw,
    IndianRupee,
    CheckCircle2,
    Clock3,
    XCircle,
    RotateCcw,
    AlertCircle,
    ReceiptText,
} from "lucide-react";

import { getBuyerPayments } from "../../services/buyerServices";

const statusStyles = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    FAILED: "bg-red-100 text-red-700",
    REFUNDED: "bg-purple-100 text-purple-700",
};

const formatCurrency = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const BuyerPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getBuyerPayments();
            setPayments(data.payments || []);
        } catch (err) {
            setError(err.message || "Unable to load payment history.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const filteredPayments = useMemo(() => {
        const query = search.trim().toLowerCase();

        return payments.filter((payment) => {
            const farmerName = payment.farmer?.name || "";
            const cropName = payment.deal?.produce?.crop || "";
            const transactionId =
                payment.transactionId ||
                payment.razorpayPaymentId ||
                payment.razorpayOrderId ||
                "";

            const matchesSearch =
                !query ||
                farmerName.toLowerCase().includes(query) ||
                cropName.toLowerCase().includes(query) ||
                transactionId.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "ALL" || payment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [payments, search, statusFilter]);

    const summary = useMemo(() => {
        const paidPayments = payments.filter(
            (payment) => payment.status === "PAID"
        );

        return {
            total: payments.length,
            paid: paidPayments.length,
            paidAmount: paidPayments.reduce(
                (sum, payment) => sum + Number(payment.amount || 0),
                0
            ),
            pending: payments.filter(
                (payment) =>
                    payment.status === "PENDING" ||
                    payment.status === "PROCESSING"
            ).length,
        };
    }, [payments]);

    const summaryCards = [
        {
            label: "Total Transactions",
            value: summary.total,
            icon: ReceiptText,
            iconClass: "bg-blue-50 text-blue-700",
        },
        {
            label: "Successful Payments",
            value: summary.paid,
            icon: CheckCircle2,
            iconClass: "bg-green-50 text-green-700",
        },
        {
            label: "Amount Paid",
            value: formatCurrency(summary.paidAmount),
            icon: IndianRupee,
            iconClass: "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Pending Payments",
            value: summary.pending,
            icon: Clock3,
            iconClass: "bg-amber-50 text-amber-700",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold text-green-700">
                        BUYER ACCOUNT
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Payment History
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Review your payments and transaction records.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchPayments}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3 text-red-700">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">
                                Unable to load payments
                            </p>
                            <p className="mt-1 text-sm">{error}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={fetchPayments}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-gray-500">
                                    {card.label}
                                </p>
                                <span className={`rounded-xl p-2.5 ${card.iconClass}`}>
                                    <Icon size={20} />
                                </span>
                            </div>

                            <p className="mt-4 break-words text-2xl font-bold text-gray-900">
                                {loading ? "—" : card.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Transactions
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {loading
                                ? "Loading records..."
                                : `${filteredPayments.length} transaction(s) shown`}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search crop, farmer, ID..."
                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-green-600 sm:w-64"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-green-600"
                        >
                            <option value="ALL">All statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="PAID">Paid</option>
                            <option value="FAILED">Failed</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3 p-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-20 animate-pulse rounded-xl bg-gray-100"
                            />
                        ))}
                    </div>
                ) : filteredPayments.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <CreditCard
                            size={42}
                            className="mx-auto text-gray-300"
                        />
                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            {payments.length === 0
                                ? "No payments yet"
                                : "No matching transactions"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                            {payments.length === 0
                                ? "Your payment records will appear here after a deal has been accepted and a payment record is created."
                                : "Try changing the search term or status filter."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredPayments.map((payment) => {
                            const status = payment.status || "PENDING";
                            const crop = payment.deal?.produce?.crop || "Produce";
                            const farmer = payment.farmer?.name || "Farmer";
                            const transactionId =
                                payment.transactionId ||
                                payment.razorpayPaymentId ||
                                payment.razorpayOrderId;

                            const StatusIcon =
                                status === "PAID"
                                    ? CheckCircle2
                                    : status === "FAILED"
                                      ? XCircle
                                      : status === "REFUNDED"
                                        ? RotateCcw
                                        : Clock3;

                            return (
                                <article
                                    key={payment._id}
                                    className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div className="rounded-xl bg-green-50 p-3 text-green-700">
                                            <CreditCard size={22} />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900">
                                                {crop}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Farmer: {farmer}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {formatDate(
                                                    payment.paidAt || payment.createdAt
                                                )}
                                            </p>

                                            {transactionId && (
                                                <p className="mt-2 break-all text-xs text-gray-400">
                                                    Transaction ID: {transactionId}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                                        <div className="sm:text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                {formatCurrency(
                                                    payment.amount,
                                                    payment.currency
                                                )}
                                            </p>

                                            <span
                                                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                    statusStyles[status] ||
                                                    "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                <StatusIcon size={14} />
                                                {status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default BuyerPayments;
