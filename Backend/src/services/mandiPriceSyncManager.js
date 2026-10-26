import MandiSyncStatus from "../models/MandiSyncStatus.js";
import { syncMandiPrices } from "./mandiPriceSyncService.js";

const STATUS_KEY = "GLOBAL";

// Prevent concurrent requests within this backend process.
let isRunning = false;

// Cooldown starts at 15 minutes and doubles after consecutive failures,
// up to a maximum of 6 hours.
const INITIAL_COOLDOWN_MS = 15 * 60 * 1000;
const MAX_COOLDOWN_MS = 6 * 60 * 60 * 1000;

const getCooldownMs = (failureCount) => {
    const exponent = Math.max(0, failureCount - 1);

    return Math.min(
        INITIAL_COOLDOWN_MS * 2 ** exponent,
        MAX_COOLDOWN_MS
    );
};

const persistStatus = async (values) => {
    return MandiSyncStatus.findOneAndUpdate(
        { key: STATUS_KEY },
        {
            $set: values,
            $setOnInsert: { key: STATUS_KEY },
        },
        {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        }
    );
};

export const getMandiSyncStatus = async () => {
    const saved = await MandiSyncStatus
        .findOne({ key: STATUS_KEY })
        .lean();

    return {
        isRunning,
        lastSync: saved
            ? {
                  status: saved.status,
                  startedAt: saved.startedAt,
                  finishedAt: saved.finishedAt,
                  source: saved.source,
                  result: saved.result,
                  error: saved.error,
                  failureCount: saved.failureCount ?? 0,
                  nextAttemptAt: saved.nextAttemptAt ?? null,
              }
            : {
                  status: "NEVER_RUN",
                  startedAt: null,
                  finishedAt: null,
                  source: null,
                  result: null,
                  error: null,
                  failureCount: 0,
                  nextAttemptAt: null,
              },
    };
};

export const runMandiPriceSync = async ({
    state,
    commodity,
    market,
    limit = 1000,
    offset = 0,
    source = "MANUAL",
} = {}) => {
    if (!["MANUAL", "SCHEDULED"].includes(source)) {
        throw new Error("Invalid mandi sync source.");
    }

    if (isRunning) {
        const error = new Error(
            "A mandi-price synchronization is already running."
        );
        error.code = "SYNC_IN_PROGRESS";
        throw error;
    }

    // Read persisted cooldown before contacting the external API.
    const previous = await MandiSyncStatus
        .findOne({ key: STATUS_KEY })
        .lean();

    const now = new Date();
    const nextAttemptAt = previous?.nextAttemptAt
        ? new Date(previous.nextAttemptAt)
        : null;

    if (nextAttemptAt && nextAttemptAt > now) {
        const error = new Error(
            `Mandi sync is temporarily paused after a previous failure. ` +
            `Try again after ${nextAttemptAt.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
            })}.`
        );

        error.code = "SYNC_COOLDOWN";
        error.nextAttemptAt = nextAttemptAt;

        throw error;
    }

    isRunning = true;

    const startedAt = new Date();
    const previousFailureCount = previous?.failureCount ?? 0;

    try {
        await persistStatus({
            status: "RUNNING",
            startedAt,
            finishedAt: null,
            source,
            result: null,
            error: null,
            nextAttemptAt: null,
        });

        const result = await syncMandiPrices({
            state,
            commodity,
            market,
            limit,
            offset,
        });

        await persistStatus({
            status: "SUCCESS",
            startedAt,
            finishedAt: new Date(),
            source,
            result,
            error: null,
            failureCount: 0,
            nextAttemptAt: null,
        });

        return result;
    } catch (error) {
        const failureCount = previousFailureCount + 1;
        const cooldownMs = getCooldownMs(failureCount);
        const retryAt = new Date(Date.now() + cooldownMs);

        try {
            await persistStatus({
                status: "FAILED",
                startedAt,
                finishedAt: new Date(),
                source,
                result: null,
                error: error.message || "Unknown synchronization error.",
                failureCount,
                nextAttemptAt: retryAt,
            });

            console.warn(
                `[Mandi Sync] Failure ${failureCount}. ` +
                `Next attempt permitted after ${retryAt.toISOString()}.`
            );
        } catch (statusError) {
            console.error(
                "[Mandi Sync] Could not persist failure status:",
                statusError.message
            );
        }

        throw error;
    } finally {
        isRunning = false;
    }
};