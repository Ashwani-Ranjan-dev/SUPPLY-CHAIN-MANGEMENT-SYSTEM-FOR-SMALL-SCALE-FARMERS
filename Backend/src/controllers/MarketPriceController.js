import MarketPrice from "../models/MarketPriceSchema.js";
import {
    runMandiPriceSync,
    getMandiSyncStatus,
} from "../services/mandiPriceSyncManager.js";

// Controller to get the Market price
export const getMarketPrice = async (
    req,
    res
) => {
    try {
        const prices = await MarketPrice.find()
            .sort({
                updatedAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: prices.length,
            prices,
        });
    } catch (error) {
        console.error(
            "Get Market prices error : ",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load the market price.",
        });
    }
};

// Controller for MarketPrice Search
export const searchMarketPrices =
    async (req, res) => {
        try {
            const { crop } = req.query;

            const filter = {};

            if (crop?.trim()) {
                filter.crop = {
                    $regex: crop.trim(),
                    $options: "i",
                };
            }

            const prices =
                await MarketPrice.find(
                    filter
                ).sort({
                    updatedAt: -1,
                });

            return res.status(200).json({
                success: true,
                count: prices.length,
                prices,
            });
        } catch (error) {
            console.error(
                "Search market prices error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Unable to search market prices.",
            });
        }
    };

const parseArrivalDate = (value) => {
    if (!value) return null;

    // Government records commonly use DD/MM/YYYY.
    const match = String(value).match(
        /^(\d{2})\/(\d{2})\/(\d{4})$/
    );

    if (match) {
        const [, day, month, year] = match;

        return new Date(
            Date.UTC(
                Number(year),
                Number(month) - 1,
                Number(day)
            )
        );
    }

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime())
        ? null
        : parsed;
};

export const syncMarketPrices = async (req, res) => {
    try {
        const { state, commodity, market } = req.body || {};

        const result = await runMandiPriceSync({
            state,
            commodity,
            market,
            limit: 1000,
            offset: 0,
            source: "MANUAL",
        });

        return res.status(200).json({
            success: true,
            message: "Mandi price synchronization completed.",
            source: "DATA_GOV_IN",
            ...result,
        });
    }catch (error) {
    if (error.code === "SYNC_IN_PROGRESS") {
        return res.status(409).json({
            success: false,
            code: error.code,
            message: error.message,
        });
    }

    if (error.code === "SYNC_COOLDOWN") {
        return res.status(429).json({
            success: false,
            code: error.code,
            message: error.message,
            nextAttemptAt: error.nextAttemptAt,
        });
    }

    console.error("Mandi price synchronization failed:", error);

    return res.status(502).json({
        success: false,
        message: "Mandi-price synchronization failed.",
        error: error.message,
    });
}
};

// Get the current mandi price synchronization status
export const getMarketPriceSyncStatus = async (req, res) => {
    try {
        const status = await getMandiSyncStatus();

        return res.status(200).json({
            success: true,
            ...status,
        });
    } catch (error) {
        console.error(
            "Get mandi sync status error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load mandi sync status.",
        });
    }
};

export const getMarketPriceHistory = async (req, res) => {
    try {
        const { crop, market, location } = req.query;

        const days = Math.min(
            Math.max(Number.parseInt(req.query.days, 10) || 30, 1),
            90
        );

        if (!crop?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Crop is required.",
            });
        }

        const endDate = new Date();
        const startDate = new Date(endDate);

        startDate.setUTCDate(
            startDate.getUTCDate() - (days - 1)
        );

        startDate.setUTCHours(0, 0, 0, 0);

        const filter = {
            crop: {
                $regex: crop.trim().replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                ),
                $options: "i",
            },
            priceDate: {
                $gte: startDate,
                $lte: endDate,
            },
        };

        if (market?.trim()) {
            filter.market = market.trim();
        }

        if (location?.trim()) {
            filter.location = location.trim();
        }

        const records = await MarketPrice.find(filter)
            .sort({ priceDate: 1, updatedAt: 1 })
            .select(
                "crop market location state district unit minPrice maxPrice modalPrice priceDate source"
            )
            .lean();

        // Keep the most recently updated record for each
        // calendar date, for the selected crop and market.
        const dailyRecords = new Map();

        for (const record of records) {
            const day = record.priceDate
                .toISOString()
                .slice(0, 10);

            dailyRecords.set(day, record);
        }

        const history = Array.from(
            dailyRecords.entries()
        ).map(([date, record]) => ({
            date,
            minPrice: record.minPrice,
            maxPrice: record.maxPrice,
            modalPrice: record.modalPrice,
            market: record.market,
            location: record.location,
            unit: record.unit,
            source: record.source,
        }));

        const first = history[0] || null;
        const last = history[history.length - 1] || null;

        let percentageChange = null;

        if (first && last) {
            if (first.modalPrice !== 0) {
                percentageChange = Number(
                    (
                        ((last.modalPrice - first.modalPrice) /
                            first.modalPrice) *
                        100
                    ).toFixed(2)
                );
            } else if (last.modalPrice === 0) {
                percentageChange = 0;
            }
        }

        const modalPrices = history.map(
            (item) => item.modalPrice
        );

        return res.status(200).json({
            success: true,
            crop: crop.trim(),
            market: market?.trim() || null,
            days,
            count: history.length,
            startDate,
            endDate,
            summary: {
                firstModalPrice: first?.modalPrice ?? null,
                latestModalPrice: last?.modalPrice ?? null,
                percentageChange,
                highestModalPrice: modalPrices.length
                    ? Math.max(...modalPrices)
                    : null,
                lowestModalPrice: modalPrices.length
                    ? Math.min(...modalPrices)
                    : null,
            },
            history,
        });
    } catch (error) {
        console.error(
            "Get market price history error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load market price history.",
        });
    }
};

const escapeRegexForQuery = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Return state names represented in saved market-price records.
export const getMarketPriceStates = async (req, res) => {
    try {
        const records = await MarketPrice.find({})
            .select("state location")
            .lean();

        const states = [
            ...new Set(
                records
                    .map((record) => {
                        if (record.state?.trim()) {
                            return record.state.trim();
                        }

                        // Supports older records that only have location.
                        const location = record.location?.trim();

                        if (!location) return null;

                        const parts = location.split(",");

                        return parts[parts.length - 1].trim() || null;
                    })
                    .filter(Boolean)
            ),
        ].sort((a, b) => a.localeCompare(b));

        return res.status(200).json({
            success: true,
            count: states.length,
            states,
        });
    } catch (error) {
        console.error("Get mandi states error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load available states.",
        });
    }
};

// Search saved mandi prices by state and crop.
export const getCurrentMarketPrices = async (req, res) => {
    try {
        const state = req.query.state?.trim();
        const crop = req.query.crop?.trim();

        if (!state || !crop) {
            return res.status(400).json({
                success: false,
                message: "Both state and crop are required.",
            });
        }

        const escapedState = escapeRegexForQuery(state);
        const escapedCrop = escapeRegexForQuery(crop);

        const filter = {
            crop: {
                $regex: escapedCrop,
                $options: "i",
            },
            $or: [
                {
                    state: {
                        $regex: `^${escapedState}$`,
                        $options: "i",
                    },
                },
                {
                    location: {
                        $regex: `(^|,\\s*)${escapedState}(\\s*,|$)`,
                        $options: "i",
                    },
                },
            ],
        };

        const records = await MarketPrice.find(filter)
            .sort({ priceDate: -1, updatedAt: -1 })
            .select(
                "crop market location state district variety grade unit minPrice maxPrice modalPrice priceDate updatedAt source"
            )
            .lean();

        // Keep the newest available observation for each mandi/variety.
        const seen = new Set();

        const prices = records.filter((record) => {
            const key = [
                record.market || "",
                record.location || "",
                record.variety || "",
                record.grade || "",
            ]
                .join("|")
                .toLowerCase();

            if (seen.has(key)) return false;

            seen.add(key);
            return true;
        });

        return res.status(200).json({
            success: true,
            state,
            crop,
            count: prices.length,
            prices,
        });
    } catch (error) {
        console.error(
            "Search current mandi prices error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to search current mandi prices.",
        });
    }
};
