import Payment from "../models/PaymentSchema.js";
import User from "../models/userSchema.js";
import createNotification from "../utils/createNotification.js";
import Deal from "../models/DealSchema.js";
import Delivery from "../models/DeliverySchema.js";
import Razorpay from "razorpay";

// Razorpay Client
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


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

// ==================================================
// Mark Payment As Paid
// ==================================================

export const markPaymentAsPaid = async (req, res) => {
    try {
        const {
            paymentId,
            transactionId,
        } = req.body;

        // ------------------------------------------
        // Validate required fields
        // ------------------------------------------

        if (!paymentId || !transactionId) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment ID and transaction ID are required.",
            });
        }

        // ------------------------------------------
        // Find payment
        // ------------------------------------------

        const payment = await Payment.findById(
            paymentId
        );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found.",
            });
        }

        // ------------------------------------------
        // Prevent duplicate success processing
        // ------------------------------------------

        if (payment.status === "PAID") {
            return res.status(400).json({
                success: false,
                message:
                    "Payment has already been marked as paid.",
            });
        }

        // ------------------------------------------
        // Find related deal
        // ------------------------------------------

        const deal = await Deal.findById(
            payment.deal
        );

        if (!deal) {
            return res.status(404).json({
                success: false,
                message:
                    "Associated deal not found.",
            });
        }

        // ------------------------------------------
        // Update payment
        // ------------------------------------------

        payment.status = "PAID";
        payment.transactionId = transactionId;
        payment.paidAt = new Date();

        await payment.save();

        // ------------------------------------------
        // Update delivery payment status
        // ------------------------------------------

        const delivery = await Delivery.findOne({
            deal: deal._id,
        });

        if (delivery) {
            delivery.paymentStatus = "PAID";

            await delivery.save();
        }

        // ------------------------------------------
        // Notify farmer
        // ------------------------------------------

        await createNotification({
            recipient: payment.farmer,
            type: "PAYMENT_RECEIVED",
            title: "Payment received",
            message:
                "Payment for your deal has been successfully received.",
            entityType: "PAYMENT",
            entityId: payment._id,
        });

        // ------------------------------------------
        // Response
        // ------------------------------------------

        return res.status(200).json({
            success: true,
            message:
                "Payment marked as paid successfully.",
            payment,
        });

    } catch (error) {
        console.error(
            "Mark payment as paid error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update payment status.",
        });
    }
};

// ==================================================
// Verify Razorpay Payment
// ==================================================

export const verifyPayment = async (req, res) => {
    try {

        const {
            paymentId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;


        // ==================================================
        // 1. VALIDATE REQUEST
        // ==================================================

        if (
            !paymentId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment verification details are required.",
            });
        }


        // ==================================================
        // 2. FIND PAYMENT
        // ==================================================

        const payment =
            await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment record not found.",
            });
        }


        // ==================================================
        // 3. CHECK BUYER OWNERSHIP
        // ==================================================

        if (
            payment.buyer.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to verify this payment.",
            });
        }


        // ==================================================
        // 4. PREVENT DUPLICATE VERIFICATION
        // ==================================================

        if (payment.status === "PAID") {
            return res.status(400).json({
                success: false,
                message:
                    "This payment has already been verified.",
            });
        }


        // ==================================================
        // 5. VERIFY ORDER ID
        // ==================================================

        if (
            !payment.razorpayOrderId ||
            payment.razorpayOrderId !==
                razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Razorpay order ID does not match.",
            });
        }


        // ==================================================
        // 6. CREATE EXPECTED SIGNATURE
        // ==================================================

        const crypto = await import("crypto");

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${payment.razorpayOrderId}|${razorpay_payment_id}`
                )
                .digest("hex");


        // ==================================================
        // 7. COMPARE SIGNATURE
        // ==================================================

        if (
            generatedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Payment signature verification failed.",
            });
        }


        // ==================================================
        // 8. UPDATE PAYMENT
        // ==================================================

        payment.status = "PAID";

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;

        payment.transactionId =
            razorpay_payment_id;

        payment.paidAt = new Date();

        await payment.save();


        // ==================================================
        // 9. UPDATE DELIVERY PAYMENT STATUS
        // ==================================================

        const delivery =
            await Delivery.findOne({
                deal: payment.deal,
            });

        if (delivery) {

            delivery.paymentStatus =
                "PAID";

            await delivery.save();
        }


        // ==================================================
        // 10. FARMER PAYMENT NOTIFICATION
        // ==================================================

        await createNotification({
            recipient: payment.farmer,

            type: "PAYMENT_RECEIVED",

            title: "Payment received",

            message:
                "Payment for your deal has been successfully received.",

            entityType: "PAYMENT",

            entityId: payment._id,
        });


        // ==================================================
        // 11. SUCCESS RESPONSE
        // ==================================================

        return res.status(200).json({
            success: true,

            message:
                "Payment verified successfully.",

            payment,
        });

    } catch (error) {

        console.error(
            "Verify payment error:",
            error
        );

        return res.status(500).json({
            success: false,

            message:
                "Unable to verify payment.",
        });
    }
};

export const createPaymentOrder = async (req, res) => {
    try {
        const { paymentId } = req.body;

        if (!paymentId) {
            return res.status(400).json({
                success: false,
                message: "Payment ID is required.",
            });
        }

        const payment = await Payment.findOne({
            _id: paymentId,
            buyer: req.user.id,
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found.",
            });
        }

        if (payment.status === "PAID") {
            return res.status(400).json({
                success: false,
                message: "This payment has already been completed.",
            });
        }

        const deal = await Deal.findById(payment.deal);

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Associated deal not found.",
            });
        }

        if (deal.status !== "ACCEPTED") {
            return res.status(400).json({
                success: false,
                message: "Payment is allowed only for accepted deals.",
            });
        }

        const amountInPaise = Math.round(
            payment.amount * 100
        );

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: payment.currency,
            receipt: `deal_${deal._id}`,
        });

        payment.razorpayOrderId = razorpayOrder.id;

        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Razorpay order created successfully.",
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            paymentId: payment._id,
        });

    } catch (error) {
        console.error(
            "Create payment order error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to create payment order.",
        });
    }
};