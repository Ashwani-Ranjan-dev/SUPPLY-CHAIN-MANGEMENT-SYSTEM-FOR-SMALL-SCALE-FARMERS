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

       
        // 1. Basic validation
        if (!phone || !otp) {
            return res.status(400).json({
                message:
                    "Phone number and OTP are required.",
            });
        }

        
        // 2. Find OTP
       
        const otpRecord = await Otp.findOne({
            phone,
        });

        if (!otpRecord) {
            return res.status(400).json({
                message:
                    "OTP expired or not found. Please request a new OTP.",
            });
        }

        // --------------------------------
        // 3. Check expiry
        // --------------------------------
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

        // --------------------------------
        // 4. Check attempts
        // --------------------------------
        if (otpRecord.attempts >= 5) {
            await Otp.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(429).json({
                message:
                    "Too many incorrect attempts. Request a new OTP.",
            });
        }

        // --------------------------------
        // 5. Verify OTP
        // --------------------------------
        const submittedHash = hashotp(otp);

        if (
            submittedHash !== otpRecord.otpHash
        ) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                message: "Invalid OTP.",
            });
        }

        // --------------------------------
        // 6. Check existing user
        // --------------------------------
        let user = await User.findOne({
            phone,
        });

        if (user) {
            user.phoneVerified = true;

            await user.save();
        }

        // --------------------------------
        // 7. Create new user
        // --------------------------------
        else {
            if (!userData) {
                return res.status(400).json({
                    message:
                        "Registration information is required.",
                });
            }

            // console.log(
            //     "USER DATA RECEIVED:",
            //     userData
            // );

            const {
                name,
                role,
                village,
                produceInterest,
                farmerType,
            } = userData;

            // --------------------------------
            // 8. Normalize role
            // --------------------------------
            const normalizedRole = String(role || "")
                .trim()
                .toUpperCase();

            // --------------------------------
            // 9. Validate required fields
            // --------------------------------
            if (!name?.trim()) {
                return res.status(400).json({
                    message:
                        "Name is required.",
                });
            }

            if (!normalizedRole) {
                return res.status(400).json({
                    message:
                        "Role is required.",
                });
            }

            if (!village?.trim()) {
                return res.status(400).json({
                    message:
                        "Village is required.",
                });
            }

            // --------------------------------
            // 10. Validate role
            // --------------------------------
            if (
                !["FARMER", "BUYER"].includes(
                    normalizedRole
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid user role. Role must be FARMER or BUYER.",
                });
            }

            // --------------------------------
            // 11. Farmer-specific validation
            // --------------------------------
            if (
                normalizedRole === "FARMER" &&
                !farmerType
            ) {
                return res.status(400).json({
                    message:
                        "Farmer type is required.",
                });
            }

            // --------------------------------
            // 12. Create user
            // --------------------------------
            user = await User.create({
                name: name.trim(),
                phone,
                role: normalizedRole,
                village: village.trim(),
                produceInterest:
                    String(produceInterest || "").trim(),
                farmerType:
                    normalizedRole === "FARMER"
                        ? farmerType
                        : undefined,
                phoneVerified: true,
            });
        }

        // --------------------------------
        // 13. Delete used OTP
        // --------------------------------
        await Otp.deleteOne({
            _id: otpRecord._id,
        });

        // --------------------------------
        // 14. Generate JWT
        // --------------------------------
        const token = generatetoken(
            user._id.toString()
        );

        // --------------------------------
        // 15. Set cookie
        // --------------------------------
        res.cookie("token", token, {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                    "production"
                    ? "none"
                    : "lax",

            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000,
        });

        // --------------------------------
        // 16. Response
        // --------------------------------
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

export const sendLoginOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        // 1. Validate phone
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required.",
            });
        }

        if (!/^[6-9]\d{9}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Enter a valid 10-digit Indian mobile number.",
            });
        }

        // 2. Check whether user exists
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "No account found with this mobile number. Please register first.",
            });
        }

        // 3. Generate OTP
        const otp = generateOtp();

        // 4. Hash OTP
        const otpHash = hashotp(otp);

        // 5. Remove previous OTP
        await Otp.deleteMany({
            phone,
        });

        // 6. Store new OTP
        await Otp.create({
            phone,
            otpHash,
            expiresAt: getOtpExpiry(),
        });

        // Development only
        console.log(
            `🔐 Login OTP for ${phone}: ${otp}`
        );

        return res.status(200).json({
            success: true,
            message: "Login OTP sent successfully.",
        });

    } catch (error) {
        console.error(
            "Send Login OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to send login OTP.",
        });
    }
};

export const verifyLoginOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // 1. Basic validation
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message:
                    "Phone number and OTP are required.",
            });
        }

        // 2. Find existing user
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message:
                    "No account found. Please register first.",
            });
        }

        // 3. Find OTP
        const otpRecord = await Otp.findOne({
            phone,
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message:
                    "OTP expired or not found. Please request a new OTP.",
            });
        }

        // 4. Check expiry
        if (
            otpRecord.expiresAt.getTime() <
            Date.now()
        ) {
            await Otp.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(400).json({
                success: false,
                message:
                    "OTP has expired. Please request a new OTP.",
            });
        }

        // 5. Check attempts
        if (otpRecord.attempts >= 5) {
            await Otp.deleteOne({
                _id: otpRecord._id,
            });

            return res.status(429).json({
                success: false,
                message:
                    "Too many incorrect attempts. Request a new OTP.",
            });
        }

        // 6. Hash submitted OTP
        const submittedHash = hashotp(otp);

        // 7. Compare OTP
        if (
            submittedHash !== otpRecord.otpHash
        ) {
            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP.",
            });
        }

        // 8. Mark phone verified
        user.phoneVerified = true;

        await user.save();

        // 9. Delete used OTP
        await Otp.deleteOne({
            _id: otpRecord._id,
        });

        // 10. Generate JWT
        const token = generatetoken(
            user._id.toString()
        );

        // 11. Set HttpOnly cookie
        res.cookie("token", token, {
            httpOnly: true,

            secure:
                process.env.NODE_ENV ===
                "production",

            sameSite:
                process.env.NODE_ENV ===
                    "production"
                    ? "none"
                    : "lax",

            maxAge:
                7 *
                24 *
                60 *
                60 *
                1000,
        });

        // 12. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                farmerType: user.farmerType,
                village: user.village,
                phoneVerified:
                    user.phoneVerified,
            },
        });

    } catch (error) {
        console.error(
            "Verify Login OTP Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to verify login OTP.",
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-__v");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(
            "Get current user error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch current user.",
        });
    }
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
