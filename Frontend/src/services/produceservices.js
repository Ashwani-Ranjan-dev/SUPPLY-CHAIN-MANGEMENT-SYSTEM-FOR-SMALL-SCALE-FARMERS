const API_URL =  import.meta.env.VITE_API_URL;

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