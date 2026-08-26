import {
    CheckCircle2,
    AlertCircle,
    X,
} from "lucide-react";

const Alert = ({
    type = "error",
    message,
    onClose,
}) => {
    const isSuccess = type === "success";

    return (
        <div
            className={`
                flex
                items-start
                gap-3
                rounded-xl
                border
                px-4
                py-3
                ${
                    isSuccess
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                }
            `}
        >
            {isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}

            <p className="flex-1 text-sm font-medium">
                {message}
            </p>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1 transition hover:bg-black/5"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default Alert;