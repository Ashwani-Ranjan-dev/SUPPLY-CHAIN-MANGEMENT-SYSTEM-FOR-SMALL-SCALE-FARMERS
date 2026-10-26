
import { useCallback, useEffect, useState } from "react";
import {
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    Clock3,
    CloudDownload,
    LoaderCircle,
} from "lucide-react";

import {
    getMandiSyncStatus,
    syncMandiPrices,
} from "../services/MarketPriceServices.js";

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

const MandiSyncStatus = ({ onSyncSuccess }) => {
    const [syncInfo, setSyncInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");

    const loadSyncStatus = useCallback(async () => {
        try {
            setError("");

            const data = await getMandiSyncStatus();

            setSyncInfo(data.lastSync || null);
        } catch (err) {
            setError(
                err.message ||
                    "Unable to load synchronization status."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSyncStatus();
    }, [loadSyncStatus]);

    const handleSync = async () => {
        if (syncing) return;

        setSyncing(true);
        setError("");

        try {
            await syncMandiPrices();

            await loadSyncStatus();

            if (onSyncSuccess) {
                await onSyncSuccess();
            }
        } catch (err) {
            // Reload the persisted status first.
            await loadSyncStatus();

            // Then display the sync error.
            setError(
                err.message ||
                    "Synchronization failed. Please try again later."
            );
        } finally {
            setSyncing(false);
        }
    };

    const status = syncInfo?.status || "NEVER_RUN";

    const statusStyles = {
        NEVER_RUN: {
            label: "Not synced yet",
            className: "bg-gray-100 text-gray-700",
            icon: Clock3,
        },
        RUNNING: {
            label: "Sync in progress",
            className: "bg-blue-100 text-blue-700",
            icon: RefreshCw,
        },
        SUCCESS: {
            label: "Last sync successful",
            className: "bg-green-100 text-green-700",
            icon: CheckCircle2,
        },
        FAILED: {
            label: "Last sync failed",
            className: "bg-red-100 text-red-700",
            icon: AlertCircle,
        },
    };

    const currentStatus =
        statusStyles[status] || statusStyles.NEVER_RUN;

    const StatusIcon = currentStatus.icon;

    return (
        <section className="mb-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                        <CloudDownload size={24} />
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Government Mandi Data
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Check the latest synchronization status
                            of mandi prices.
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${currentStatus.className}`}
                            >
                                <StatusIcon
                                    size={14}
                                    className={
                                        status === "RUNNING"
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                {currentStatus.label}
                            </span>

                            {syncInfo?.source && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                    Source: {syncInfo.source}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSync}
                    disabled={syncing || loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {syncing ? (
                        <LoaderCircle
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <RefreshCw size={18} />
                    )}

                    {syncing ? "Syncing..." : "Sync Mandi Prices"}
                </button>
            </div>

            {/* Last Synchronization Timestamps */}
            <div className="mt-5 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Last started
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                        {loading
                            ? "Loading..."
                            : formatDate(syncInfo?.startedAt)}
                    </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Last completed
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                        {loading
                            ? "Loading..."
                            : formatDate(syncInfo?.finishedAt)}
                    </p>
                </div>
            </div>

            {/* Synchronization Result Metrics */}
            {syncInfo?.result && status === "SUCCESS" && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        {
                            label: "Records received",
                            value: syncInfo.result.recordsReceived,
                        },
                        {
                            label: "Validated",
                            value: syncInfo.result.recordsValidated,
                        },
                        {
                            label: "Inserted",
                            value: syncInfo.result.inserted,
                        },
                        {
                            label: "Updated",
                            value: syncInfo.result.updated,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl border border-gray-100 p-3"
                        >
                            <p className="text-xs text-gray-500">
                                {item.label}
                            </p>

                            <p className="mt-1 text-xl font-bold text-gray-900">
                                {item.value ?? 0}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Current Synchronization Error */}
            {error && (
                <div
                    role="alert"
                    className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="font-semibold">
                            Synchronization could not be completed
                        </p>

                        <p className="mt-1 break-words">
                            {error}
                        </p>

                        <p className="mt-2 text-xs">
                            Your existing database records are not
                            automatically deleted when a sync fails.
                        </p>
                    </div>
                </div>
            )}

            {/* Previous Synchronization Error */}
            {status === "FAILED" && syncInfo?.error && !error && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-semibold">
                        Previous synchronization error
                    </p>

                    <p className="mt-1 break-words">
                        {syncInfo.error}
                    </p>
                </div>
            )}

            {/* Next Retry Permitted */}
            {syncInfo?.nextAttemptAt && status === "FAILED" && (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-semibold">
                        Next retry permitted
                    </p>

                    <p className="mt-1">
                        {formatDate(syncInfo.nextAttemptAt)}
                    </p>

                    <p className="mt-1 text-xs">
                        The sync service will wait until this time
                        before accepting another synchronization
                        attempt.
                    </p>
                </div>
            )}

            {/* Scheduled Synchronization Information */}
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                <Clock3 size={15} className="mt-0.5 shrink-0" />

                <p>
                    Scheduled synchronization runs according to
                    your backend cron configuration. A successful
                    request is required before new government
                    prices are considered synchronized.
                </p>
            </div>
        </section>
    );
};

export default MandiSyncStatus;
