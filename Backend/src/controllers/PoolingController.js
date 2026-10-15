import mongoose from "mongoose";
import PooledLot from "../models/PooledLotSchema.js";
import { createEligiblePooledLots } from "../services/PoolingServices.js";

// Generate pooled lots from eligible active produce.
export const generatePooledLots = async (req, res) => {
    try {
        if (req.user?.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can request pooled lot generation.",
            });
        }

        const windowDays = req.body?.windowDays ?? 3;

        if (
            !Number.isInteger(windowDays) ||
            windowDays < 1 ||
            windowDays > 30
        ) {
            return res.status(400).json({
                success: false,
                message: "windowDays must be an integer between 1 and 30.",
            });
        }

        const pooledLots = await createEligiblePooledLots({
            windowDays,
        });

        return res.status(201).json({
            success: true,
            message:
                pooledLots.length > 0
                    ? "Pooled lots generated successfully."
                    : "No compatible produce listings are currently available.",
            count: pooledLots.length,
            data: pooledLots,
        });
    } catch (error) {
        console.error("Generate pooled lots error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to generate pooled lots.",
        });
    }
};

// Retrieve open pooled lots for buyers to browse.
export const getOpenPooledLots = async (req, res) => {
    try {
        if (req.user?.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can view pooled lots.",
            });
        }

        const pooledLots = await PooledLot.find({
            status: "OPEN",
        })
            .populate({
                path: "listings.produce",
                select: "crop quantity unit expectedPrice location quality availableFrom status",
            })
            .populate({
                path: "listings.farmer",
                select: "name village",
            })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: pooledLots.length,
            data: pooledLots,
        });
    } catch (error) {
        console.error("Get open pooled lots error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve pooled lots.",
        });
    }
};


// Add this function to poolingController.js.
// Keep your existing imports and controllers.
export const getPooledLotById = async (req, res) => {
    try {
        if (req.user?.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can view pooled lot details.",
            });
        }

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pooled lot ID.",
            });
        }

        const pooledLot = await PooledLot.findOne({
            _id: id,
            status: "OPEN",
        })
            .populate({
                path: "listings.produce",
                select: "crop quantity unit expectedPrice location quality availableFrom status",
            })
            .populate({
                path: "listings.farmer",
                select: "name village",
            })
            .lean();

        if (!pooledLot) {
            return res.status(404).json({
                success: false,
                message: "Open pooled lot not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: pooledLot,
        });
    } catch (error) {
        console.error("Get pooled lot details error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve pooled lot details.",
        });
    }
};
