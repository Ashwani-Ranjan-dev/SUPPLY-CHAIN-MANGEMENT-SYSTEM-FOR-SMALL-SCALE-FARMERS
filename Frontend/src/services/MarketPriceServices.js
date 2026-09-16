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