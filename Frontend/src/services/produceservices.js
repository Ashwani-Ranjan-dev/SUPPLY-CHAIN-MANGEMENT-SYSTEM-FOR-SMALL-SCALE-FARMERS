// const API_URL =  import.meta.env.VITE_API_URL;

// // Frontend Services to Create my Produce
// export const createProduce = async(producedata) =>{
//     const response = await fetch(`${API_URL}/produce` , {
//         method : "POST",
//         headers: {
//                     "Content-Type":
//                         "application/json",
//                 },
//         credentials : "include",
//         body : JSON.stringify(
//             producedata
//         ),
//     }
// );

// const data = await response.json();

// if(!response.ok){
//     throw new Error(
//         data.message || "Unable to create produce listings."
//     );
// }

// return data;
// }

// // Frontend Services for GetmyProduce
// export const getMyProduce = async() =>{
//     const response = await fetch(`${API_URL}/produce/my` , 
//         {
//             method : "GET",
//             credentials: "include",
//         }
//     );

//     const data = await response.json();

//     if(!response.ok){
//         throw new Error(
//             data.message || 
//                 "Unable to load your produce"
//         );
//     }

//     return data;
// }

// // Frotend Services for GetProduceById
// export const getProduceById =
//     async (id) => {
//         const response = await fetch(
//             `${API_URL}/produce/${id}`,
//             {
//                 method: "GET",
//                 credentials: "include",
//             }
//         );

//         const data =
//             await response.json();

//         if (!response.ok) {
//             throw new Error(
//                 data.message ||
//                     "Unable to load produce listing."
//             );
//         }

//         return data;
//     };

// // for update Produce Listings.
// export const updateProduce =
//     async (id, produceData) => {
//         const response = await fetch(
//             `${API_URL}/produce/${id}`,
//             {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type":
//                         "application/json",
//                 },
//                 credentials: "include",
//                 body: JSON.stringify(
//                     produceData
//                 ),
//             }
//         );

//         const data =
//             await response.json();

//         if (!response.ok) {
//             throw new Error(
//                 data.message ||
//                     "Unable to update produce listing."
//             );
//         }

//         return data;
//     };

// // For delete listings.
// export const deleteProduce = async(id) =>{
//     const response =  await fetch(`${API_URL}/produce/${id}`, 
//         {
//             method : "DELETE",
//             credentials : "include",
//         }
//     );

//     const data = response.json();

//     if(!response.ok){
//         throw new Error(
//             data.message ||
//             "Unable to remove produce listings."
//         );
//     }

//     return data;
// }



const API_URL = import.meta.env.VITE_API_URL;

// Convert produce fields to FormData for image upload.
// Do not manually set Content-Type: the browser adds
// the multipart/form-data boundary automatically.
const buildProduceFormData = (produceData) => {
    const formData = new FormData();

    Object.entries(produceData).forEach(([key, value]) => {
        // Image must be appended as a file, not as a string.
        if (key === "image") {
            if (value instanceof File) {
                formData.append("image", value);
            }
            return;
        }

        // These fields are managed by the backend.
        if (
            key === "imageUrl" ||
            key === "imagePublicId" ||
            value === undefined ||
            value === null
        ) {
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
};

// Create produce listing
export const createProduce = async (produceData) => {
    const formData = buildProduceFormData(produceData);

    const response = await fetch(`${API_URL}/produce`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to create produce listing."
        );
    }

    return data;
};

// Get farmer's produce listings
export const getMyProduce = async () => {
    const response = await fetch(`${API_URL}/produce/my`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load your produce."
        );
    }

    return data;
};

// Get a single farmer-owned produce listing
export const getProduceById = async (id) => {
    const response = await fetch(
        `${API_URL}/produce/${id}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to load produce listing."
        );
    }

    return data;
};

// Update produce listing
export const updateProduce = async (id, produceData) => {
    const formData = buildProduceFormData(produceData);

    const response = await fetch(
        `${API_URL}/produce/${id}`,
        {
            method: "PUT",
            credentials: "include",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to update produce listing."
        );
    }

    return data;
};

// Delete (soft-delete) a produce listing
export const deleteProduce = async (id) => {
    const response = await fetch(
        `${API_URL}/produce/${id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Unable to remove produce listing."
        );
    }

    return data;
};
