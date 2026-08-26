import User from "../models/User.js";

export const createUser = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            role,
            farmerType,
            location,
        } = req.body;

        if (!name || !phone || !role) {
            return res.status(400).json({
                message:
                    "Name, phone and role are required.",
            });
        }

        if (!["FARMER", "BUYER"].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role.",
            });
        }

        if (
            role === "FARMER" &&
            !["SMALL", "COMMERCIAL", "FPO"].includes(
                farmerType
            )
        ) {
            return res.status(400).json({
                message:
                    "A valid farmer category is required.",
            });
        }

        const existingUser = await User.findOne({
            phone,
        });

        if (existingUser) {
            return res.status(409).json({
                message:
                    "An account with this phone number already exists.",
            });
        }

        const user = await User.create({
            name,
            phone,
            email,
            role,
            farmerType:
                role === "FARMER"
                    ? farmerType
                    : undefined,
            location,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(
            "Create User Error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong while creating the account.",
        });
    }
};