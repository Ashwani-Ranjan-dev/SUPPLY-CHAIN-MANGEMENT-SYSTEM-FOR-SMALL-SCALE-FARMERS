import Produce from "../models/ProduceSchema.js";
import User from "../models/userSchema.js";

// Controller to create produce
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

// Controller to GetMyProduce
export const getMyProduce = async (req, res) => {
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
                    "Only farmers can access their produce listings.",
            });
        }

        const produce =
            await Produce.find({
                farmer: farmer._id,
            }).sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: produce.length,
            produce,
        });
    } catch (error) {
        console.error(
            "Get my produce error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load your produce listings.",
        });
    }
};

// Controller to get produce by ID
export const getProduceById = async (
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
                    "Only farmers can access produce listings.",
            });
        }

        const produce =
            await Produce.findOne({
                _id: req.params.id,
                farmer: farmer._id,
            });

        if (!produce) {
            return res.status(404).json({
                success: false,
                message:
                    "Produce listing not found or access denied.",
            });
        }

        return res.status(200).json({
            success: true,
            produce,
        });
    } catch (error) {
        console.error(
            "Get produce by id error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to load produce listing.",
        });
    }
};

// Controller to Update the Produce
export const updateProduce = async (
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
                    "Only farmers can update produce listings.",
            });
        }

        const produce =
            await Produce.findOne({
                _id: req.params.id,
                farmer: farmer._id,
            });

        if (!produce) {
            return res.status(404).json({
                success: false,
                message:
                    "Produce listing not found or access denied.",
            });
        }

        if (produce.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message:
                    "Only active produce listings can be edited.",
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
            quantity === undefined ||
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

        const validUnits = [
            "KG",
            "QUINTAL",
            "TON",
        ];

        if (!validUnits.includes(unit)) {
            return res.status(400).json({
                success: false,
                message: "Invalid unit.",
            });
        }

        const validQualities = [
            "STANDARD",
            "GOOD",
            "PREMIUM",
        ];

        if (
            quality &&
            !validQualities.includes(quality)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid quality.",
            });
        }

        produce.crop = crop.trim();
        produce.quantity = Number(quantity);
        produce.unit = unit;
        produce.expectedPrice =
            Number(expectedPrice);
        produce.location = location.trim();
        produce.quality =
            quality || "STANDARD";
        produce.availableFrom =
            availableFrom;
        produce.description =
            description?.trim() || "";

        await produce.save();

        return res.status(200).json({
            success: true,
            message:
                "Produce listing updated successfully.",
            produce,
        });
    } catch (error) {
        console.error(
            "Update produce error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to update produce listing.",
        });
    }
};

// Controller to Delete the Produce
export const deleteProduce = async (
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
                    "Only farmers can remove produce listings.",
            });
        }

        const produce =
            await Produce.findOne({
                _id: req.params.id,
                farmer: farmer._id,
            });

        if (!produce) {
            return res.status(404).json({
                success: false,
                message:
                    "Produce listing not found or access denied.",
            });
        }

        if (produce.status === "SOLD") {
            return res.status(400).json({
                success: false,
                message:
                    "Sold produce listings cannot be removed.",
            });
        }

        if (produce.status === "INACTIVE") {
            return res.status(400).json({
                success: false,
                message:
                    "Produce listing is already inactive.",
            });
        }

        produce.status = "INACTIVE";

        await produce.save();

        return res.status(200).json({
            success: true,
            message:
                "Produce listing removed successfully.",
            produce,
        });
    } catch (error) {
        console.error(
            "Delete produce error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to remove produce listing.",
        });
    }
};