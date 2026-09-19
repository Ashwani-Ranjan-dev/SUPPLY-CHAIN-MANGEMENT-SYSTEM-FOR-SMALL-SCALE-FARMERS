import Payment from "../models/PaymentSchema.js";
import User from "../models/userSchema.js";


// Get farmer payments
export const getFarmerPayments = async (
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
                    "Only farmers can access payments.",
            });
        }

        const payments =
            await Payment.find({
                farmer: farmer._id,
            })
                .populate({
                    path: "deal",
                    populate: {
                        path: "produce",
                        select:
                            "crop quantity unit location",
                    },
                })
                .populate(
                    "buyer",
                    "name phone village"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments,
        });
    } catch (error) {
        console.error(
            "Get farmer payments error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load payments.",
        });
    }
};


// Get a single farmer payment
export const getPaymentById = async (
    req,
    res
) => {
    try {
        const payment =
            await Payment.findOne({
                _id: req.params.id,
                farmer: req.user.id,
            })
                .populate(
                    "buyer",
                    "name phone village"
                )
                .populate({
                    path: "deal",
                    populate: {
                        path: "produce",
                        select:
                            "crop quantity unit location",
                    },
                });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment not found or access denied.",
            });
        }

        return res.status(200).json({
            success: true,
            payment,
        });
    } catch (error) {
        console.error(
            "Get payment error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load payment.",
        });
    }
};