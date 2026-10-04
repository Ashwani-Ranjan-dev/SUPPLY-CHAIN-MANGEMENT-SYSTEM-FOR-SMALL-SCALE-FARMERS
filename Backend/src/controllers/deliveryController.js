import Delivery from "../models/DeliverySchema.js";
import User from "../models/userSchema.js";
import createNotification from "../utils/createNotification.js";
import Deal from "../models/DealSchema.js";


// ======================================================
// GET FARMER DELIVERIES
// ======================================================

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

        // Only farmers can access farmer deliveries
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


// ======================================================
// GET SINGLE DELIVERY
// ======================================================

export const getDeliveryById = async (
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

        // Only farmers can access this endpoint
        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can access deliveries.",
            });
        }

        const delivery =
            await Delivery.findOne({
                _id: req.params.id,
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


// ======================================================
// UPDATE DELIVERY STATUS
// ======================================================

export const updateDeliveryStatus = async (
    req,
    res
) => {
    try {

        // ==================================================
        // 1. GET REQUESTED STATUS
        // ==================================================

        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery status is required.",
            });
        }


        // ==================================================
        // 2. FIND FARMER
        // ==================================================

        const farmer = await User.findById(
            req.user.id
        );

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }


        // ==================================================
        // 3. ROLE CHECK
        // ==================================================

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can update deliveries.",
            });
        }


        // ==================================================
        // 4. FIND DELIVERY
        // ==================================================

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


        // ==================================================
        // 5. ALLOWED STATUS TRANSITIONS
        // ==================================================

        const allowedTransitions = {

            NOT_ASSIGNED: [
                "ASSIGNED",
            ],

            ASSIGNED: [
                "PICKED_UP",
            ],

            PICKED_UP: [
                "IN_TRANSIT",
            ],

            IN_TRANSIT: [
                "DELIVERED",
            ],

            DELIVERED: [],

            CANCELLED: [],
        };


        const nextStatuses =
            allowedTransitions[
            delivery.status
            ] || [];


        // ==================================================
        // 6. CHECK STATUS TRANSITION
        // ==================================================

        if (
            !nextStatuses.includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Invalid delivery status transition from ${delivery.status} to ${status}.`,
            });
        }


        // ==================================================
        // 7. PAYMENT CHECK
        // ==================================================

        if (
            delivery.paymentStatus !== "PAID"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Delivery cannot progress until payment is completed.",
            });
        }


        // ==================================================
        // 8. UPDATE DELIVERY STATUS
        // ==================================================

        delivery.status = status;


        // Set delivered timestamp
        if (status === "DELIVERED") {
            delivery.deliveredAt = new Date();

            const deal = await Deal.findById(delivery.deal);

            if (!deal) {
                return res.status(404).json({
                    message: "Associated deal not found"
                });
            }

            if (deal.status !== "ACCEPTED") {
                return res.status(400).json({
                    message: "Only an accepted deal can be completed"
                });
            }

            deal.status = "COMPLETED";

            await deal.save();

            // Notify the Buyer
            await createNotification({
                recipient: deal.buyer,
                type: "DELIVERY_UPDATED",
                title: "Deal Completed",
                message: "Your delivery has been completed successfully.",
                entityType: "DEAL",
                entityId: deal._id,
            });
        }

        await delivery.save();



        // ==================================================
        // 9. FORMAT STATUS FOR NOTIFICATION
        // ==================================================

        const formattedStatus =
            delivery.status.replace(
                /_/g,
                " "
            );


        // ==================================================
        // 10. NOTIFY BUYER
        // ==================================================

        await createNotification({
            recipient: delivery.buyer,

            type: "DELIVERY_UPDATED",

            title: "Delivery status updated",

            message:
                `Your delivery status is now ${formattedStatus}.`,

            entityType: "DELIVERY",

            entityId: delivery._id,
        });


        // ==================================================
        // 11. NOTIFY FARMER
        // ==================================================

        await createNotification({
            recipient: delivery.farmer,

            type: "DELIVERY_UPDATED",

            title: "Delivery status updated",

            message:
                `Delivery status changed to ${formattedStatus}.`,

            entityType: "DELIVERY",

            entityId: delivery._id,
        });


        // ==================================================
        // 12. SUCCESS RESPONSE
        // ==================================================

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