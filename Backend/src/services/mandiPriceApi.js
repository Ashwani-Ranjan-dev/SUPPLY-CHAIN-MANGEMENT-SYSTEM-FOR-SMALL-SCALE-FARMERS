const BASE_URL = "https://api.data.gov.in/resource";

const MAX_ATTEMPTS = 4;
const REQUEST_TIMEOUT_MS = 20000;
const INITIAL_RETRY_DELAY_MS = 1000;

const RETRYABLE_STATUS_CODES = new Set([
    429, 500, 502, 503, 504,
]);

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelay = (attempt) =>
    INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1);

export const fetchMandiPrices = async ({
    limit = 100,
    offset = 0,
    state,
    commodity,
    market,
} = {}) => {
    const apiKey = process.env.DATA_GOV_IN_API_KEY?.trim();

    const resourceId = (
        process.env.DATA_GOV_IN_RESOURCE_ID ||
        "9ef84268-d588-465a-a308-a864a43d0070"
    ).trim();

    if (!apiKey) {
        throw new Error(
            "DATA_GOV_IN_API_KEY is missing in backend .env"
        );
    }

    if (!/^[0-9a-f-]{36}$/i.test(resourceId)) {
        throw new Error(
            "DATA_GOV_IN_RESOURCE_ID is invalid"
        );
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
        throw new Error(
            "API limit must be an integer between 1 and 1000"
        );
    }

    if (!Number.isInteger(offset) || offset < 0) {
        throw new Error(
            "API offset must be a non-negative integer"
        );
    }

    const url = new URL(`${BASE_URL}/${resourceId}`);

    url.searchParams.set("api-key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    if (state) {
        url.searchParams.set("filters[state.keyword]", state);
    }

    if (commodity) {
        url.searchParams.set("filters[commodity]", commodity);
    }

    if (market) {
        url.searchParams.set("filters[market]", market);
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        let response;

        // Stage 1: Send the request, retrying transient network failures.
        try {
            response = await fetch(url, {
                signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            });
        } catch (error) {
            const isLastAttempt = attempt === MAX_ATTEMPTS;

            console.warn(
                `[Mandi API] Request failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
                error.message
            );

            if (isLastAttempt) {
                throw new Error(
                    `Unable to fetch mandi prices after ${MAX_ATTEMPTS} attempts: ${error.message}`
                );
            }

            const delay = getRetryDelay(attempt);

            console.log(
                `[Mandi API] Retrying in ${delay / 1000} second(s)...`
            );

            await sleep(delay);
            continue;
        }

        // Stage 2: Read the response body once.
        const responseText = await response.text();

        if (!response.ok) {
            const shouldRetry =
                RETRYABLE_STATUS_CODES.has(response.status);

            const isLastAttempt = attempt === MAX_ATTEMPTS;

            if (shouldRetry && !isLastAttempt) {
                const delay = getRetryDelay(attempt);

                console.warn(
                    `[Mandi API] HTTP ${response.status} ` +
                    `(attempt ${attempt}/${MAX_ATTEMPTS}). ` +
                    `Retrying in ${delay / 1000} second(s).`
                );

                await sleep(delay);
                continue;
            }

            // Never log the request URL; it contains the API key.
            console.error("[Mandi API] HTTP request failed:", {
                status: response.status,
                statusText: response.statusText,
                resourceId,
                limit,
                offset,
                attempts: attempt,
                responseBody: responseText.slice(0, 1000),
            });

            throw new Error(
                `Mandi API returned HTTP ${response.status} ` +
                `after ${attempt} attempt(s). ` +
                "Check backend logs for the upstream response."
            );
        }

        // Stage 3: Validate the successful response.
        let data;

        try {
            data = JSON.parse(responseText);
        } catch {
            console.error(
                "[Mandi API] Received invalid JSON:",
                responseText.slice(0, 500)
            );

            throw new Error(
                "Mandi API returned an invalid JSON response."
            );
        }

        if (!Array.isArray(data.records)) {
            console.error("[Mandi API] Unexpected response:", {
                message: data.message,
                responseKeys: Object.keys(data),
            });

            throw new Error(
                data.message ||
                "Invalid response from the mandi-price API."
            );
        }

        const parsedTotal = Number(data.total);

        return {
            records: data.records,
            total: Number.isFinite(parsedTotal) && parsedTotal >= 0
                ? parsedTotal
                : data.records.length,
        };
    }

    // Defensive fallback; normally the loop returns or throws.
    throw new Error("Mandi API synchronization failed unexpectedly.");
};
