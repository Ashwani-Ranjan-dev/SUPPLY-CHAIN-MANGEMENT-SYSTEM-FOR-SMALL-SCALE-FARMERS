import Payment from "../models/PaymentSchema.js";
import User from "../models/userSchema.js";

export const getFarmerLedger = async (req, res) => {
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
                message:
                    "Only farmers can access the ledger.",
            });
        }

        const payments = await Payment.find({
            farmer: farmer._id,
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
            })
            .sort({
                createdAt: -1,
            });

        const transactions = payments.map(
            (payment) => ({
                id: payment._id,

                dealId: payment.deal?._id || null,

                crop:
                    payment.deal?.produce?.crop ||
                    "Unknown Produce",

                quantity:
                    payment.deal?.quantity || 0,

                unit:
                    payment.deal?.unit || "KG",

                buyer: payment.buyer
                    ? {
                          id: payment.buyer._id,
                          name: payment.buyer.name,
                          phone: payment.buyer.phone,
                          village:
                              payment.buyer.village,
                      }
                    : null,

                amount: payment.amount,

                currency: payment.currency,

                paymentStatus:
                    payment.status,

                paymentMethod:
                    payment.method,

                transactionId:
                    payment.transactionId,

                paidAt: payment.paidAt,

                createdAt: payment.createdAt,
            })
        );

        const totalAmount = transactions.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

        const paidAmount = transactions
            .filter(
                (transaction) =>
                    transaction.paymentStatus ===
                    "PAID"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

        const pendingAmount = transactions
            .filter(
                (transaction) =>
                    transaction.paymentStatus ===
                    "PENDING"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

        const refundedAmount = transactions
            .filter(
                (transaction) =>
                    transaction.paymentStatus ===
                    "REFUNDED"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

        return res.status(200).json({
            success: true,

            summary: {
                totalTransactions:
                    transactions.length,

                totalAmount,

                paidAmount,

                pendingAmount,

                refundedAmount,
            },

            transactions,
        });
    } catch (error) {
        console.error(
            "Get farmer ledger error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load farmer ledger.",
        });
    }
};