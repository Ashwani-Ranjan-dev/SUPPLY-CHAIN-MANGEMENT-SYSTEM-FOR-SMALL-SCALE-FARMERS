import Deal from "../models/DealSchema.js";
import User from "../models/userSchema.js";
import Produce from "../models/ProduceSchema.js";
import Payment from "../models/PaymentSchema.js";
import Delivery from "../models/DeliverySchema.js";
import createNotification from "../utils/createNotification.js";


// ======================================================
// CREATE DEAL
// Buyer creates an offer for farmer's produce
// ======================================================

export const createDeal = async (req, res) => {
    try {

        const buyer = await User.findById(req.user.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found.",
            });
        }

        // Only buyers can create deals
        if (buyer.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message: "Only buyers can create deals.",
            });
        }

        const {
            produce: produceId,
            quantity,
            offeredPrice,
            message,
        } = req.body;

        // Validate required fields
        if (
            !produceId ||
            quantity === undefined ||
            offeredPrice === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Produce, quantity and offered price are required.",
            });
        }

        // Find produce
        const produce = await Produce.findById(produceId);

        if (!produce) {
            return res.status(404).json({
                success: false,
                message: "Produce listing not found.",
            });
        }

        // Produce must be active
        if (produce.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message:
                    "This produce listing is not active.",
            });
        }

        // Convert values to numbers
        const requestedQuantity = Number(quantity);
        const price = Number(offeredPrice);

        // Validate quantity
        if (
            Number.isNaN(requestedQuantity) ||
            requestedQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than zero.",
            });
        }

        // Quantity cannot exceed available quantity
        if (requestedQuantity > produce.quantity) {
            return res.status(400).json({
                success: false,
                message:
                    "Requested quantity cannot exceed available quantity.",
            });
        }

        // Validate price
        if (
            Number.isNaN(price) ||
            price < 0
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Offered price is invalid.",
            });
        }

        // Prevent duplicate pending offer
        const existingDeal = await Deal.findOne({
            buyer: buyer._id,
            produce: produce._id,
            status: "PENDING",
        });

        if (existingDeal) {
            return res.status(409).json({
                success: false,
                message:
                    "You already have a pending offer for this produce.",
            });
        }

        // Calculate total amount on backend
        const totalAmount =
            requestedQuantity * price;

        // Create deal
        const deal = await Deal.create({
            farmer: produce.farmer,
            buyer: buyer._id,
            produce: produce._id,
            quantity: requestedQuantity,
            unit: produce.unit,
            offeredPrice: price,
            totalAmount,
            message: message?.trim() || "",
            status: "PENDING",
        });

        // Notify farmer
        await createNotification({
            recipient: deal.farmer,
            type: "DEAL_OFFER",
            title: "New buyer offer",
            message:
                `A buyer has submitted an offer for ${deal.quantity} ${deal.unit}.`,
            entityType: "DEAL",
            entityId: deal._id,
        });

        return res.status(201).json({
            success: true,
            message:
                "Deal offer created successfully.",
            deal,
        });

    } catch (error) {

        console.error(
            "Create deal error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create deal.",
        });
    }
};


// ======================================================
// GET FARMER DEALS
// Farmer sees deals received from buyers
// ======================================================

export const getFarmerDeals = async (req, res) => {
    try {

        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        // Only farmers can access this endpoint
        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can access farmer deals.",
            });
        }

        const deals = await Deal.find({
            farmer: farmer._id,
        })
            .populate(
                "buyer",
                "name phone village"
            )
            .populate(
                "produce",
                "crop quantity unit location expectedPrice quality"
            )
            .populate(
                "farmer",
                "name phone village"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: deals.length,
            deals,
        });

    } catch (error) {

        console.error(
            "Get farmer deals error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load farmer deals.",
        });
    }
};


// ======================================================
// GET BUYER DEALS
// Buyer sees all deals they have created
//
// IMPORTANT:
// Payment is populated here because BuyerDeals.jsx
// needs payment.status and payment._id.
// ======================================================

export const getBuyerDeals = async (req, res) => {
    try {

        const buyer = await User.findById(req.user.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found.",
            });
        }

        // Only buyers can access this endpoint
        if (buyer.role !== "BUYER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only buyers can access buyer deals.",
            });
        }

        const deals = await Deal.find({
            buyer: buyer._id,
        })
            .populate(
                "farmer",
                "name phone village"
            )
            .populate(
                "produce",
                "crop quantity unit location expectedPrice quality status"
            )
            .sort({
                createdAt: -1,
            });

        // Attach payment information to every deal
        const dealsWithPayment = await Promise.all(
            deals.map(async (deal) => {

                const payment =
                    await Payment.findOne({
                        deal: deal._id,
                    });

                return {
                    ...deal.toObject(),
                    payment: payment || null,
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: dealsWithPayment.length,
            deals: dealsWithPayment,
        });

    } catch (error) {

        console.error(
            "Get buyer deals error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load buyer deals.",
        });
    }
};


// ======================================================
// ACCEPT DEAL
// Farmer accepts a pending deal
//
// This creates:
// 1. Payment record
// 2. Delivery record
// 3. DEAL_ACCEPTED notification
// ======================================================

export const acceptDeal = async (req, res) => {
    try {

        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        // Only farmers can accept deals
        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can accept deals.",
            });
        }

        // Find deal belonging to this farmer
        const deal = await Deal.findOne({
            _id: req.params.id,
            farmer: farmer._id,
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                message:
                    "Deal not found or access denied.",
            });
        }

        // Only pending deals can be accepted
        if (deal.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending deals can be accepted.",
            });
        }

        // Update deal
        deal.status = "ACCEPTED";

        await deal.save();

        // Notify buyer
        await createNotification({
            recipient: deal.buyer,
            type: "DEAL_ACCEPTED",
            title: "Deal accepted",
            message:
                "Your offer has been accepted by the farmer.",
            entityType: "DEAL",
            entityId: deal._id,
        });

        // ==================================================
        // CREATE PAYMENT
        // ==================================================

        const payment =
            await Payment.findOneAndUpdate(
                {
                    deal: deal._id,
                },
                {
                    deal: deal._id,
                    farmer: deal.farmer,
                    buyer: deal.buyer,
                    amount: deal.totalAmount,
                    currency: "INR",
                    status: "PENDING",
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        // ==================================================
        // CREATE DELIVERY
        // ==================================================

        const delivery =
            await Delivery.findOneAndUpdate(
                {
                    deal: deal._id,
                },
                {
                    deal: deal._id,
                    farmer: deal.farmer,
                    buyer: deal.buyer,
                    produce: deal.produce,
                    quantity: deal.quantity,
                    unit: deal.unit,

                    pickupLocation:
                        "Farmer Location",

                    deliveryLocation:
                        "Buyer Location",

                    status:
                        "NOT_ASSIGNED",

                    paymentStatus:
                        payment.status === "PAID"
                            ? "PAID"
                            : "PENDING",
                },
                {
                    new: true,
                    upsert: true,
                    setDefaultsOnInsert: true,
                }
            );

        return res.status(200).json({
            success: true,
            message:
                "Deal accepted successfully.",
            deal,
            payment,
            delivery,
        });

    } catch (error) {

        console.error(
            "Accept deal error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to accept deal.",
        });
    }
};


// ======================================================
// REJECT DEAL
// Farmer rejects a pending deal
// ======================================================

export const rejectDeal = async (req, res) => {
    try {

        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        // Only farmers can reject deals
        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can reject deals.",
            });
        }

        // Find deal belonging to this farmer
        const deal = await Deal.findOne({
            _id: req.params.id,
            farmer: farmer._id,
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                message:
                    "Deal not found or access denied.",
            });
        }

        // Only pending deals can be rejected
        if (deal.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending deals can be rejected.",
            });
        }

        // Update status
        deal.status = "REJECTED";

        await deal.save();

        // Notify buyer
        await createNotification({
            recipient: deal.buyer,
            type: "DEAL_REJECTED",
            title: "Deal rejected",
            message:
                "Your offer has been rejected by the farmer.",
            entityType: "DEAL",
            entityId: deal._id,
        });

        return res.status(200).json({
            success: true,
            message:
                "Deal rejected successfully.",
            deal,
        });

    } catch (error) {

        console.error(
            "Reject deal error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to reject deal.",
        });
    }
};