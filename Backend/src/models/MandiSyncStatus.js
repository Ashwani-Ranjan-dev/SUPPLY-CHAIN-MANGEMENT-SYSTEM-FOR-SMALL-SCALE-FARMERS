
import mongoose from "mongoose";

const mandiSyncStatusSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            default: "GLOBAL",
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["NEVER_RUN", "RUNNING", "SUCCESS", "FAILED"],
            default: "NEVER_RUN",
            required: true,
        },
        startedAt: {
            type: Date,
            default: null,
        },
        finishedAt: {
            type: Date,
            default: null,
        },
        source: {
            type: String,
            enum: ["MANUAL", "SCHEDULED"],
            default: null,
        },
        result: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        error: {
            type: String,
            default: null,
        },
        failureCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        nextAttemptAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const MandiSyncStatus =
    mongoose.models.MandiSyncStatus ||
    mongoose.model("MandiSyncStatus", mandiSyncStatusSchema);

export default MandiSyncStatus;
