const API_URL =  import.meta.env.VITE_API_URL;

// Frontend Services to Create my Produce
export const createProduce = async(producedata) =>{
    const response = await fetch(`${API_URL}/produce` , {
        method : "POST",
        headers: {
                    "Content-Type":
                        "application/json",
                },
        credentials : "include",
        body : JSON.stringify(
            producedata
        ),
    }
);

const data = await response.json();

if(!response.ok){
    throw new Error(
        data.message || "Unable to create produce listings."
    );
}

return data;
}

// Frontend Services for GetmyProduce
export const getMyProduce = async() =>{
    const response = await fetch(`${API_URL}/produce/my` , 
        {
            method : "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.message || 
                "Unable to load your produce"
        );
    }

    return data;
}

// Frotend Services for GetProduceById
export const getProduceById =
    async (id) => {
        const response = await fetch(
            `${API_URL}/produce/${id}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                    "Unable to load produce listing."
            );
        }

        return data;
    };

// for update Produce Listings.
export const updateProduce =
    async (id, produceData) => {
        const response = await fetch(
            `${API_URL}/produce/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify(
                    produceData
                ),
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                    "Unable to update produce listing."
            );
        }

        return data;
    };

// For delete listings.
export const deleteProduce = async(id) =>{
    const response =  await fetch(`${API_URL}/produce/${id}`, 
        {
            method : "DELETE",
            credentials : "include",
        }
    );

    const data = response.json();

    if(!response.ok){
        throw new Error(
            data.message ||
            "Unable to remove produce listings."
        );
    }

    return data;
}