const API_URL = import.meta.env.VITE_API_URL;

export const createUser = async (userData) => {
    const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create user");
    }

    return data;
};