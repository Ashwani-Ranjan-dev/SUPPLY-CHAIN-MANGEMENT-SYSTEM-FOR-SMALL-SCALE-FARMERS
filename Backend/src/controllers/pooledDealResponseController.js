
import mongoose from "mongoose";
import PooledDeal from "../models/PooledDealSchema.js";
import createNotification from "../utils/createNotification.js";
import PooledLot from "../models/PooledLotSchema.js";
import PooledPayment from "../models/PooledPaymentSchema.js";

// @desc    Respond to a pooled deal contribution
// @route   PATCH /api/pooled-deals/:id/respond
// @access  Private - FARMER

export const respondToPooledDeal = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        if (req.user?.role !== "FARMER") {
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

        let updatedDeal;

        await session.withTransaction(async () => {
            const pooledDeal = await PooledDeal.findById(id)
                .session(session);

            if (!pooledDeal) {
                const error = new Error("Pooled deal not found.");
                error.statusCode = 404;
                throw error;
            }

            if (pooledDeal.status !== "PENDING") {
                const error = new Error(
                    "This pooled deal is no longer awaiting responses."
                );
                error.statusCode = 409;
                throw error;
            }

            const contribution = pooledDeal.contributions.find(
                (item) =>
                    item.farmer.toString() ===
                    req.user._id.toString()
            );

            if (!contribution) {
                const error = new Error(
                    "You are not a contributing farmer in this pooled deal."
                );
                error.statusCode = 403;
                throw error;
            }

            if (
                (contribution.responseStatus || "PENDING") !==
                "PENDING"
            ) {
                const error = new Error(
                    "You have already responded to this offer."
                );
                error.statusCode = 409;
                throw error;
            }

            contribution.responseStatus = response;

            if (response === "REJECTED") {
                pooledDeal.status = "REJECTED";

                pooledDeal.contributions.forEach((item) => {
                    if (
                        (item.responseStatus || "PENDING") ===
                        "PENDING"
                    ) {
                        item.responseStatus = "REJECTED";
                    }
                });
            } else {
                const allAccepted =
                    pooledDeal.contributions.every(
                        (item) =>
                            item.responseStatus === "ACCEPTED"
                    );

                if (allAccepted) {
                    // Only one competing deal can commit this lot.
                    const committedLot =
                        await PooledLot.findOneAndUpdate(
                            {
                                _id: pooledDeal.pooledLot,
                                status: "OPEN",
                            },
                            {
                                $set: { status: "COMMITTED" },
                            },
                            {
                                new: true,
                                session,
                            }
                        );

                    if (!committedLot) {
                        const error = new Error(
                            "This pooled lot is no longer available. The offer cannot be finalized."
                        );
                        error.statusCode = 409;
                        throw error;
                    }

                    pooledDeal.status = "ACCEPTED";
                }
            }

            await pooledDeal.save({ session });
            updatedDeal = pooledDeal.toObject();
        });

        // Notify only after the transaction has committed.
        try {
            await createNotification({
                recipient: updatedDeal.buyer,
                type: "DEAL_RESPONSE",
                title: "Pooled offer update",
                message:
                    updatedDeal.status === "ACCEPTED"
                        ? "All contributing farmers accepted your pooled offer."
                        : updatedDeal.status === "REJECTED"
                            ? "A contributing farmer rejected your pooled offer."
                            : "A contributing farmer accepted your pooled offer. Other responses are pending.",
                entityType: "SYSTEM",
                entityId: updatedDeal._id,
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
                updatedDeal.status === "ACCEPTED"
                    ? "All farmers accepted. The pooled deal is accepted."
                    : updatedDeal.status === "REJECTED"
                        ? "The pooled deal has been rejected."
                        : "Your response was recorded. Waiting for other farmers.",
            data: updatedDeal,
        });
    } catch (error) {
        console.error(
            "Respond to pooled deal error:",
            error
        );

        return res.status(error.statusCode || 500).json({
            success: false,
            message:
                error.statusCode
                    ? error.message
                    : "Unable to process farmer response.",
        });
    } finally {
        await session.endSession();
    }
};


export const getFarmerPooledDeals = async (req, res) => {
    try {
        if (req.user?.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can view their pooled deals.",
            });
        }

        const pooledDeals = await PooledDeal.find({
            "contributions.farmer": req.user._id,
        })
            .populate("buyer", "name village")
            .populate("pooledLot", "crop unit location quality status")
            .sort({ createdAt: -1 })
            .lean();

        // Collect the IDs of deals involving this farmer.
        const dealIds = pooledDeals.map((deal) => deal._id);

        // Fetch persisted payment records for these deals.
        const payments = dealIds.length
            ? await PooledPayment.find({
                  pooledDeal: { $in: dealIds },
              })
                  .select(
                      "pooledDeal amount currency status transactionId paidAt createdAt"
                  )
                  .lean()
            : [];

        // Match each payment to its pooled deal.
        const paymentByDealId = new Map(
            payments.map((payment) => [
                payment.pooledDeal.toString(),
                payment,
            ])
        );

        const farmerDeals = pooledDeals.map((deal) => {
            const contribution = deal.contributions.find(
                (item) =>
                    item.farmer.toString() ===
                    req.user._id.toString()
            );

            const payment = paymentByDealId.get(
                deal._id.toString()
            );

            return {
                ...deal,

                myContribution: contribution
                    ? {
                          produce: contribution.produce,
                          quantity: contribution.quantity,
                          expectedPrice: contribution.expectedPrice,
                          offeredAmount: contribution.offeredAmount,
                          responseStatus:
                              contribution.responseStatus || "PENDING",
                      }
                    : null,

                payment: payment
                    ? {
                          amount: payment.amount,
                          currency: payment.currency,
                          status: payment.status,
                          transactionId: payment.transactionId,
                          paidAt: payment.paidAt,
                          createdAt: payment.createdAt,
                      }
                    : null,
            };
        });

        return res.status(200).json({
            success: true,
            count: farmerDeals.length,
            data: farmerDeals,
        });
    } catch (error) {
        console.error(
            "Get farmer pooled deals error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve farmer pooled deals.",
        });
    }
};