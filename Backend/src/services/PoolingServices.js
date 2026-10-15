
import Produce from "../models/ProduceSchema.js";
import PooledLot from "../models/PooledLotSchema.js";

const DEFAULT_WINDOW_DAYS = 3;

const normalizeText = (value = "") =>
    value.trim().replace(/\s+/g, " ").toLowerCase();

const getCompatibilityKey = (produce) =>
    [
        normalizeText(produce.crop),
        produce.unit,
        normalizeText(produce.location),
        produce.quality,
    ].join("::");

const getDate = (value) => new Date(value).getTime();

/**
 * Finds active produce listings that are not already included
 * in an OPEN or COMMITTED pooled lot.
 */
export const findEligibleProduce = async () => {
    const existingLots = await PooledLot.find({
        status: { $in: ["OPEN", "COMMITTED"] },
    })
        .select("listings.produce")
        .lean();

    const reservedProduceIds = new Set();

    for (const lot of existingLots) {
        for (const listing of lot.listings || []) {
            reservedProduceIds.add(String(listing.produce));
        }
    }

    const activeProduce = await Produce.find({
        status: "ACTIVE",
        pooledLot: null,
    }).lean();


    return activeProduce.filter(
        (produce) => !reservedProduceIds.has(String(produce._id))
    );
};

/**
 * Groups compatible listings into batches whose earliest and latest
 * availability dates differ by no more than the configured window.
 */
const groupEligibleProduce = (produceList, windowDays) => {
    const compatibleGroups = new Map();

    for (const produce of produceList) {
        const key = getCompatibilityKey(produce);

        if (!compatibleGroups.has(key)) {
            compatibleGroups.set(key, []);
        }

        compatibleGroups.get(key).push(produce);
    }

    const windowMilliseconds =
        windowDays * 24 * 60 * 60 * 1000;

    const pooledGroups = [];

    for (const listings of compatibleGroups.values()) {
        listings.sort(
            (a, b) =>
                getDate(a.availableFrom) - getDate(b.availableFrom)
        );

        let currentGroup = [];

        for (const listing of listings) {
            const listingDate = getDate(listing.availableFrom);

            if (!Number.isFinite(listingDate)) {
                continue;
            }

            if (currentGroup.length === 0) {
                currentGroup.push(listing);
                continue;
            }

            const earliestDate = getDate(
                currentGroup[0].availableFrom
            );

            if (listingDate - earliestDate <= windowMilliseconds) {
                currentGroup.push(listing);
            } else {
                if (currentGroup.length >= 2) {
                    pooledGroups.push(currentGroup);
                }

                // Start a new group with the current listing.
                currentGroup = [listing];
            }
        }

        if (currentGroup.length >= 2) {
            pooledGroups.push(currentGroup);
        }
    }

    return pooledGroups;
};

/**
 * Creates pooled lots without deleting or modifying original
 * produce listings.
 *
 * Returns the newly created pooled lots.
 */
export const createEligiblePooledLots = async ({
    windowDays = DEFAULT_WINDOW_DAYS,
} = {}) => {
    if (
        !Number.isInteger(windowDays) ||
        windowDays < 1 ||
        windowDays > 30
    ) {
        throw new Error(
            "Pooling window must be an integer between 1 and 30 days."
        );
    }

    const eligibleProduce = await findEligibleProduce();

    if (eligibleProduce.length < 2) {
        return [];
    }

    const groups = groupEligibleProduce(
        eligibleProduce,
        windowDays
    );

    const createdLots = [];


    for (const group of groups) {
        const produceIds = group.map((item) => item._id);

        // Build the pooled lot from the current listing snapshots.
        const dates = group.map((item) =>
            new Date(item.availableFrom).getTime()
        );

        let pooledLot;

        try {
            pooledLot = await PooledLot.create({
                crop: group[0].crop.trim(),
                unit: group[0].unit,
                location: group[0].location.trim(),
                quality: group[0].quality,
                listings: group.map((item) => ({
                    produce: item._id,
                    farmer: item.farmer,
                    quantity: item.quantity,
                    expectedPrice: item.expectedPrice,
                })),
                totalQuantity: group.reduce(
                    (total, item) => total + Number(item.quantity),
                    0
                ),
                earliestAvailableFrom: new Date(Math.min(...dates)),
                latestAvailableFrom: new Date(Math.max(...dates)),
                status: "OPEN",
            });

            // Atomically claim only listings that are still active
            // and have not already been assigned to a pooled lot.
            const reservation = await Produce.updateMany(
                {
                    _id: { $in: produceIds },
                    status: "ACTIVE",
                    pooledLot: null,
                },
                {
                    $set: { pooledLot: pooledLot._id },
                }
            );

            if (reservation.modifiedCount !== group.length) {
                // Another request may have claimed one or more listings.
                // Release only claims belonging to this new lot.
                await Produce.updateMany(
                    {
                        _id: { $in: produceIds },
                        pooledLot: pooledLot._id,
                    },
                    {
                        $set: { pooledLot: null },
                    }
                );

                await PooledLot.deleteOne({ _id: pooledLot._id });
                continue;
            }

            createdLots.push(pooledLot);
        } catch (error) {
            // Avoid leaving a partially created lot behind.
            if (pooledLot?._id) {
                await Produce.updateMany(
                    {
                        _id: { $in: produceIds },
                        pooledLot: pooledLot._id,
                    },
                    {
                        $set: { pooledLot: null },
                    }
                );

                await PooledLot.deleteOne({ _id: pooledLot._id });
            }

            throw error;
        }
    }


    return createdLots;
};
