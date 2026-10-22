
import mongoose from "mongoose";

import PooledDelivery from "../models/PooledDeliverySchema.js";
import PooledDeal from "../models/PooledDealSchema.js";
import PooledLot from "../models/PooledLotSchema.js";
import PooledPayment from "../models/PooledPaymentSchema.js";
import createNotification from "../utils/createNotification.js";

const getUserId = (req) =>
    String(req.user?._id || req.user?.id || "");

const isFarmerInDeal = (deal, userId) =>
    deal.contributions.some(
        (contribution) =>
            String(contribution.farmer?._id || contribution.farmer) ===
            userId
    );

const populateDelivery = (query) =>
    query
        .populate({
            path: "pooledDeal",
            select: "status totalAmount offeredPrice contributions",
            populate: {
                path: "contributions.farmer",
                select: "name village phone",
            },
        })
        .populate({
            path: "pooledLot",
            select: "crop unit location quality totalQuantity status",
        })
        .populate("buyer", "name phone village");

// @desc    Create a pooled delivery after payment
// @route   POST /api/pooled-deliveries
// @access  Private - BUYER
export const createPooledDelivery = async (req, res) => {
    try {
        const userId = getUserId(req);

        if (!userId || req.user?.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can create pooled deliveries.",
            });
        }

        const { pooledDealId, deliveryLocation, notes = "" } =
            req.body;

        if (!mongoose.isValidObjectId(pooledDealId)) {
            return res.status(400).json({
                success: false,
                message: "A valid pooled deal ID is required.",
            });
        }

        if (
            typeof deliveryLocation !== "string" ||
            !deliveryLocation.trim() ||
            deliveryLocation.trim().length > 300
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "A delivery location of at most 300 characters is required.",
            });
        }

        if (
            typeof notes !== "string" ||
            notes.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message: "Notes must not exceed 1000 characters.",
            });
        }

        const pooledDeal = await PooledDeal.findById(pooledDealId);

        if (!pooledDeal) {
            return res.status(404).json({
                success: false,
                message: "Pooled deal not found.",
            });
        }

        if (String(pooledDeal.buyer) !== userId) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only create delivery for your own pooled deal.",
            });
        }

        if (pooledDeal.status !== "ACCEPTED") {
            return res.status(409).json({
                success: false,
                message:
                    "All farmers must accept the pooled deal before delivery creation.",
            });
        }

        // Always verify the persisted payment, not the frontend.
        const payment = await PooledPayment.findOne({
            pooledDeal: pooledDeal._id,
            buyer: pooledDeal.buyer,
            status: "PAID",
        });

        if (!payment) {
            return res.status(409).json({
                success: false,
                message:
                    "Verified payment is required before creating delivery.",
            });
        }

        const pooledLot = await PooledLot.findById(
            pooledDeal.pooledLot
        );

        if (!pooledLot) {
            return res.status(404).json({
                success: false,
                message: "Associated pooled lot not found.",
            });
        }

        if (pooledLot.status !== "COMMITTED") {
            return res.status(409).json({
                success: false,
                message:
                    "The pooled lot must be committed before delivery creation.",
            });
        }

        // Idempotency: do not create a second delivery.
        const existingDelivery = await PooledDelivery.findOne({
            pooledDeal: pooledDeal._id,
        });

        if (existingDelivery) {
            return res.status(200).json({
                success: true,
                message: "Pooled delivery already exists.",
                data: existingDelivery,
            });
        }

        const delivery = await PooledDelivery.create({
            pooledDeal: pooledDeal._id,
            pooledLot: pooledLot._id,
            buyer: pooledDeal.buyer,
            crop: pooledLot.crop,
            quantity: pooledDeal.quantity,
            unit: pooledDeal.unit,
            pickupLocation: pooledLot.location,
            deliveryLocation: deliveryLocation.trim(),
            paymentStatus: "PAID",
            notes: notes.trim(),
        });

        // Notification failures should not undo delivery creation.
        const farmerIds = [
            ...new Set(
                pooledDeal.contributions.map((item) =>
                    String(item.farmer)
                )
            ),
        ];

        const notificationTasks = farmerIds.map((farmerId) =>
            createNotification({
                recipient: farmerId,
                type: "DELIVERY_UPDATED",
                title: "Pooled delivery created",
                message:
                    `A paid pooled order for ${pooledDeal.quantity} ${pooledDeal.unit} of ${pooledLot.crop} is ready for delivery tracking.`,
                entityType: "SYSTEM",
                entityId: delivery._id,
            })
        );

        await Promise.allSettled(notificationTasks);

        return res.status(201).json({
            success: true,
            message: "Pooled delivery created successfully.",
            data: delivery,
        });
    } catch (error) {
        // Duplicate-key protection for concurrent create requests.
        if (error?.code === 11000) {
            const delivery = await PooledDelivery.findOne({
                pooledDeal: req.body?.pooledDealId,
            });

            if (delivery) {
                return res.status(200).json({
                    success: true,
                    message: "Pooled delivery already exists.",
                    data: delivery,
                });
            }
        }

        console.error("Create pooled delivery error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create pooled delivery.",
        });
    }
};

// @desc    Get pooled deliveries for the logged-in buyer
// @route   GET /api/pooled-deliveries/buyer
// @access  Private - BUYER
export const getBuyerPooledDeliveries = async (req, res) => {
    try {
        if (req.user?.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can view their pooled deliveries.",
            });
        }

        const deliveries = await populateDelivery(
            PooledDelivery.find({
                buyer: getUserId(req),
            }).sort({ createdAt: -1 })
        ).lean();

        return res.status(200).json({
            success: true,
            count: deliveries.length,
            data: deliveries,
        });
    } catch (error) {
        console.error("Get buyer pooled deliveries error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve pooled deliveries.",
        });
    }
};

// @desc    Get pooled deliveries involving the logged-in farmer
// @route   GET /api/pooled-deliveries/farmer
// @access  Private - FARMER
export const getFarmerPooledDeliveries = async (req, res) => {
    try {
        if (req.user?.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can view farmer pooled deliveries.",
            });
        }

        const farmerId = getUserId(req);

        // Find deals where this farmer contributed.
        const deals = await PooledDeal.find({
            "contributions.farmer": farmerId,
        }).select("_id");

        const dealIds = deals.map((deal) => deal._id);

        const deliveries = await populateDelivery(
            PooledDelivery.find({
                pooledDeal: { $in: dealIds },
            }).sort({ createdAt: -1 })
        ).lean();

        return res.status(200).json({
            success: true,
            count: deliveries.length,
            data: deliveries,
        });
    } catch (error) {
        console.error("Get farmer pooled deliveries error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve farmer pooled deliveries.",
        });
    }
};

// @desc    Get one pooled delivery for its buyer or contributing farmer
// @route   GET /api/pooled-deliveries/:id
// @access  Private - BUYER or contributing FARMER
export const getPooledDeliveryById = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pooled delivery ID.",
            });
        }

        const delivery = await PooledDelivery.findById(id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Pooled delivery not found.",
            });
        }

        if (String(delivery.buyer) !== userId) {
            if (req.user?.role !== "FARMER") {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this delivery.",
                });
            }

            const deal = await PooledDeal.findById(
                delivery.pooledDeal
            );

            if (!deal || !isFarmerInDeal(deal, userId)) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a contributor to this pooled deal.",
                });
            }
        }

        const populatedDelivery = await populateDelivery(
            PooledDelivery.findById(id)
        ).lean();

        return res.status(200).json({
            success: true,
            data: populatedDelivery,
        });
    } catch (error) {
        console.error("Get pooled delivery details error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve pooled delivery details.",
        });
    }
};

// @desc    Update pooled delivery status
// @route   PATCH /api/pooled-deliveries/:id/status
// @access  Private - contributing FARMER
export const updatePooledDeliveryStatus = async (req, res) => {
    try {
        if (req.user?.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only contributing farmers can update pooled delivery status.",
            });
        }

        const farmerId = getUserId(req);
        const { id } = req.params;
        const {
            status,
            partnerName,
            partnerPhone,
            estimatedDeliveryDate,
            notes,
        } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid pooled delivery ID.",
            });
        }

        const delivery = await PooledDelivery.findById(id);

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: "Pooled delivery not found.",
            });
        }

        const pooledDeal = await PooledDeal.findById(
            delivery.pooledDeal
        );

        if (!pooledDeal || !isFarmerInDeal(pooledDeal, farmerId)) {
            return res.status(403).json({
                success: false,
                message: "You are not a contributing farmer for this delivery.",
            });
        }

        // Recheck the real payment record before any status update.
        const payment = await PooledPayment.findOne({
            pooledDeal: delivery.pooledDeal,
            buyer: delivery.buyer,
            status: "PAID",
        });

        if (!payment) {
            return res.status(409).json({
                success: false,
                message: "A verified pooled payment is required.",
            });
        }

        const transitions = {
            NOT_ASSIGNED: ["ASSIGNED"],
            ASSIGNED: ["PICKED_UP"],
            PICKED_UP: ["IN_TRANSIT"],
            IN_TRANSIT: ["DELIVERED"],
            DELIVERED: [],
            CANCELLED: [],
        };

        if (!transitions[delivery.status]?.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid delivery status transition: ${delivery.status} → ${status}.`,
            });
        }

        if (
            partnerName !== undefined &&
            (typeof partnerName !== "string" ||
                partnerName.length > 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery partner name.",
            });
        }

        if (
            partnerPhone !== undefined &&
            (typeof partnerPhone !== "string" ||
                partnerPhone.length > 30)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery partner phone.",
            });
        }

        if (
            notes !== undefined &&
            (typeof notes !== "string" || notes.length > 1000)
        ) {
            return res.status(400).json({
                success: false,
                message: "Notes must not exceed 1000 characters.",
            });
        }

        if (partnerName !== undefined) {
            delivery.deliveryPartner.name = partnerName.trim();
        }

        if (partnerPhone !== undefined) {
            delivery.deliveryPartner.phone = partnerPhone.trim();
        }

        if (estimatedDeliveryDate !== undefined) {
            const date = new Date(estimatedDeliveryDate);

            if (Number.isNaN(date.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid estimated delivery date.",
                });
            }

            delivery.estimatedDeliveryDate = date;
        }

        if (notes !== undefined) {
            delivery.notes = notes.trim();
        }

        delivery.status = status;

        if (status === "DELIVERED") {
            delivery.deliveredAt = new Date();
        }

        await delivery.save();

        // When delivered, complete the pooled deal.
        if (status === "DELIVERED") {
            pooledDeal.status = "COMPLETED";
            await pooledDeal.save();
        }

        const farmerIds = [
            ...new Set(
                pooledDeal.contributions.map((item) =>
                    String(item.farmer)
                )
            ),
        ];

        const notificationTasks = [
            createNotification({
                recipient: String(delivery.buyer),
                type: "DELIVERY_UPDATED",
                title: "Pooled delivery updated",
                message: `Your pooled delivery status is now ${status}.`,
                entityType: "SYSTEM",
                entityId: delivery._id,
            }),
            ...farmerIds
                .filter((id) => id !== farmerId)
                .map((farmerId) =>
                    createNotification({
                        recipient: farmerId,
                        type: "DELIVERY_UPDATED",
                        title: "Pooled delivery updated",
                        message: `The pooled delivery status is now ${status}.`,
                        entityType: "SYSTEM",
                        entityId: delivery._id,
                    })
                ),
        ];

        await Promise.allSettled(notificationTasks);

        return res.status(200).json({
            success: true,
            message: "Pooled delivery status updated successfully.",
            data: delivery,
        });
    } catch (error) {
        console.error("Update pooled delivery status error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update pooled delivery status.",
        });
    }
};
