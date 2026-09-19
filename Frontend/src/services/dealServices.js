const API_URL = import.meta.env.VITE_API_URL;


// Get farmer deals
export const getFarmerDeals = async () => {
    const response = await fetch(
        `${API_URL}/deals/farmer`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Unable to load farmer deals."
        );
    }

    return data;
};


// Accept deal
export const acceptDeal = async (id) => {
    const response = await fetch(
        `${API_URL}/deals/${id}/accept`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Unable to accept deal."
        );
    }

    return data;
};


// Reject deal
export const rejectDeal = async (id) => {
    const response = await fetch(
        `${API_URL}/deals/${id}/reject`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
                "Unable to reject deal."
        );
    }

    return data;
};