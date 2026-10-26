import MarketPrice from "../models/MarketPriceSchema.js";
import { fetchMandiPrices } from "../services/mandiPriceApi.js";

// Controller to get the Market price
export const getMarketPrice = async(
    req,
    res
) =>{
    try{
        const prices = await MarketPrice.find()
                        .sort({
                            updatedAt  : -1,
                        });

        return res.status(200).json({
            success : true,
            count : prices.length,
            prices,
        });
    }catch(error){
        console.error(
            "Get Market prices error : ",
            error
        );

        return res.status(500).json({
            success : false,
            message : "Unable to load the market price."
        });
    }
}

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
        const {
            state,
            commodity,
            market,
        } = req.body || {};

        const { records, total } =
            await fetchMandiPrices({
                limit: 1000,
                offset: 0,
                state,
                commodity,
                market,
            });

        const operations = [];

        for (const record of records) {
            const crop = String(
                record.commodity || ""
            ).trim();

            const marketName = String(
                record.market || ""
            ).trim();

            const stateName = String(
                record.state || ""
            ).trim();

            const district = String(
                record.district || ""
            ).trim();

            const minPrice = Number(record.min_price);
            const maxPrice = Number(record.max_price);
            const modalPrice = Number(record.modal_price);

            const priceDate = parseArrivalDate(
                record.arrival_date
            );

            if (
                !crop ||
                !marketName ||
                !priceDate ||
                !Number.isFinite(minPrice) ||
                !Number.isFinite(maxPrice) ||
                !Number.isFinite(modalPrice) ||
                minPrice < 0 ||
                maxPrice < minPrice ||
                modalPrice < minPrice ||
                modalPrice > maxPrice
            ) {
                continue;
            }

            const location = [
                district,
                stateName,
            ].filter(Boolean).join(", ");

            const variety = String(
                record.variety || ""
            ).trim();

            const grade = String(
                record.grade || ""
            ).trim();

            operations.push({
                updateOne: {
                    filter: {
                        crop,
                        market: marketName,
                        location,
                        priceDate,
                        variety,
                        grade,
                        source: "DATA_GOV_IN",
                    },

                    update: {
                        $set: {
                            crop,
                            market: marketName,
                            location,
                            state: stateName,
                            district,
                            variety,
                            grade,
                            unit: "QUINTAL",
                            minPrice,
                            maxPrice,
                            modalPrice,
                            priceDate,
                            source: "DATA_GOV_IN",
                        },
                    },

                    upsert: true,
                },
            });
        }

        let result = {
            upsertedCount: 0,
            modifiedCount: 0,
        };

        if (operations.length > 0) {
            result = await MarketPrice.bulkWrite(
                operations,
                { ordered: false }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Mandi price synchronization completed.",
            source: "DATA_GOV_IN",
            recordsReceived: records.length,
            recordsValidated: operations.length,
            totalAvailable: total,
            inserted: result.upsertedCount || 0,
            updated: result.modifiedCount || 0,
        });
    } catch (error) {
        console.error(
            "Sync market prices error:",
            error.message
        );

        return res.status(502).json({
            success: false,
            message:
                "Unable to synchronize mandi prices. Check the API key, resource ID, and government API availability.",
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
