
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
        throw new Error(result.message || "Request failed.");
    }

    return result;
};

// Get pooled offers involving the logged-in farmer
export const getFarmerPooledDeals = () =>
    request("/pooled-deals/farmer");

// Respond to a pooled offer
export const respondToFarmerPooledDeal = (dealId, response) =>
    request(`/pooled-deals/${dealId}/respond`, {
        method: "PATCH",
        body: JSON.stringify({ response }),
    });
