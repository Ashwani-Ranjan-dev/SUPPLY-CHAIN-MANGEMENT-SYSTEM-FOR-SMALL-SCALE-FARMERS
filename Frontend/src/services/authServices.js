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

export const sendLoginOtp = async (phone) => {
    const response = await fetch(
        `${API_URL}/auth/send-login-otp`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                phone,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to send login OTP."
        );
    }

    return data;
};

export const verifyLoginOtp = async (
    phone,
    otp
) => {
    const response = await fetch(
        `${API_URL}/auth/verify-login-otp`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                phone,
                otp,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to verify login OTP."
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

export const logoutUser = async () => {
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
