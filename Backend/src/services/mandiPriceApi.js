
const BASE_URL = "https://api.data.gov.in/resource";

export const fetchMandiPrices = async ({
    limit = 1000,
    offset = 0,
    state,
    commodity,
    market,
} = {}) => {
    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    const resourceId =
        process.env.DATA_GOV_IN_RESOURCE_ID ||
        "9ef84268-d588-465a-a308-a864a43d0070";

    if (!apiKey) {
        throw new Error(
            "DATA_GOV_IN_API_KEY is missing in backend .env"
        );
    }

    const url = new URL(`${BASE_URL}/${resourceId}`);

    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    if (state) {
        url.searchParams.set("filters[state]", state);
    }

    if (commodity) {
        url.searchParams.set("filters[commodity]", commodity);
    }

    if (market) {
        url.searchParams.set("filters[market]", market);
    }

    const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
        throw new Error(
            `Mandi API returned HTTP ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data.records)) {
        throw new Error(
            data.message ||
            "Invalid response from the mandi-price API"
        );
    }

    return {
        records: data.records,
        total: Number(data.total || data.records.length),
    };
};
