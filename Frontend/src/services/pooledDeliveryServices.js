
const API_URL = import.meta.env.VITE_API_URL;

const POOLED_DELIVERY_URL = `${API_URL}/pooled-deliveries`;

// Shared API helper
const pooledDeliveryRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${POOLED_DELIVERY_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message || "Pooled delivery request failed."
        );
    }

    return data;
};

// Create delivery after the pooled payment is verified.
export const createPooledDelivery = async ({
    pooledDealId,
    deliveryLocation,
    notes = "",
}) => {
    return pooledDeliveryRequest("", {
        method: "POST",
        body: JSON.stringify({
            pooledDealId,
            deliveryLocation,
            notes,
        }),
    });
};

// Get pooled deliveries belonging to the logged-in buyer.
export const getBuyerPooledDeliveries = async () => {
    return pooledDeliveryRequest("/buyer");
};

// Get pooled deliveries involving the logged-in farmer.
export const getFarmerPooledDeliveries = async () => {
    return pooledDeliveryRequest("/farmer");
};

// Get one pooled delivery by its ID.
export const getPooledDeliveryById = async (deliveryId) => {
    if (!deliveryId) {
        throw new Error("Pooled delivery ID is required.");
    }

    return pooledDeliveryRequest(
        `/${encodeURIComponent(deliveryId)}`
    );
};

// Update the status of a pooled delivery.
export const updatePooledDeliveryStatus = async (
    deliveryId,
    updateData
) => {
    if (!deliveryId) {
        throw new Error("Pooled delivery ID is required.");
    }

    return pooledDeliveryRequest(
        `/${encodeURIComponent(deliveryId)}/status`,
        {
            method: "PATCH",
            body: JSON.stringify(updateData),
        }
    );
};
