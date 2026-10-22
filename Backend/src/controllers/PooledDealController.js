import mongoose from "mongoose";
import PooledDeal from "../models/PooledDealSchema.js";
import PooledLot from "../models/PooledLotSchema.js";
import createNotification from "../utils/createNotification.js";
import PooledPayment from "../models/PooledPaymentSchema.js";

// @desc    Submit an offer for a pooled produce lot
// @route   POST /api/pooled-deals
// @access  Private - BUYER
export const createPooledDeal = async (req, res) => {
    try {
        // 1. Only buyers can submit pooled offers.
        if (req.user.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can submit pooled produce offers.",
            });
        }

        const { pooledLotId, offeredPrice, message = "" } = req.body;

        // 2. Validate request fields.
        if (!pooledLotId || !mongoose.isValidObjectId(pooledLotId)) {
            return res.status(400).json({
                success: false,
                message: "A valid pooled lot ID is required.",
            });
        }

        const price = Number(offeredPrice);

        if (!Number.isFinite(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Offered price must be greater than zero.",
            });
        }

        if (typeof message !== "string" || message.length > 500) {
            return res.status(400).json({
                success: false,
                message: "Message must be a string of at most 500 characters.",
            });
        }

        // 3. Find an open pooled lot.
        const pooledLot = await PooledLot.findOne({
            _id: pooledLotId,
            status: "OPEN",
        }).populate({
            path: "listings.produce",
            select: "crop quantity unit expectedPrice location quality status pooledLot",
        });

        if (!pooledLot) {
            return res.status(404).json({
                success: false,
                message: "Pooled lot not found or no longer open.",
            });
        }

        // 4. A buyer cannot submit another pending offer
        // for the same pooled lot.
        const existingOffer = await PooledDeal.findOne({
            pooledLot: pooledLot._id,
            buyer: req.user._id,
            status: "PENDING",
        });

        if (existingOffer) {
            return res.status(409).json({
                success: false,
                message: "You already have a pending offer for this pooled lot.",
                data: existingOffer,
            });
        }

        // 5. Validate the lot's individual contributions.
        if (!pooledLot.listings || pooledLot.listings.length < 2) {
            return res.status(400).json({
                success: false,
                message: "This lot does not contain enough farmer contributions.",
            });
        }

        const contributions = [];
        const farmerIds = new Set();

        for (const listing of pooledLot.listings) {
            const produce = listing.produce;

            if (!produce || produce.status !== "ACTIVE") {
                return res.status(409).json({
                    success: false,
                    message: "A produce listing in this pooled lot is unavailable.",
                });
            }

            if (
                !produce.pooledLot ||
                produce.pooledLot.toString() !== pooledLot._id.toString()
            ) {
                return res.status(409).json({
                    success: false,
                    message: "A produce listing is no longer associated with this lot.",
                });
            }

            if (!listing.farmer || !listing.quantity || listing.quantity <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "A farmer contribution contains invalid data.",
                });
            }

            farmerIds.add(listing.farmer.toString());

            // The offered price is the buyer's price per unit.
            // The contribution amount is calculated proportionally.
            contributions.push({
                produce: produce._id,
                farmer: listing.farmer,
                quantity: listing.quantity,
                expectedPrice: listing.expectedPrice,
                offeredAmount: Number(
                    (listing.quantity * price).toFixed(2)
                ),
            });
        }

        if (farmerIds.size < 2) {
            return res.status(400).json({
                success: false,
                message: "A pooled deal must include at least two distinct farmers.",
            });
        }

        // 6. Calculate the combined quantity and total offer.
        const totalQuantity = contributions.reduce(
            (total, item) => total + item.quantity,
            0
        );

        const totalAmount = Number(
            (totalQuantity * price).toFixed(2)
        );

        // 7. Create the pooled deal.
        const pooledDeal = await PooledDeal.create({
            pooledLot: pooledLot._id,
            buyer: req.user._id,
            contributions,
            quantity: totalQuantity,
            unit: pooledLot.unit,
            offeredPrice: price,
            totalAmount,
            message: message.trim(),
            status: "PENDING",
        });

        // 8. Notify every contributing farmer.
        // Notification failure should not undo the created offer.
        const notificationResults = await Promise.allSettled(
            contributions.map((contribution) =>
                createNotification({
                    recipient: contribution.farmer,
                    type: "DEAL_OFFER",
                    title: "New pooled produce offer",
                    message: `A buyer has offered ₹${price} per ${pooledLot.unit} for a pooled lot containing your ${contribution.quantity} ${pooledLot.unit} contribution.`,
                    entityType: "SYSTEM",
                    entityId: pooledDeal._id,
                })
            )
        );

        const failedNotifications = notificationResults.filter(
            (result) => result.status === "rejected"
        ).length;

        return res.status(201).json({
            success: true,
            message:
                failedNotifications > 0
                    ? "Pooled offer created, but some farmer notifications could not be sent."
                    : "Pooled offer submitted successfully. Waiting for farmer responses.",
            data: pooledDeal,
        });
    } catch (error) {
        console.error("Create pooled deal error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit pooled produce offer.",
        });
    }
};


// @desc    Get all pooled deals for the logged-in buyer
// @route   GET /api/pooled-deals/buyer
// @access  Private - BUYER

export const getBuyerPooledDeals = async (req, res) => {
    try {
        if (req.user.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can view their pooled deals.",
            });
        }

        // 1. Fetch only the logged-in buyer's deals.
        const pooledDeals = await PooledDeal.find({
            buyer: req.user._id,
        })
            .populate({
                path: "pooledLot",
                select: "crop unit location quality totalQuantity status",
            })
            .populate({
                path: "contributions.farmer",
                select: "name village phone",
            })
            .populate({
                path: "contributions.produce",
                select: "crop quantity unit expectedPrice status",
            })
            .sort({ createdAt: -1 })
            .lean();

        // 2. Fetch payment records for these deals in one query.
        const dealIds = pooledDeals.map((deal) => deal._id);

        const payments = dealIds.length
            ? await PooledPayment.find({
                  pooledDeal: { $in: dealIds },
                  buyer: req.user._id,
              })
                  .select(
                      "pooledDeal amount currency status transactionId razorpayPaymentId paidAt createdAt"
                  )
                  .lean()
            : [];

        // 3. Index payments by their associated pooled deal.
        const paymentByDealId = new Map(
            payments.map((payment) => [
                payment.pooledDeal.toString(),
                payment,
            ])
        );

        // 4. Attach persistent payment information to every deal.
        const dealsWithPayments = pooledDeals.map((deal) => {
            const payment = paymentByDealId.get(deal._id.toString());

            return {
                ...deal,
                payment: payment
                    ? {
                          _id: payment._id,
                          amount: payment.amount,
                          currency: payment.currency,
                          status: payment.status,
                          transactionId: payment.transactionId,
                          razorpayPaymentId: payment.razorpayPaymentId,
                          paidAt: payment.paidAt,
                          createdAt: payment.createdAt,
                      }
                    : null,
            };
        });

        return res.status(200).json({
            success: true,
            count: dealsWithPayments.length,
            data: dealsWithPayments,
        });
    } catch (error) {
        console.error("Get buyer pooled deals error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve pooled deals.",
        });
    }
};


