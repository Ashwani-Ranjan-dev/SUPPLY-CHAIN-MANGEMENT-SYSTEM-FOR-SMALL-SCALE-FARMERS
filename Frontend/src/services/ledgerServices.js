const API_URL = import.meta.env.VITE_API_URL;

export const getFarmerledger = async()=>{
    const response = await fetch(
        `${API_URL}/ledger/farmer`,
        {
            method : "GET",
            credentials : "include"
        }
    );

    const data = response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to load ledger"
        );
    }

    return data;
}