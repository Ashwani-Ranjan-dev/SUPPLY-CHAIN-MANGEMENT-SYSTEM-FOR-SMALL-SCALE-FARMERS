import Deal from "../models/DealSchema.js";
import User from "../models/userSchema.js";
import Produce from "../models/ProduceSchema.js";
import Payment from "../models/PaymentSchema.js";

// Create Deal
export const createDeal = async (req, res) => {
    try {
        const buyer = await User.findById(req.user.id);

        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: "Buyer not found.",
            });
        }

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

        if (!produceId || !quantity || offeredPrice === undefined) {
            return res.status(400).json({
                success: false,
                message:
                    "Produce, quantity and offered price are required.",
            });
        }

        const produce = await Produce.findById(produceId);

        if (!produce) {
            return res.status(404).json({
                success: false,
                message: "Produce listing not found.",
            });
        }

        if (produce.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "This produce listing is not active.",
            });
        }

        const requestedQuantity = Number(quantity);
        const price = Number(offeredPrice);

        if (
            Number.isNaN(requestedQuantity) ||
            requestedQuantity <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero.",
            });
        }

        if (requestedQuantity > produce.quantity) {
            return res.status(400).json({
                success: false,
                message:
                    "Requested quantity cannot exceed available quantity.",
            });
        }

        if (Number.isNaN(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: "Offered price is invalid.",
            });
        }

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

        const totalAmount = requestedQuantity * price;

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

        return res.status(201).json({
            success: true,
            message: "Deal offer created successfully.",
            deal,
        });
    } catch (error) {
        console.error("Create deal error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create deal.",
        });
    }
};


// Get Farmer Deal
export const getFarmerDeals = async (req, res) => {
    try {
        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can access farmer deals.",
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
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: deals.length,
            deals,
        });
    } catch (error) {
        console.error("Get farmer deals error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load farmer deals.",
        });
    }
};


//Accept Deal
export const acceptDeal = async (req, res) => {
    try {
        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can accept deals.",
            });
        }

        const deal = await Deal.findOne({
            _id: req.params.id,
            farmer: farmer._id,
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Deal not found or access denied.",
            });
        }

        if (deal.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending deals can be accepted.",
            });
        }

        deal.status = "ACCEPTED";

        await deal.save();

        const payment = await Payment.findOneAndUpdate(
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

        return res.status(200).json({
            success: true,
            message:
                "Deal accepted and payment record created.",
            deal,
            payment,
        });
    } catch (error) {
        console.error("Accept deal error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to accept deal.",
        });
    }
};


// Reject Deal
export const rejectDeal = async (req, res) => {
    try {
        const farmer = await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message: "Only farmers can reject deals.",
            });
        }

        const deal = await Deal.findOne({
            _id: req.params.id,
            farmer: farmer._id,
        });

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Deal not found or access denied.",
            });
        }

        if (deal.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message:
                    "Only pending deals can be rejected.",
            });
        }

        deal.status = "REJECTED";

        await deal.save();

        return res.status(200).json({
            success: true,
            message: "Deal rejected successfully.",
            deal,
        });
    } catch (error) {
        console.error("Reject deal error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to reject deal.",
        });
    }
};