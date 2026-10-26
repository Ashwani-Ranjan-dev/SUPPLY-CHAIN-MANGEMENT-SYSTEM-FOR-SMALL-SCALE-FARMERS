const API_URL = import.meta.env.VITE_API_URL;

export const getMarketPrice = async() =>{
    const response = await fetch(
        `${API_URL}/market-prices`,
        {
            method : "GET",
            credentials: "include"
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to load market Price"
        );
    }

    return data;
}

// Frontend Service to Search the Crop MarketPrice
export const searchMarketPrice = async(crop) =>{
    const response = await fetch(
        `${API_URL}/market-prices/search?crop=${encodeURIComponent(crop)}`,
        {
            method : "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to search Market Price"
        );
    }

    return data;
}


export const getMarketPriceHistory = async ({
    crop,
    market,
    days = 30,
}) => {
    const params = new URLSearchParams({
        crop,
        market,
        days: String(days),
    });

    const response = await fetch(
        `${API_URL}/market-prices/history?${params}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to load market price history."
        );
    }

    return data;
};



export const getMarketPriceStates = async () => {
    const response = await fetch(`${API_URL}/market-prices/states`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to load available states.");
    }

    return data;
};

export const getCurrentMarketPrices = async ({ state, crop }) => {
    const params = new URLSearchParams({ state, crop });

    const response = await fetch(
        `${API_URL}/market-prices/current?${params}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to search current mandi prices."
        );
    }

    return data;
};

// Get the latest mandi synchronization status
export const getMandiSyncStatus = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/market-prices/sync/status`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load sync status."
        );
    }

    return data;
};

// Manually start a mandi-price synchronization
export const syncMandiPrices = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/market-prices/sync`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({}),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Mandi-price synchronization failed."
        );
    }

    return data;
};