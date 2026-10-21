
const API_URL = import.meta.env.VITE_API_URL;

const request = async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Unable to load pooled lots."
        );
    }

    return result;
};

export const getOpenPooledLots = async () => {
    return request("/pooling");
};

export const getPooledLotById = async (id) => {
    return request(`/pooling/${id}`);
};


export const generatePooledLots = async (windowDays = 3) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/pooling/generate`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ windowDays }),
        }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || "Unable to generate pooled lots.");
    }

    return result;
};
