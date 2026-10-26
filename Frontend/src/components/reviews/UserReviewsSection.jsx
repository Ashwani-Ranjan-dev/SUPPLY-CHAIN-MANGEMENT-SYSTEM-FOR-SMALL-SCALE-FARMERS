import { useCallback, useEffect, useState } from "react";
import {
    Star,
    MessageSquare,
    RefreshCw,
    AlertCircle,
    LoaderCircle,
    Users,
} from "lucide-react";

import { getUserReviews } from "../../services/reviewServices.js";

const UserReviewsSection = ({ userId }) => {
    const [reviewData, setReviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadReviews = useCallback(async (isRefresh = false) => {
        if (!userId) {
            setLoading(false);
            setError("User ID is unavailable. Unable to load reviews.");
            return;
        }

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data = await getUserReviews(userId);
            setReviewData(data);
        } catch (err) {
            setError(err.message || "Unable to load reviews.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    const summary = reviewData?.summary || {};
    const reviews = Array.isArray(reviewData?.reviews)
        ? reviewData.reviews
        : [];

    const averageRating = Number(summary.averageRating || 0);
    const reviewCount = Number(summary.reviewCount || 0);
    const fiveStarCount = Number(summary.fiveStarCount || 0);

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
                            <Star size={20} />
                        </div>

                        <h2 className="text-lg font-bold text-gray-900">
                            Ratings & Reviews
                        </h2>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Feedback received from your completed deals.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => loadReviews(true)}
                    disabled={loading || refreshing || !userId}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {refreshing ? (
                        <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                        <RefreshCw size={16} />
                    )}

                    Refresh Reviews
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center gap-3 py-12 text-sm text-gray-500">
                    <LoaderCircle
                        size={20}
                        className="animate-spin text-green-600"
                    />
                    Loading ratings and reviews...
                </div>
            ) : error ? (
                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-600"
                        />

                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Unable to load reviews
                            </p>

                            <p className="mt-1 text-sm text-red-600">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() => loadReviews()}
                                className="mt-3 text-sm font-semibold text-red-700 underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Rating summary */}
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
                            <p className="text-sm font-medium text-gray-600">
                                Average Rating
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                                <Star
                                    size={25}
                                    className="fill-amber-400 text-amber-400"
                                />

                                <span className="text-3xl font-bold text-gray-900">
                                    {averageRating.toFixed(1)}
                                </span>

                                <span className="mt-2 text-sm text-gray-500">
                                    / 5
                                </span>
                            </div>

                            <div className="mt-2 flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={15}
                                        className={
                                            star <= Math.round(averageRating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-100 bg-green-50/60 p-5">
                            <p className="text-sm font-medium text-gray-600">
                                Reviews Received
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <MessageSquare
                                    size={23}
                                    className="text-green-600"
                                />

                                <span className="text-3xl font-bold text-gray-900">
                                    {reviewCount}
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Total submitted reviews
                            </p>
                        </div>

                        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                            <p className="text-sm font-medium text-gray-600">
                                Five-Star Reviews
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                                <Star
                                    size={23}
                                    className="fill-blue-500 text-blue-500"
                                />

                                <span className="text-3xl font-bold text-gray-900">
                                    {fiveStarCount}
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Excellent feedback received
                            </p>
                        </div>
                    </div>

                    {/* Individual reviews */}
                    <div className="mt-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">
                                Recent Reviews
                            </h3>

                            <span className="text-xs text-gray-500">
                                {reviews.length} shown
                            </span>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
                                    <Users size={23} />
                                </div>

                                <h4 className="mt-4 font-semibold text-gray-800">
                                    No reviews yet
                                </h4>

                                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500">
                                    Reviews from the other party will appear
                                    here after a completed deal has been
                                    reviewed.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => {
                                    const reviewerName =
                                        review.reviewer?.name ||
                                        review.reviewerName ||
                                        "KrishiConnect user";

                                    const rating = Math.min(
                                        5,
                                        Math.max(0, Number(review.rating) || 0)
                                    );

                                    return (
                                        <article
                                            key={review._id || review.id}
                                            className="rounded-2xl border border-gray-100 p-4 transition hover:border-green-200 sm:p-5"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                                                    {reviewerName
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">
                                                                {reviewerName}
                                                            </h4>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {formatDate(
                                                                    review.createdAt
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div
                                                            className="flex items-center gap-1"
                                                            aria-label={`${rating} out of 5 stars`}
                                                        >
                                                            {[1, 2, 3, 4, 5].map(
                                                                (star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={16}
                                                                        className={
                                                                            star <= rating
                                                                                ? "fill-amber-400 text-amber-400"
                                                                                : "text-gray-300"
                                                                        }
                                                                    />
                                                                )
                                                            )}

                                                            <span className="ml-1 text-sm font-semibold text-gray-700">
                                                                {rating}/5
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                                                        {review.comment?.trim()
                                                            ? review.comment
                                                            : "No written comment provided."}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default UserReviewsSection;