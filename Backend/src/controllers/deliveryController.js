import Delivery from "../models/DeliverySchema.js";
import User from "../models/userSchema.js";


// Get farmer deliveries
export const getFarmerDeliveries = async (
    req,
    res
) => {
    try {
        const farmer = await User.findById(
            req.user.id
        );

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can access deliveries.",
            });
        }

        const deliveries =
            await Delivery.find({
                farmer: farmer._id,
            })
                .populate(
                    "buyer",
                    "name phone village"
                )
                .populate(
                    "produce",
                    "crop quantity unit location"
                )
                .populate(
                    "deal",
                    "offeredPrice totalAmount status"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: deliveries.length,
            deliveries,
        });
    } catch (error) {
        console.error(
            "Get farmer deliveries error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load deliveries.",
        });
    }
};


// Get single delivery
export const getDeliveryById = async (
    req,
    res
) => {
    try {
        const delivery =
            await Delivery.findOne({
                _id: req.params.id,
                farmer: req.user.id,
            })
                .populate(
                    "buyer",
                    "name phone village"
                )
                .populate(
                    "produce",
                    "crop quantity unit location"
                )
                .populate(
                    "deal",
                    "offeredPrice totalAmount status"
                );

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message:
                    "Delivery not found or access denied.",
            });
        }

        return res.status(200).json({
            success: true,
            delivery,
        });
    } catch (error) {
        console.error(
            "Get delivery error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load delivery.",
        });
    }
};

// Update Delivery Status
export const updateDeliveryStatus = async (
    req,
    res
) => {
    try {
        const farmer = await User.findById(
            req.user.id
        );

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can update deliveries.",
            });
        }

        const delivery =
            await Delivery.findOne({
                _id: req.params.id,
                farmer: farmer._id,
            });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message:
                    "Delivery not found or access denied.",
            });
        }

        const allowedStatuses = [
            "ASSIGNED",
            "PICKED_UP",
            "IN_TRANSIT",
            "DELIVERED",
        ];

        const { status } = req.body;

        if (
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid delivery status.",
            });
        }

        // Payment must be completed before
        // delivery can move forward.
        if (
            delivery.paymentStatus !== "PAID"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery cannot progress until payment is completed.",
            });
        }

        delivery.status = status;

        if (status === "DELIVERED") {
            delivery.deliveredAt = new Date();
        }

        await delivery.save();

        return res.status(200).json({
            success: true,
            message:
                "Delivery status updated successfully.",
            delivery,
        });
    } catch (error) {
        console.error(
            "Update delivery status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update delivery status.",
        });
    }
};