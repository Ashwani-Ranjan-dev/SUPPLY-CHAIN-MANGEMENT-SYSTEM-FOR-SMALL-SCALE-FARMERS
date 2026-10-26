
import { useState } from "react";
import {
    Star,
    Send,
    LoaderCircle,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

import { createReview } from "../../services/reviewServices";

const ReviewForm = ({
    dealId,
    dealStatus,
    recipientName = "the other party",
    alreadyReviewed = false,
    onSubmitted,
}) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const isCompleted = dealStatus === "COMPLETED";
    const isLocked = alreadyReviewed || submitted;

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!isCompleted) {
            setError("You can review only completed deals.");
            return;
        }

        if (isLocked) {
            setError("You have already reviewed this deal.");
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            setError("Please select a rating from 1 to 5 stars.");
            return;
        }

        if (comment.trim().length > 1000) {
            setError("Feedback cannot exceed 1000 characters.");
            return;
        }

        try {
            setLoading(true);

            const result = await createReview(dealId, {
                rating,
                comment: comment.trim(),
            });

            setSubmitted(true);
            setSuccess(
                result.message || "Your review was submitted successfully."
            );

            if (onSubmitted) {
                await onSubmitted(result.review);
            }
        } catch (err) {
            setError(err.message || "Unable to submit your review.");
        } finally {
            setLoading(false);
        }
    };

    if (!isCompleted) {
        return null;
    }

    if (alreadyReviewed || submitted) {
        return (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                    <p className="font-semibold">Review submitted</p>
                    <p className="mt-1 text-sm">
                        Thank you for sharing your experience with{" "}
                        {recipientName}.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
            <div>
                <h3 className="text-lg font-bold text-gray-900">
                    Rate your experience
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Share your experience with {recipientName}.
                </p>
            </div>

            <div>
                <p className="mb-2 text-sm font-medium text-gray-700">
                    Your rating
                </p>

                <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                    role="group"
                    aria-label="Choose a rating from one to five stars"
                >
                    {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= (hoverRating || rating);

                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                disabled={loading}
                                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                                aria-pressed={rating === star}
                                className="rounded-md p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed"
                            >
                                <Star
                                    className={`h-8 w-8 ${
                                        active
                                            ? "fill-amber-400 text-amber-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    {rating === 0
                        ? "Select a star rating"
                        : [
                              "",
                              "Poor",
                              "Fair",
                              "Good",
                              "Very good",
                              "Excellent",
                          ][rating]}
                </p>
            </div>

            <div>
                <label
                    htmlFor={`review-comment-${dealId}`}
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Written feedback
                </label>

                <textarea
                    id={`review-comment-${dealId}`}
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="How was your experience? (Optional)"
                    maxLength={1000}
                    rows={4}
                    disabled={loading}
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                    {comment.length}/1000 characters
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700"
                >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading || rating === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
                {loading ? (
                    <>
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="h-4 w-4" />
                        Submit review
                    </>
                )}
            </button>
        </form>
    );
};

export default ReviewForm;
