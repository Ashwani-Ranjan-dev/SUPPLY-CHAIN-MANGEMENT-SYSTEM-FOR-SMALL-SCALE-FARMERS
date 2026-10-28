
import { useState } from "react";
import {
    Download,
    FileText,
    ReceiptText,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const DocumentDownloadButtons = ({
    id,
    type = "deal",
    status,
}) => {
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

    const eligible = ["ACCEPTED", "COMPLETED"].includes(status);

    if (!id || !eligible) return null;

    const downloadDocument = async (documentType) => {
        const key = `${type}-${documentType}`;

        try {
            setLoading(key);
            setError("");

            const endpoint =
                type === "pooled"
                    ? `/documents/pooled-deals/${id}/${documentType}`
                    : `/documents/deals/${id}/${documentType}`;

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    Accept: "application/pdf",
                },
            });

            if (!response.ok) {
                let message = "Unable to download the document.";

                try {
                    const data = await response.json();
                    message = data.message || message;
                } catch {
                    // Keep the default message if the response isn't JSON.
                }

                throw new Error(message);
            }

            const blob = await response.blob();

            if (blob.type && !blob.type.includes("pdf")) {
                throw new Error("The server did not return a PDF.");
            }

            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = objectUrl;
            link.download =
                `${type === "pooled" ? "pooled-" : ""}${documentType}-${id}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(objectUrl);
        } catch (err) {
            console.error("Document download error:", err);
            setError(err.message || "Download failed.");
        } finally {
            setLoading("");
        }
    };

    const busy = Boolean(loading);

    return (
        <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => downloadDocument("contract")}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-800 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading === `${type}-contract` ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <FileText size={16} />
                    )}

                    Download Contract
                </button>

                <button
                    type="button"
                    onClick={() => downloadDocument("invoice")}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading === `${type}-invoice` ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <ReceiptText size={16} />
                    )}

                    Download Invoice
                    <Download size={14} />
                </button>
            </div>

            {error && (
                <p
                    role="alert"
                    className="flex items-start gap-2 text-sm text-red-600"
                >
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default DocumentDownloadButtons;
