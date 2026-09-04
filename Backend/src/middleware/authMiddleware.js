import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const protect =  async(
    req,
    res,
    next,
) =>{
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message : "Authentication required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(
            decoded.userId
        ).select("-__v");

        if(!user){
            return res.status(401).json({
                message : "User no longer exists.",
            });
        }

        if(!user.phoneVerified){
            return res.status(401).json({
                message : "Phone verification required.",
            });
        }

        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({
            message : "Invalid or expired authentication token.",
        });
    }
};

