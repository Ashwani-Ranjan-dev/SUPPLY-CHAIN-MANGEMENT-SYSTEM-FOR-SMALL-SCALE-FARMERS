
import crypto from "node:crypto";
import mongoose from "mongoose";

import {
    LedgerEntry,
    LedgerCounter,
} from "../models/LedgerEntrySchema.js";

const GENESIS_HASH = "GENESIS";

/**
 * Recursively sort object keys so the same event data
 * always produces the same JSON representation.
 */
const canonicalize = (value) => {
    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.map(canonicalize);
    }

    if (
        value !== null &&
        typeof value === "object"
    ) {
        return Object.keys(value)
            .sort()
            .reduce((result, key) => {
                result[key] = canonicalize(value[key]);
                return result;
            }, {});
    }

    return value;
};

/**
 * Calculate SHA-256 from the fields protected by the chain.
 */
export const calculateLedgerHash = (entry) => {
    const hashPayload = {
        sequence: entry.sequence,
        eventType: entry.eventType,
        entityType: entry.entityType,
        entityId: String(entry.entityId),
        dealId: entry.dealId
            ? String(entry.dealId)
            : null,
        paymentId: entry.paymentId
            ? String(entry.paymentId)
            : null,
        deliveryId: entry.deliveryId
            ? String(entry.deliveryId)
            : null,
        actor: String(entry.actor),
        details: entry.details ?? {},
        occurredAt: new Date(
            entry.occurredAt
        ).toISOString(),
        previousHash: entry.previousHash,
    };

    return crypto
        .createHash("sha256")
        .update(JSON.stringify(canonicalize(hashPayload)))
        .digest("hex");
};

/**
 * Append an event to the global ledger.
 *
 * All writers must use this function. Do not insert
 * LedgerEntry documents directly from controllers.
 */
export const recordLedgerEvent = async ({
    eventType,
    entityType,
    entityId,
    dealId = null,
    paymentId = null,
    deliveryId = null,
    actor,
    details = {},
}) => {
    if (
        !eventType ||
        !entityType ||
        !entityId ||
        !actor
    ) {
        throw new Error(
            "Ledger event type, entity type, entity ID, and actor are required."
        );
    }

    if (!mongoose.Types.ObjectId.isValid(actor)) {
        throw new Error("Invalid ledger actor ID.");
    }

    if (!mongoose.Types.ObjectId.isValid(entityId)) {
        throw new Error("Invalid ledger entity ID.");
    }

    // Validate linked IDs when supplied.
    for (const [name, id] of Object.entries({
        dealId,
        paymentId,
        deliveryId,
    })) {
        if (
            id &&
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            throw new Error(`Invalid ${name}.`);
        }
    }

    // Ensure the global counter exists.
    await LedgerCounter.updateOne(
        { _id: "global" },
        { $setOnInsert: { sequence: 0 } },
        { upsert: true }
    );

    const session = await mongoose.startSession();
    let savedEntry;

    try {
        await session.withTransaction(async () => {
            // Updating the same counter serializes chain writers.
            const counter = await LedgerCounter.findOne({
                _id: "global",
            }).session(session);

            if (!counter) {
                throw new Error(
                    "Ledger counter is missing."
                );
            }

            counter.sequence += 1;
            await counter.save({ session });

            const previousEntry =
                await LedgerEntry.findOne()
                    .sort({ sequence: -1 })
                    .session(session);

            const previousHash = previousEntry
                ? previousEntry.recordHash
                : GENESIS_HASH;

            const entryData = {
                sequence: counter.sequence,
                eventType,
                entityType,
                entityId,
                dealId,
                paymentId,
                deliveryId,
                actor,
                details,
                occurredAt: new Date(),
                previousHash,
            };

            const recordHash =
                calculateLedgerHash(entryData);

            const [created] = await LedgerEntry.create(
                [
                    {
                        ...entryData,
                        recordHash,
                    },
                ],
                { session }
            );

            savedEntry = created;
        });

        return savedEntry;
    } finally {
        await session.endSession();
    }
};

export { GENESIS_HASH };


// Verify the complete SHA-256 hash chain without modifying any records.
export const verifyLedgerIntegrity = async () => {
    const entries = await LedgerEntry.find()
        .sort({ sequence: 1 })
        .lean();

    // An empty ledger is intact, but it contains no events to verify.
    if (entries.length === 0) {
        return {
            valid: true,
            checkedEntries: 0,
            verifiedAt: new Date(),
            message: "No ledger events exist yet.",
            failure: null,
        };
    }

    let expectedSequence = 1;
    let expectedPreviousHash = GENESIS_HASH;

    for (const entry of entries) {
        // 1. Ensure no sequence numbers are missing or duplicated.
        if (entry.sequence !== expectedSequence) {
            return {
                valid: false,
                checkedEntries: expectedSequence - 1,
                verifiedAt: new Date(),
                message: "Ledger sequence is broken.",
                failure: {
                    sequence: entry.sequence,
                    entryId: String(entry._id),
                    reason: `Expected sequence ${expectedSequence}, found ${entry.sequence}.`,
                },
            };
        }

        // 2. Ensure this entry links to the preceding entry.
        if (entry.previousHash !== expectedPreviousHash) {
            return {
                valid: false,
                checkedEntries: expectedSequence - 1,
                verifiedAt: new Date(),
                message: "Previous-hash link does not match.",
                failure: {
                    sequence: entry.sequence,
                    entryId: String(entry._id),
                    reason: "The previousHash does not match the preceding record's hash.",
                },
            };
        }

        // 3. Recalculate the entry's SHA-256 hash from its stored contents.
        let recalculatedHash;

        try {
            recalculatedHash = calculateLedgerHash(entry);
        } catch (error) {
            return {
                valid: false,
                checkedEntries: expectedSequence - 1,
                verifiedAt: new Date(),
                message: "Unable to recalculate a ledger hash.",
                failure: {
                    sequence: entry.sequence,
                    entryId: String(entry._id),
                    reason: "The entry contains invalid or unsupported hash data.",
                },
            };
        }

        // 4. Compare the recalculated hash with the stored hash.
        if (recalculatedHash !== entry.recordHash) {
            return {
                valid: false,
                checkedEntries: expectedSequence - 1,
                verifiedAt: new Date(),
                message: "Ledger entry content has changed or its hash is invalid.",
                failure: {
                    sequence: entry.sequence,
                    entryId: String(entry._id),
                    reason: "The recalculated hash does not match recordHash.",
                },
            };
        }

        // The next entry must point to this entry's stored hash.
        expectedPreviousHash = entry.recordHash;
        expectedSequence += 1;
    }

    return {
        valid: true,
        checkedEntries: entries.length,
        verifiedAt: new Date(),
        message: "All ledger entries and hash links are valid.",
        failure: null,
    };
};