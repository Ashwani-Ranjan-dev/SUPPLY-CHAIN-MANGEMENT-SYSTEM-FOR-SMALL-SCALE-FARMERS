
import { useState } from "react";

import {
    Award,
    ChevronDown,
    ChevronUp,
    Sparkles,
    TrendingUp,
} from "lucide-react";

// Convert ranking reasons into readable text.
const getReasonText = (reason) => {
    if (typeof reason === "string") return reason;

    return reason?.message || reason?.reason || reason?.label || "";
};

// Shared reusable recommendation card.
const RecommendationCard = ({
    rank,
    title,
    subtitle,
    confidence,
    score,
    scoreBreakdown,
    explanation,
    rankingReasons = [],
    children,
    scoreLabel = "Recommendation Score",
}) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const confidenceColors = {
        HIGH: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        LOW: "bg-red-100 text-red-700",
    };

    const normalizedConfidence = String(
        confidence || "LOW"
    ).toUpperCase();

    const breakdownEntries =
        scoreBreakdown && typeof scoreBreakdown === "object"
            ? Object.entries(scoreBreakdown).filter(
                ([, value]) =>
                    typeof value === "number" ||
                    typeof value === "string"
            )
            : [];

    const explanationReasons = Array.isArray(explanation?.reasons)
        ? explanation.reasons
        : [];

    const validRankingReasons = Array.isArray(rankingReasons)
        ? rankingReasons.map(getReasonText).filter(Boolean)
        : [];

    return (
        <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:border-green-200 hover:shadow-md">

            {/* CARD HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 font-bold text-green-800">
                        #{rank ?? "-"}
                    </div>

                    <div>
                        <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                            <Award size={14} />
                            AI Ranked
                        </div>

                        <h3 className="font-bold text-gray-800">
                            {title || "Recommended Option"}
                        </h3>

                        {subtitle && (
                            <p className="text-xs text-gray-500">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        confidenceColors[normalizedConfidence] ||
                        confidenceColors.LOW
                    }`}
                >
                    {normalizedConfidence} CONFIDENCE
                </span>
            </div>

            {/* ROLE-SPECIFIC CONTENT */}
            <div className="p-5">

                {children}

                {/* RECOMMENDATION SCORE */}
                {typeof score === "number" && (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-purple-50 p-4">

                        <div>
                            <p className="text-xs font-medium text-purple-700">
                                {scoreLabel}
                            </p>

                            <p className="mt-1 text-xl font-bold text-purple-800">
                                {score.toFixed(2)} / 100
                            </p>
                        </div>

                        <TrendingUp
                            size={24}
                            className="text-purple-600"
                        />
                    </div>
                )}

                {/* AI EXPLANATION */}
                {explanation && (
                    <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4">

                        <div className="flex items-center gap-2 text-purple-800">
                            <Sparkles size={18} />

                            <h4 className="font-bold">
                                {explanation.title || "AI Recommendation"}
                            </h4>
                        </div>

                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                            {explanation.summary ||
                                "No explanation available."}
                        </p>

                        {explanationReasons.length > 0 && (
                            <div className="mt-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowExplanation((previous) => !previous)
                                    }
                                    className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                                >
                                    Why this recommendation?

                                    {showExplanation ? (
                                        <ChevronUp size={16} />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )}
                                </button>

                                {showExplanation && (
                                    <ul className="mt-3 space-y-2">
                                        {explanationReasons.map(
                                            (reason, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 text-sm text-gray-700"
                                                >
                                                    <span className="text-purple-600">
                                                        ✓
                                                    </span>

                                                    <span>
                                                        {getReasonText(reason)}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}

                        {explanation.confidenceLabel && (
                            <p className="mt-3 text-xs font-medium text-purple-700">
                                {explanation.confidenceLabel}
                            </p>
                        )}
                    </div>
                )}

                {/* RANKING REASONS */}
                {validRankingReasons.length > 0 && (
                    <div className="mt-5">

                        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-800">
                            <Award size={17} className="text-green-700" />
                            Ranking Reasons
                        </h4>

                        <ul className="space-y-2">
                            {validRankingReasons.map((reason, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-gray-600"
                                >
                                    <span className="mt-1 text-green-600">
                                        ✓
                                    </span>

                                    <span>{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* SCORE BREAKDOWN */}
                {breakdownEntries.length > 0 && (
                    <div className="mt-5 border-t border-gray-100 pt-4">

                        <button
                            type="button"
                            onClick={() =>
                                setShowBreakdown((previous) => !previous)
                            }
                            className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-green-700"
                        >
                            View ranking breakdown

                            {showBreakdown ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </button>

                        {showBreakdown && (
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {breakdownEntries.map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="rounded-lg bg-gray-50 p-3"
                                    >
                                        <p className="text-xs capitalize text-gray-500">
                                            {key.replace(/([A-Z])/g, " $1")}
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-800">
                                            {typeof value === "number"
                                                ? Number(value.toFixed(2))
                                                : value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </article>
    );
};

export default RecommendationCard;
