import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    BookOpen,
    IndianRupee,
    RefreshCw,
    CheckCircle2,
    Clock3,
    RotateCcw,
    Search,
    ArrowUpRight,
} from "lucide-react";

import { getFarmerledger } from "../../services/ledgerServices.js";


const FarmerLedger = () => {
    const [transactions, setTransactions] =
        useState([]);

    const [summary, setSummary] =
        useState({
            totalTransactions: 0,
            totalAmount: 0,
            paidAmount: 0,
            pendingAmount: 0,
            refundedAmount: 0,
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");


    const loadLedger = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getFarmerledger();

            setTransactions(
                data.transactions || []
            );

            setSummary(
                data.summary || {
                    totalTransactions: 0,
                    totalAmount: 0,
                    paidAmount: 0,
                    pendingAmount: 0,
                    refundedAmount: 0,
                }
            );
        } catch (error) {
            setError(
                error.message ||
                    "Unable to load ledger."
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadLedger();
    }, []);


    const filteredTransactions =
        useMemo(() => {
            const query =
                search.trim().toLowerCase();

            return transactions.filter(
                (transaction) => {
                    const matchesSearch =
                        !query ||
                        transaction.crop
                            ?.toLowerCase()
                            .includes(query) ||
                        transaction.buyer?.name
                            ?.toLowerCase()
                            .includes(query) ||
                        transaction.transactionId
                            ?.toLowerCase()
                            .includes(query);

                    const matchesFilter =
                        filter === "ALL" ||
                        transaction.paymentStatus ===
                            filter;

                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );
        }, [
            transactions,
            search,
            filter,
        ]);


    const statusConfig = {
        PAID: {
            icon: CheckCircle2,
            style:
                "bg-green-50 text-green-700 border-green-200",
        },

        PENDING: {
            icon: Clock3,
            style:
                "bg-amber-50 text-amber-700 border-amber-200",
        },

        PROCESSING: {
            icon: RefreshCw,
            style:
                "bg-blue-50 text-blue-700 border-blue-200",
        },

        REFUNDED: {
            icon: RotateCcw,
            style:
                "bg-gray-50 text-gray-600 border-gray-200",
        },

        FAILED: {
            icon: RotateCcw,
            style:
                "bg-red-50 text-red-700 border-red-200",
        },
    };


    return (
        <div className="min-h-screen bg-[#f7faf7]">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                            <BookOpen size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Ledger
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Track your complete
                                transaction history.
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadLedger}
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


                {/* Summary Cards */}
                <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                        <p className="text-sm text-gray-500">
                            Total Transactions
                        </p>

                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {
                                summary.totalTransactions
                            }
                        </p>

                    </div>


                    <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 shadow-sm">

                        <p className="text-sm text-green-700">
                            Paid
                        </p>

                        <p className="mt-2 flex items-center text-2xl font-bold text-green-800">
                            <IndianRupee size={19} />
                            {
                                summary.paidAmount
                            }
                        </p>

                    </div>


                    <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 shadow-sm">

                        <p className="text-sm text-amber-700">
                            Pending
                        </p>

                        <p className="mt-2 flex items-center text-2xl font-bold text-amber-800">
                            <IndianRupee size={19} />
                            {
                                summary.pendingAmount
                            }
                        </p>

                    </div>


                    <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 shadow-sm">

                        <p className="text-sm text-blue-700">
                            Total Deal Value
                        </p>

                        <p className="mt-2 flex items-center text-2xl font-bold text-blue-800">
                            <IndianRupee size={19} />
                            {
                                summary.totalAmount
                            }
                        </p>

                    </div>

                </div>


                {/* Search + Filter */}
                <div className="mb-5 flex flex-col gap-3 md:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search crop, buyer or transaction..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                        />

                    </div>


                    <select
                        value={filter}
                        onChange={(event) =>
                            setFilter(
                                event.target.value
                            )
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    >
                        <option value="ALL">
                            All Transactions
                        </option>

                        <option value="PAID">
                            Paid
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="PROCESSING">
                            Processing
                        </option>

                        <option value="REFUNDED">
                            Refunded
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>
                    </select>

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
                    filteredTransactions.length ===
                        0 && (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                                <BookOpen
                                    size={30}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-gray-900">
                                No transactions found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                Your financial
                                transactions will
                                appear here after
                                deals and payments
                                are created.
                            </p>

                        </div>
                    )}


                {/* Transactions */}
                {!loading &&
                    filteredTransactions.length >
                        0 && (
                        <div className="space-y-4">

                            {filteredTransactions.map(
                                (transaction) => {
                                    const config =
                                        statusConfig[
                                            transaction
                                                .paymentStatus
                                        ] ||
                                        statusConfig.PENDING;

                                    const StatusIcon =
                                        config.icon;

                                    return (
                                        <div
                                            key={
                                                transaction.id
                                            }
                                            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                                        >

                                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                                {/* Transaction */}
                                                <div className="flex items-start gap-4">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                        <ArrowUpRight
                                                            size={
                                                                21
                                                            }
                                                        />
                                                    </div>

                                                    <div>

                                                        <h3 className="font-bold text-gray-900">
                                                            {
                                                                transaction.crop
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {transaction.quantity}{" "}
                                                            {
                                                                transaction.unit
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-xs text-gray-400">
                                                            {new Date(
                                                                transaction.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* Buyer */}
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Buyer
                                                    </p>

                                                    <p className="mt-1 font-semibold text-gray-800">
                                                        {transaction
                                                            .buyer
                                                            ?.name ||
                                                            "Buyer"}
                                                    </p>

                                                    {transaction
                                                        .buyer
                                                        ?.village && (
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {
                                                                transaction
                                                                    .buyer
                                                                    .village
                                                            }
                                                        </p>
                                                    )}
                                                </div>


                                                {/* Amount */}
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Amount
                                                    </p>

                                                    <p className="mt-1 flex items-center text-xl font-bold text-gray-900">
                                                        <IndianRupee
                                                            size={
                                                                17
                                                            }
                                                        />

                                                        {
                                                            transaction.amount
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
                                                        transaction.paymentStatus
                                                    }
                                                </div>

                                            </div>


                                            {/* Transaction Details */}
                                            <div className="mt-5 grid gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">

                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Payment Method
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-700">
                                                        {
                                                            transaction.paymentMethod
                                                        }
                                                    </p>
                                                </div>


                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Transaction ID
                                                    </p>

                                                    <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                                                        {
                                                            transaction.transactionId ||
                                                            "Not available"
                                                        }
                                                    </p>
                                                </div>


                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Paid At
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-700">
                                                        {transaction.paidAt
                                                            ? new Date(
                                                                  transaction.paidAt
                                                              ).toLocaleString()
                                                            : "Not paid"}
                                                    </p>
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

export default FarmerLedger;