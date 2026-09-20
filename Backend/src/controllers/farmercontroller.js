import User from "../models/userSchema.js";
import Deal from "../models/DealSchema.js";
import Produce from "../models/ProduceSchema.js";
import Delivery from "../models/DeliverySchema.js";

export const getfarmerDashboard = async (req, res) => {

    try {
        const farmer = await User.findById(req.user.id)
            .select(
                "name phone role village produceInterest farmerType phoneVerified"
            );

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Access denied. Farmer account required.",
            });
        }

        const [
            activeProduce,
            activeDeals,
            pendingDeliveries
        ] = await Promise.all([
            Produce.countDocuments({
                farmer: farmer._id,
                status: "ACTIVE",
            }),

            Deal.countDocuments({
                farmer: farmer._id,
                status: {
                    $in: ["PENDING", "ACCEPTED"],
                },
            }),
        ]);

          Delivery.countDocuments({
        farmer: farmer._id,
        status: {
            $nin: [
                "DELIVERED",
                "CANCELLED",
            ],
        },
    });

        return res.status(200).json({
            success: true,
            farmer: {
                id: farmer._id,
                name: farmer.name,
                phone: farmer.role,
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
                totalEarnings: 0,
                pendingDeliveries,
            },
        });
    }
    catch (error) {
        console.error("Get farmer Dashboard error: ", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load Farmer Dashboard"
        });
    }
};
