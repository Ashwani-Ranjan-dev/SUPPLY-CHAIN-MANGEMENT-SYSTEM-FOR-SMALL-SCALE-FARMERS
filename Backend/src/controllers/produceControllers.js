import Produce from "../models/ProduceSchema.js";
import User from "../models/userSchema.js";

export const createProduce = async (
    req,
    res
) => {
    try {
        const farmer =
            await User.findById(req.user.id);

        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: "Farmer not found.",
            });
        }

        if (farmer.role !== "FARMER") {
            return res.status(403).json({
                success: false,
                message:
                    "Only farmers can create produce listings.",
            });
        }

        const {
            crop,
            quantity,
            unit,
            expectedPrice,
            location,
            quality,
            availableFrom,
            description,
        } = req.body;

        if (
            !crop ||
            !quantity ||
            !unit ||
            expectedPrice === undefined ||
            !location ||
            !availableFrom
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Crop, quantity, unit, expected price, location and availability date are required.",
            });
        }

        if (Number(quantity) <= 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be greater than zero.",
            });
        }

        if (Number(expectedPrice) < 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Expected price cannot be negative.",
            });
        }

        const produce =
            await Produce.create({
                farmer: farmer._id,
                crop: crop.trim(),
                quantity: Number(quantity),
                unit,
                expectedPrice:
                    Number(expectedPrice),
                location: location.trim(),
                quality: quality || "STANDARD",
                availableFrom,
                description:
                    description?.trim() || "",
            });

        return res.status(201).json({
            success: true,
            message:
                "Produce listing created successfully.",
            produce,
        });
    } catch (error) {
        console.error(
            "Create produce error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to create produce listing.",
        });
    }
};