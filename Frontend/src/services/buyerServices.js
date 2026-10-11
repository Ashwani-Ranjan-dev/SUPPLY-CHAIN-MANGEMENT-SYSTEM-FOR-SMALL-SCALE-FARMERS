const API_URL = import.meta.env.VITE_API_URL;

// GET BUYER DASHBOARD

export const getBuyerDashboard = async () => {
    const response = await fetch(
        `${API_URL}/buyer/dashboard`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load Buyer Dashboard"
        );
    }

    return data;
};

// Fronted API services for the Buyer Profile
export const getbuyerprofile = async() =>{
    const response = await fetch(
        `${API_URL}/buyer/profile`, 
        {
            method:"GET",
            credentials : "include"
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to load Buyer Profile"
        );
    }

    return data;
};


// Frontend API services for the Buyer Profile Update
export const updateBuyerProfile = async()=>{
    const response = await fetch(
            `${API_URL}/buyer/profile`,
            {
                method : "PUT",
                credentials : "include"
            },
    );

    const data = response.json();

    if(!response.ok){
        throw new Error(
            data.message || 
            "Unable to update Buyer profile."
        )
    }

    return data;
}

// Fetch Active Produce listings for the Marketplace
export const getMarketplaceProduce = async(req, res)=>{
    const response = await fetch(
        `${API_URL}/produce`,
        {
            method : "GET",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json",
            },
        }
    );

    const data = response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to load marketplace produce"
        );
    }

    return data;
}

// Get buyer Produce Deal with their Id
export const getMarketplaceProduceById = async (produceId)=>{
    const response = await fetch(
        `${API_URL}/produce/market/${produceId}`,
        {
            method : "GET",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json",
            },
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to load produce details."
        );
    }

    return data;
}

// Frontend Services for Creating Deal
export const createBuyerDeal = async({
    produce,
    quantity,
    offeredPrice,
    message
})=>{
    const response = await fetch(
        `${API_URL}/deals/`,
        {
            method : "POST",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                produce,
                quantity : Number(quantity),
                offeredPrice : Number(offeredPrice),
                message,
            }),
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to Create Your Offer"
        )
    }

    return data;
}

// Frontend Services to get the  Buyer payment History
export const getBuyerPayments = async(req , res)=>{
    const response = await fetch(
        `${API_URL}/payments/buyer`,{
            method : "GET",
            credentials:"include",
            headers : {
                "Content-Type" : "application/json"
            },
        }
    );

    const data = response.json();

    if(!response.ok){
        throw new Error(
            data.message || 
            "Unable to load Buyer Payment History"
        );
    }

    return data;
}