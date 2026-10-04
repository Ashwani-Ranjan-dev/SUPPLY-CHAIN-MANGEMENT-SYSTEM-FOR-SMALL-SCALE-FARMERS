import React, { useState } from "react";

import {
    createPaymentOrder,
    verifyPayment,
} from "../../services/PaymentServices.js";


const DealPayment = ({
    deal,
    onPaymentSuccess,
}) => {

    const [
        payingDealId,
        setPayingDealId
    ] = useState(null);

    const [
        paymentStatus,
        setPaymentStatus
    ] = useState("");


    if (!deal) {
        return null;
    }


    // ==================================================
    // PAYMENT ID
    // ==================================================

    const paymentId =
        deal.payment?._id;


    // ==================================================
    // HANDLE PAYMENT
    // ==================================================

    const handlePayment = async () => {

        if (!paymentId) {

            setPaymentStatus(
                "Payment record not found."
            );

            return;
        }


        try {

            setPayingDealId(
                deal._id
            );

            setPaymentStatus(
                "Creating payment order..."
            );


            // ==================================================
            // CREATE RAZORPAY ORDER
            // ==================================================

            const data =
                await createPaymentOrder(
                    paymentId
                );


            // ==================================================
            // RAZORPAY CHECKOUT OPTIONS
            // ==================================================

            const options = {

                key:
                    import.meta.env
                        .VITE_RAZORPAY_KEY_ID,

                amount:
                    data.order.amount,

                currency:
                    data.order.currency,

                name:
                    "KrishiConnect",

                description:
                    "Farmer Deal Payment",

                order_id:
                    data.order.id,


                // ==================================================
                // PAYMENT SUCCESS
                // ==================================================

                handler:
                    async function (response) {

                        try {

                            setPaymentStatus(
                                "Verifying payment..."
                            );


                            console.log(
                                "Razorpay response:",
                                response
                            );


                            // ==================================================
                            // VERIFY PAYMENT WITH BACKEND
                            // ==================================================

                            const result =
                                await verifyPayment({

                                    paymentId,

                                    razorpay_order_id:
                                        response
                                            .razorpay_order_id,

                                    razorpay_payment_id:
                                        response
                                            .razorpay_payment_id,

                                    razorpay_signature:
                                        response
                                            .razorpay_signature,

                                });


                            console.log(
                                "Payment verified:",
                                result
                            );


                            // ==================================================
                            // UPDATE UI
                            // ==================================================

                            setPaymentStatus(
                                "Payment successful!"
                            );


                            // Send updated payment
                            // back to BuyerDeals
                            if (
                                onPaymentSuccess
                            ) {

                                onPaymentSuccess(
                                    deal._id,
                                    result.payment
                                );
                            }


                        } catch (error) {

                            console.error(
                                "Payment verification error:",
                                error
                            );


                            setPaymentStatus(
                                error.message ||
                                "Payment verification failed."
                            );

                        } finally {

                            setPayingDealId(
                                null
                            );
                        }
                    },


                // ==================================================
                // PAYMENT THEME
                // ==================================================

                theme: {
                    color: "#16a34a",
                },


                // ==================================================
                // CHECKOUT CLOSED
                // ==================================================

                modal: {

                    ondismiss:
                        function () {

                            setPaymentStatus(
                                ""
                            );

                            setPayingDealId(
                                null
                            );
                        },
                },
            };


            // ==================================================
            // OPEN RAZORPAY
            // ==================================================

            const razorpay =
                new window.Razorpay(
                    options
                );


            razorpay.open();


        } catch (error) {

            console.error(
                "Payment error:",
                error
            );


            setPaymentStatus(
                error.message ||
                "Unable to start payment."
            );


            setPayingDealId(
                null
            );
        }
    };


    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="space-y-3">

            {deal.payment?.status !== "PAID" && (

                <button
                    onClick={handlePayment}
                    disabled={
                        payingDealId ===
                        deal._id
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        rounded-xl
                        bg-green-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-green-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {payingDealId ===
                    deal._id
                        ? "Processing..."
                        : "Pay Now"}

                </button>
            )}


            {deal.payment?.status === "PAID" && (

                <div
                    className="
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-green-700
                    "
                >
                    Payment completed successfully.
                </div>
            )}


            {paymentStatus && (

                <p
                    className="
                        text-sm
                        font-medium
                        text-gray-600
                    "
                >
                    {paymentStatus}
                </p>
            )}

        </div>
    );
};


export default DealPayment;