const API_URL = import.meta.env.VITE_API_URL;

export const getFarmerDashboard = async ()=>{
    const response = await fetch(`${API_URL}/farmer/dashboard`, 
        {
            method : "GET",
            credentials : "include",
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message || "Unable to load Farmer Dashboard"
        );
    }

    return data;
};