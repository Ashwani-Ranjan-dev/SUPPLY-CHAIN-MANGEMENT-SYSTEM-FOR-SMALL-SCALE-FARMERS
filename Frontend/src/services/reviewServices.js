
const API_URL = import.meta.env.VITE_API_URL;

// Submit a review for a completed deal.
export const createReview = async (dealId, reviewData) => {
    const response = await fetch(
        `${API_URL}/reviews/deal/${dealId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(reviewData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to submit review.");
    }

    return data;
};

// Load reviews received and given by the logged-in user.
export const getMyReviews = async () => {
    const response = await fetch(`${API_URL}/reviews/me`, {
        method: "GET",
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to load your reviews.");
    }

    return data;
};

// Load public rating summary and review history for a user.
export const getUserReviews = async (userId) => {
    const response = await fetch(
        `${API_URL}/reviews/user/${userId}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to load user reviews.");
    }

    return data;
};
