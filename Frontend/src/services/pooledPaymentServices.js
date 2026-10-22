
const API_URL = import.meta.env.VITE_API_URL;

export const createPooledPaymentOrder = async (pooledDealId) => {
    const response = await fetch(
        `${API_URL}/pooled-payments/create-order`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ pooledDealId }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to create payment order.");
    }

    return data;
};

export const verifyPooledPayment = async (paymentDetails) => {
    const response = await fetch(
        `${API_URL}/pooled-payments/verify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(paymentDetails),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Payment verification failed.");
    }

    return data;
};
