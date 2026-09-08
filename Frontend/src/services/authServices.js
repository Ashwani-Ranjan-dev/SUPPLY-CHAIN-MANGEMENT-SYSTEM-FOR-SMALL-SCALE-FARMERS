const API_URL =
    import.meta.env.VITE_API_URL;

export const sendOtp = async (phone) => {
    const response = await fetch(
        `${API_URL}/auth/send-otp`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                phone,
            }),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to send OTP."
        );
    }

    return data;
};

export const verifyOtp = async (
    phone,
    otp,
    userData
) => {
    const response = await fetch(
        `${API_URL}/auth/verify-otp`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                phone,
                otp,
                userData,
            }),
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to verify OTP."
        );
    }

    return data;
};

export const getCurrentUser = async () => {
    const response = await fetch(
        `${API_URL}/auth/me`,
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
            "Not authenticated."
        );
    }

    return data;
};

export const logout = async () => {
    const response = await fetch(
        `${API_URL}/auth/logout`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Logout failed."
        );
    }

    return data;
};
