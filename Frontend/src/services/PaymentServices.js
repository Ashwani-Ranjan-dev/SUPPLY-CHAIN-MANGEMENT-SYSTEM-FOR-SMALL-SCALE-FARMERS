const API_URL = import.meta.env.VITE_API_URL;


// ======================================================
// GET FARMER PAYMENTS
// ======================================================

export const getFarmerPayments = async () => {
    const response = await fetch(
        `${API_URL}/payments/farmer`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to load payments."
        );
    }

    return data;
};


// ======================================================
// GET SINGLE PAYMENT
// ======================================================

export const getPaymentById = async (id) => {
    const response = await fetch(
        `${API_URL}/payments/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to load payment."
        );
    }

    return data;
};


// ======================================================
// CREATE RAZORPAY ORDER
// ======================================================

export const createPaymentOrder = async (paymentId) => {
    const response = await fetch(
        `${API_URL}/payments/create-order`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                paymentId,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to create payment order."
        );
    }

    return data;
};


// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

export const verifyPayment = async ({
    paymentId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
}) => {

    const response = await fetch(
        `${API_URL}/payments/verify`,
        {
            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify({
                paymentId,

                razorpay_order_id,

                razorpay_payment_id,

                razorpay_signature,
            }),
        }
    );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to verify payment."
        );
    }


    return data;
};