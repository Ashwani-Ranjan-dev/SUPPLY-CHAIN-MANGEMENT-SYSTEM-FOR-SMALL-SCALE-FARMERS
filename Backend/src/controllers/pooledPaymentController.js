
import crypto from "crypto";
import Razorpay from "razorpay";

import PooledDeal from "../models/PooledDealSchema.js";
import PooledPayment from "../models/PooledPaymentSchema.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order for an accepted pooled deal
export const createPooledPaymentOrder = async (req, res) => {
    try {
        const { pooledDealId } = req.body;

        if (!pooledDealId) {
            return res.status(400).json({
                success: false,
                message: "Pooled deal ID is required.",
            });
        }

        const pooledDeal = await PooledDeal.findById(pooledDealId);

        if (!pooledDeal) {
            return res.status(404).json({
                success: false,
                message: "Pooled deal not found.",
            });
        }

        // Only the buyer who created the deal can pay.
        if (pooledDeal.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to pay for this deal.",
            });
        }

        // All farmers must accept before payment.
        if (pooledDeal.status !== "ACCEPTED") {
            return res.status(400).json({
                success: false,
                message: "Payment is available only after all farmers accept.",
            });
        }

        const amount = Number(pooledDeal.totalAmount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "The pooled deal has an invalid payment amount.",
            });
        }

        // Create one payment record per pooled deal.
        let payment = await PooledPayment.findOne({
            pooledDeal: pooledDeal._id,
        });

        if (payment && payment.status === "PAID") {
            return res.status(409).json({
                success: false,
                message: "This pooled deal has already been paid.",
            });
        }

        if (payment && payment.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Payment ownership validation failed.",
            });
        }

        if (!payment) {
            payment = await PooledPayment.create({
                pooledDeal: pooledDeal._id,
                buyer: req.user.id,
                amount,
                currency: "INR",
                status: "PENDING",
            });
        } else {
            // Keep the stored amount aligned with the accepted deal.
            payment.amount = amount;
            payment.status = "PENDING";
        }

        // Razorpay expects the amount in paise.
        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `pool_${payment._id}`,
            notes: {
                pooledDealId: pooledDeal._id.toString(),
                pooledPaymentId: payment._id.toString(),
                buyerId: req.user.id,
            },
        });

        payment.razorpayOrderId = order.id;
        await payment.save();

        return res.status(201).json({
            success: true,
            message: "Pooled payment order created.",
            paymentId: payment._id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Create pooled payment order error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create pooled payment order.",
        });
    }
};

// Verify the payment after Razorpay Checkout returns
export const verifyPooledPayment = async (req, res) => {
    try {
        const {
            pooledPaymentId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !pooledPaymentId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "All Razorpay verification fields are required.",
            });
        }

        const payment = await PooledPayment.findById(pooledPaymentId);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Pooled payment record not found.",
            });
        }

        // Only the buyer who owns the payment can verify it.
        if (payment.buyer.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to verify this payment.",
            });
        }

        // Idempotency: don't process an already-paid record again.
        if (payment.status === "PAID") {
            if (payment.razorpayPaymentId === razorpay_payment_id) {
                return res.status(200).json({
                    success: true,
                    message: "Payment has already been verified.",
                    payment,
                });
            }

            return res.status(409).json({
                success: false,
                message: "This pooled deal has already been paid.",
            });
        }

        if (payment.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order ID does not match.",
            });
        }

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const signatureBuffer = Buffer.from(razorpay_signature);
        const expectedBuffer = Buffer.from(expectedSignature);

        if (
            signatureBuffer.length !== expectedBuffer.length ||
            !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay payment signature.",
            });
        }

        // Confirm the transaction with Razorpay itself.
        const razorpayPayment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            razorpayPayment.order_id !== razorpay_order_id ||
            Number(razorpayPayment.amount) !==
                Math.round(payment.amount * 100) ||
            razorpayPayment.currency !== payment.currency ||
            razorpayPayment.status !== "captured"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment is not captured or its details do not match.",
            });
        }

        // Recheck the pooled deal before finalizing the payment.
        const pooledDeal = await PooledDeal.findById(payment.pooledDeal);

        if (!pooledDeal || pooledDeal.status !== "ACCEPTED") {
            return res.status(409).json({
                success: false,
                message: "The pooled deal is no longer eligible for payment.",
            });
        }

        payment.status = "PAID";
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.transactionId = razorpay_payment_id;
        payment.paidAt = new Date();

        await payment.save();

        return res.status(200).json({
            success: true,
            message: "Pooled payment verified successfully.",
            payment,
        });
    } catch (error) {
        console.error("Verify pooled payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify pooled payment.",
        });
    }
};
