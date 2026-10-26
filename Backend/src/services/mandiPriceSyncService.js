import MarketPrice from "../models/MarketPriceSchema.js";
import { fetchMandiPrices } from "./mandiPriceApi.js";

const MAX_PAGE_SIZE = 1000;

const parseArrivalDate = (value) => {
    if (!value) return null;

    // Government records commonly use DD/MM/YYYY.
    const match = String(value).match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

    if (match) {
        const [, day, month, year] = match;

        const date = new Date(
            Date.UTC(
                Number(year),
                Number(month) - 1,
                Number(day)
            )
        );

        // Reject invalid calendar dates.
        if (
            date.getUTCDate() !== Number(day) ||
            date.getUTCMonth() !== Number(month) - 1 ||
            date.getUTCFullYear() !== Number(year)
        ) {
            return null;
        }

        return Number.isNaN(date.getTime()) ? null : date;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    // Normalize to midnight UTC.
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        )
    );
};

const parsePrice = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return NaN;
    }

    return Number(String(value).replace(/,/g, "").trim());
};

export const syncMandiPrices = async ({
    state,
    commodity,
    market,
    limit = MAX_PAGE_SIZE,
    offset = 0,
} = {}) => {
    const requestedLimit = Number(limit);
    const startingOffset = Number(offset);

    if (
        !Number.isInteger(requestedLimit) ||
        requestedLimit < 1
    ) {
        throw new Error(
            "Sync limit must be a positive integer."
        );
    }

    if (
        !Number.isInteger(startingOffset) ||
        startingOffset < 0
    ) {
        throw new Error(
            "Sync offset must be a non-negative integer."
        );
    }

    const pageSize = Math.min(
        requestedLimit,
        MAX_PAGE_SIZE
    );

    let currentOffset = startingOffset;
    let totalAvailable = null;

    const records = [];
    let pagesFetched = 0;

    // Fetch every required page before writing anything to MongoDB.
    while (true) {
        console.log(
            `[Mandi Sync] Fetching page at offset ${currentOffset}, ` +
            `limit ${pageSize}.`
        );

        const page = await fetchMandiPrices({
            state,
            commodity,
            market,
            limit: pageSize,
            offset: currentOffset,
        });

        if (
            !page ||
            !Array.isArray(page.records) ||
            !Number.isFinite(page.total) ||
            page.total < 0
        ) {
            throw new Error(
                `Invalid API pagination response at offset ${currentOffset}.`
            );
        }

        pagesFetched++;

        if (totalAvailable === null) {
            totalAvailable = page.total;
        }

        // No more records are available.
        if (page.records.length === 0) {
            if (currentOffset < totalAvailable) {
                throw new Error(
                    `Incomplete mandi sync: API reported ` +
                    `${totalAvailable} records but returned no records ` +
                    `at offset ${currentOffset}. No database writes were made.`
                );
            }

            break;
        }

        records.push(...page.records);
        currentOffset += page.records.length;

        console.log(
            `[Mandi Sync] Retrieved ${records.length}` +
            (totalAvailable > 0
                ? ` of ${totalAvailable} reported records.`
                : " records.")
        );

        // All records reported by the API have been fetched.
        if (currentOffset >= totalAvailable) {
            break;
        }
    }

    // Prepare validated database upserts.
    const operations = [];

    for (const record of records) {
        const crop = String(record.commodity || "").trim();
        const marketName = String(record.market || "").trim();
        const stateName = String(record.state || "").trim();
        const district = String(record.district || "").trim();

        const minPrice = parsePrice(record.min_price);
        const maxPrice = parsePrice(record.max_price);
        const modalPrice = parsePrice(record.modal_price);
        const priceDate = parseArrivalDate(record.arrival_date);

        if (
            !crop ||
            !marketName ||
            !stateName ||
            !priceDate ||
            !Number.isFinite(minPrice) ||
            !Number.isFinite(maxPrice) ||
            !Number.isFinite(modalPrice) ||
            minPrice < 0 ||
            maxPrice < 0 ||
            modalPrice < 0 ||
            minPrice > maxPrice
        ) {
            continue;
        }

        const location = [district, stateName]
            .filter(Boolean)
            .join(", ");

        const variety = String(record.variety || "").trim();
        const grade = String(record.grade || "").trim();

        const document = {
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
        };

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
                    $set: document,
                },
                upsert: true,
            },
        });
    }

    // Write only after all requested pages have been fetched successfully.
    const result = operations.length
        ? await MarketPrice.bulkWrite(operations, {
              ordered: false,
          })
        : {
              upsertedCount: 0,
              modifiedCount: 0,
          };

    const summary = {
        recordsReceived: records.length,
        recordsValidated: operations.length,
        totalAvailable,
        pagesFetched,
        inserted: result.upsertedCount || 0,
        updated: result.modifiedCount || 0,
    };

    console.log("[Mandi Sync] Completed:", summary);

    return summary;
};

export { parseArrivalDate };
