const API_URL =
    import.meta.env.VITE_API_URL;


// Get farmer payments
export const getFarmerPayments =
    async () => {
        const response = await fetch(
            `${API_URL}/payments/farmer`,
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
                    "Unable to load payments."
            );
        }

        return data;
    };


// Get single payment
export const getPaymentById =
    async (id) => {
        const response = await fetch(
            `${API_URL}/payments/${id}`,
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
                    "Unable to load payment."
            );
        }

        return data;
    };