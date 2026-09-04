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

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        role: {
            type: String,
            enum: ["FARMER", "BUYER", "ADMIN"],
            required: true,
        },

        farmerType: {
            type: String,
            enum: ["SMALL", "COMMERCIAL", "FPO"],
        },

        location: {
            village: {
                type: String,
                trim: true,
            },

            district: {
                type: String,
                trim: true,
            },

            state: {
                type: String,
                trim: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;