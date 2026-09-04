import User from "../models/userSchema.js";
import Otp from "../models/otpSchema.js";
import { generateOtp } from "../utils/otp.js";
import { hashotp } from "../utils/otp.js";
import { generatetoken } from "../utils/jwt.js";

const getOtpExpiry = () => {
    const minutes = Number(
        process.env.OTP_EXPIRES_IN_MINUTES || 5
    );

    return new Date(
        Date.now() + minutes * 60 * 1000
    );
};

export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                message: "Phone number is required.",
            });
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                message:
                    "Enter a valid 10-digit Indian mobile number.",
            });
        }

        const otp = generateOtp();
        const otpHash = hashotp(otp);

        await Otp.deleteMany({
            phone,
        });

        await Otp.create({
            phone,
            otpHash,
            expiresAt: getOtpExpiry(),
        });

        // Development only
        console.log(
            `🔐 OTP for ${phone}: ${otp}`
        );

        return res.status(200).json({
            message:
                "OTP sent successfully.",
        });
    } catch (error) {
        console.error(
            "Send OTP Error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to send OTP.",
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const {
            phone,
            otp,
            userData,
        } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                message:
                    "Phone number and OTP are required.",
            });
        }

        const otpRecord = await Otp.findOne({
            phone,
        });

        if (!otpRecord) {
            return res.status(400).json({
                message:
                    "OTP expired or not found. Please request a new OTP.",
            });
        }

        if (
            otpRecord.expiresAt.getTime() <
            Date.now()
        ) {
            await Otp.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(400).json({
                message:
                    "OTP has expired. Please request a new OTP.",
            });
        }

        if (otpRecord.attempts >= 5) {
            await Otp.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(429).json({
                message:
                    "Too many incorrect attempts. Request a new OTP.",
            });
        }

        const submittedHash = hashotp(otp);

        if (
            submittedHash !== otpRecord.otpHash
        ) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                message:
                    "Invalid OTP.",
            });
        }

        let user = await User.findOne({
            phone,
        });

        /*
         * Existing user
         */
        if (user) {
            user.phoneVerified = true;

            await user.save();
        }

        /*
         * New user
         */
        else {
            if (!userData) {
                return res.status(400).json({
                    message:
                        "Registration information is required.",
                });
            }

            user = await User.create({
                ...userData,
                phone,
                phoneVerified: true,
            });
        }

        await Otp.deleteOne({
            _id: otpRecord._id,
        });

        const token = generatetoken(
            user._id.toString()
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message:
                "Phone verified successfully.",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                phoneVerified:
                    user.phoneVerified,
            },
        });
    } catch (error) {
        console.error(
            "Verify OTP Error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to verify OTP.",
        });
    }
};

export const getCurrentUser = async (
    req,
    res
) => {
    return res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.name,
            phone: req.user.phone,
            role: req.user.role,
            farmerType: req.user.farmerType,
            location: req.user.location,
            phoneVerified:
                req.user.phoneVerified,
        },
    });
};

export const logout = async (
    req,
    res
) => {
    res.clearCookie("token");

    return res.status(200).json({
        message:
            "Logged out successfully.",
    });
};