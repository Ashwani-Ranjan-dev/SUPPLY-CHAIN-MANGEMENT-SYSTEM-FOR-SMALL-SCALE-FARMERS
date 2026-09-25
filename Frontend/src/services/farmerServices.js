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

export const getFarmerProfile = async () => {
    const response = await fetch(
        `${API_URL}/farmer/profile`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load farmer profile."
        );
    }

    return data;
};


export const updateFarmerProfile = async (profileData) => {
    const response = await fetch(
        `${API_URL}/farmer/profile`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(profileData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to update farmer profile."
        );
    }

    return data;
};