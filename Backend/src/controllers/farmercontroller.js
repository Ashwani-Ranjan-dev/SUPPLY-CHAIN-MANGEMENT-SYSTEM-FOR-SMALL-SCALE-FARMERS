import User from "../models/userSchema.js";
import Deal from "../models/DealSchema.js";
import Produce from "../models/ProduceSchema.js";
import Delivery from "../models/DeliverySchema.js";
import Payment from "../models/PaymentSchema.js";

export const getfarmerDashboard = async (req, res) => {
    try {
        const farmer = await User.findById(req.user.id).select(
            "name phone role village produceInterest farmerType phoneVerified"
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
                message: "Access denied. Farmer account required.",
            });
        }

        // Active produce listings
        const activeProduce = await Produce.countDocuments({
            farmer: farmer._id,
            status: "ACTIVE",
        });

        // Deals currently in progress
        const activeDeals = await Deal.countDocuments({
            farmer: farmer._id,
            status: {
                $in: ["PENDING", "ACCEPTED"],
            },
        });

        // Total money actually received
        const earningsResult = await Payment.aggregate([
            {
                $match: {
                    farmer: farmer._id,
                    status: "PAID",
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        const totalEarnings =
            earningsResult.length > 0
                ? earningsResult[0].total
                : 0;

        // Deliveries that are not completed or cancelled
        const pendingDeliveries =
            await Delivery.countDocuments({
                farmer: farmer._id,
                status: {
                    $nin: ["DELIVERED", "CANCELLED"],
                },
            });

        return res.status(200).json({
            success: true,

            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                role: farmer.role,
                village: farmer.village,
                produceInterest:
                    farmer.produceInterest,
                farmerType: farmer.farmerType,
                phoneVerified:
                    farmer.phoneVerified,
            },

            stats: {
                activeProduce,
                activeDeals,
                totalEarnings,
                pendingDeliveries,
            },
        });
    } catch (error) {
        console.error(
            "Get farmer dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load farmer dashboard.",
        });
    }
};

// Get farmer profile
export const getFarmerProfile = async (req, res) => {
    try {
        const farmer = await User.findById(req.user.id).select(
            "name phone role village produceInterest farmerType phoneVerified"
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
                message: "Only farmers can access their profile.",
            });
        }

        return res.status(200).json({
            success: true,
            farmer,
        });
    } catch (error) {
        console.error("Get farmer profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load farmer profile.",
        });
    }
};


// Update farmer profile
export const updateFarmerProfile = async (req, res) => {
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
                message: "Only farmers can update their profile.",
            });
        }

        const {
            name,
            village,
            produceInterest,
            farmerType,
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Name is required.",
            });
        }

        if (!village || !village.trim()) {
            return res.status(400).json({
                success: false,
                message: "Village is required.",
            });
        }

        if (
            farmerType &&
            !["SMALL", "LARGE"].includes(farmerType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid farmer type.",
            });
        }

        farmer.name = name.trim();
        farmer.village = village.trim();
        farmer.produceInterest =
            produceInterest?.trim() || "";

        if (farmerType) {
            farmer.farmerType = farmerType;
        }

        await farmer.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.phone,
                role: farmer.role,
                village: farmer.village,
                produceInterest: farmer.produceInterest,
                farmerType: farmer.farmerType,
                phoneVerified: farmer.phoneVerified,
            },
        });
    } catch (error) {
        console.error("Update farmer profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update farmer profile.",
        });
    }
};