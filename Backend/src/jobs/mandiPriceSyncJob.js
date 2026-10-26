import cron from "node-cron";
import { runMandiPriceSync } from "../services/mandiPriceSyncManager.js";

export const startMandiPriceSyncJob = () => {
    const schedule =
        process.env.MANDI_PRICE_SYNC_CRON || "30 8 * * *";

    if (!cron.validate(schedule)) {
        throw new Error(
            `Invalid MANDI_PRICE_SYNC_CRON expression: ${schedule}`
        );
    }

    cron.schedule(
        schedule,
        async () => {
            console.log(
                `[Mandi Sync] Scheduled run triggered at ${new Date().toISOString()}`
            );

            try {
                const result = await runMandiPriceSync({
                    limit: 1000,
                    offset: 0,
                    source: "SCHEDULED",
                });

                console.log(
                    "[Mandi Sync] Scheduled run completed:",
                    result
                );
            } catch (error) {
                if (error.code === "SYNC_IN_PROGRESS") {
                    console.warn(
                        "[Mandi Sync] Scheduled run skipped: another sync is already running."
                    );
                    return;
                }

                console.error(
                    "[Mandi Sync] Scheduled run failed:",
                    error.message
                );
            }
        },
        {
            timezone: "Asia/Kolkata",
        }
    );

    console.log(
        `[Mandi Sync] Scheduled with "${schedule}" in Asia/Kolkata timezone`
    );
};