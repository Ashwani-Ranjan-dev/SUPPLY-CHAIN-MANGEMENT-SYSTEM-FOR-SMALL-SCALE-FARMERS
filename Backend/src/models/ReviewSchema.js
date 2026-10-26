
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        deal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deal",
            required: true,
            index: true,
        },

        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: "Rating must be a whole number from 1 to 5.",
            },
        },

        comment: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// One review per reviewer for each deal.
reviewSchema.index(
    { deal: 1, reviewer: 1 },
    { unique: true }
);

// Efficiently load reviews received by a user.
reviewSchema.index({ recipient: 1, createdAt: -1 });

const Review =
    mongoose.models.Review ||
    mongoose.model("Review", reviewSchema);

export default Review;
