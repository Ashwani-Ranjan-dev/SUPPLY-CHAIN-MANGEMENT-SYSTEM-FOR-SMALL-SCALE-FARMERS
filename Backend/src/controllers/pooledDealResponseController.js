
import mongoose from "mongoose";
import PooledDeal from "../models/PooledDealSchema.js";
import createNotification from "../utils/createNotification.js";
import PooledLot from "../models/PooledLotSchema.js";

// @desc    Respond to a pooled deal contribution
// @route   PATCH /api/pooled-deals/:id/respond
// @access  Private - FARMER
export const respondToPooledDeal = async (req, res) => {
    try {
        if (req.user.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can respond to pooled deals.",
            });
        }

        const { id } = req.params;
        const { response } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pooled deal ID.",
            });
        }

        if (!["ACCEPTED", "REJECTED"].includes(response)) {
            return res.status(400).json({
                success: false,
                message: "Response must be ACCEPTED or REJECTED.",
            });
        }

        const pooledDeal = await PooledDeal.findById(id);

        if (!pooledDeal) {
            return res.status(404).json({
                success: false,
                message: "Pooled deal not found.",
            });
        }

        if (pooledDeal.status !== "PENDING") {
            return res.status(409).json({
                success: false,
                message: "This pooled deal is no longer awaiting responses.",
            });
        }

        // Find only this farmer's contribution.
        const contribution = pooledDeal.contributions.find(
            (item) => item.farmer.toString() === req.user._id.toString()
        );

        if (!contribution) {
            return res.status(403).json({
                success: false,
                message: "You are not a contributing farmer in this pooled deal.",
            });
        }

        if (contribution.responseStatus !== "PENDING") {
            return res.status(409).json({
                success: false,
                message: "You have already responded to this offer.",
            });
        }

        contribution.responseStatus = response;

        // One rejection rejects the pooled offer.
        if (response === "REJECTED") {
            pooledDeal.status = "REJECTED";

            pooledDeal.contributions.forEach((item) => {
                if (item.responseStatus === "PENDING") {
                    item.responseStatus = "REJECTED";
                }
            });
        }
        else {
            // Accept only when every farmer has accepted.
            const allAccepted = pooledDeal.contributions.every(
                (item) => item.responseStatus === "ACCEPTED"
            );

            if (allAccepted) {
                pooledDeal.status = "ACCEPTED";

                await PooledLot.findOneAndUpdate(
                    {
                        _id: pooledDeal.pooledLot,
                        status: "OPEN",
                    },
                    {
                        $set: { status: "COMMITTED" },
                    }
                );
            }
        }

        await pooledDeal.save();

        // Notify the buyer of the response.
        try {
            await createNotification({
                recipient: pooledDeal.buyer,
                type: "DEAL_RESPONSE",
                title: "Pooled offer update",
                message:
                    pooledDeal.status === "ACCEPTED"
                        ? "All contributing farmers accepted your pooled offer."
                        : pooledDeal.status === "REJECTED"
                            ? "A contributing farmer rejected your pooled offer."
                            : "A contributing farmer accepted your pooled offer. Other responses are pending.",
                entityType: "SYSTEM",
                entityId: pooledDeal._id,
            });
        } catch (notificationError) {
            console.error(
                "Pooled deal notification failed:",
                notificationError.message
            );
        }

        return res.status(200).json({
            success: true,
            message:
                pooledDeal.status === "ACCEPTED"
                    ? "All farmers accepted. The pooled deal is accepted."
                    : pooledDeal.status === "REJECTED"
                        ? "The pooled deal has been rejected."
                        : "Your response was recorded. Waiting for other farmers.",
            data: pooledDeal,
        });
    } catch (error) {
        console.error("Respond to pooled deal error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to process farmer response.",
        });
    }
};
