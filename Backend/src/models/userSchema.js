import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        phoneVerified: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            enum: ["FARMER", "BUYER"],
            required: true,
        },

        village: {
            type: String,
            required: true,
            trim: true,
        },

        produceInterest: {
            type: String,
            trim: true,
            default: "",
        },

        farmerType: {
            type: String,
            enum: [
                "SMALL",
                "LARGE",
            ],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model(
    "User",
    userSchema
);

export default User;