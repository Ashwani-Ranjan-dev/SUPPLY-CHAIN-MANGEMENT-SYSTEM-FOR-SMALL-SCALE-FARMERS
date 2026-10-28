
const API_URL = import.meta.env.VITE_API_URL;

// Fetch the farmer's existing payment ledger.
export const getFarmerledger = async () => {
    const response = await fetch(
        `${API_URL}/ledger/farmer`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message || "Unable to load ledger."
        );
    }

    return data;
};

// Verify the integrity of the complete hash-chained ledger.
export const verifyLedgerIntegrity = async () => {
    const response = await fetch(
        `${API_URL}/ledger/verify`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    const data = await response.json();

    // Preserve the integrity result even when the backend
    // reports success: false for an invalid ledger.
    if (!response.ok) {
        throw new Error(
            data.message || "Unable to verify ledger integrity."
        );
    }

    const integrity = data.integrity || data;

    if (
        data.success === false &&
        !data.integrity
    ) {
        throw new Error(
            data.message || "Unable to verify ledger integrity."
        );
    }

    return integrity;
};
