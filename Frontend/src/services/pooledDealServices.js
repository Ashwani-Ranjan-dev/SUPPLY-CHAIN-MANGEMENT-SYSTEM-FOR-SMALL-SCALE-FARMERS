
const API_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};

// Buyer: submit an offer for a pooled lot
export const createPooledDeal = (pooledLotId, offeredPrice, message = "") =>
    request("/pooled-deals", {
        method: "POST",
        body: JSON.stringify({ pooledLotId, offeredPrice, message }),
    });

// Buyer: retrieve pooled offers and farmer responses
export const getBuyerPooledDeals = () =>
    request("/pooled-deals/buyer");

// Farmer: accept or reject a pooled offer
export const respondToPooledDeal = (dealId, response) =>
    request(`/pooled-deals/${dealId}/respond`, {
        method: "PATCH",
        body: JSON.stringify({ response }),
    });
