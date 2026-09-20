const API_URL =
    import.meta.env.VITE_API_URL;


// Get farmer deliveries
export const getFarmerDeliveries =
    async () => {
        const response = await fetch(
            `${API_URL}/deliveries/farmer`,
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
                    "Unable to load deliveries."
            );
        }

        return data;
    };


// Get single delivery
export const getDeliveryById =
    async (id) => {
        const response = await fetch(
            `${API_URL}/deliveries/${id}`,
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
                    "Unable to load delivery."
            );
        }

        return data;
    };


// Update delivery status
export const updateDeliveryStatus =
    async (id, status) => {
        const response = await fetch(
            `${API_URL}/deliveries/${id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    status,
                }),
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.message ||
                    "Unable to update delivery."
            );
        }

        return data;
    };