import Produce from "../models/ProduceSchema.js";
import Deal from "../models/DealSchema.js";
import User from "../models/userSchema.js";

// ==================================================
// GET BUYER DASHBOARD STATISTICS
// ==================================================

export const getBuyerDashboard = async (req, res) => {
    try {
        // --------------------------------------------------
        // 1. Make sure the logged-in user is a buyer
        // --------------------------------------------------

        if (req.user.role !== "BUYER") {
            return res.status(403).json({
                message: "Only buyers can access the buyer dashboard.",
            });
        }


        // --------------------------------------------------
        // 2. Count available produce
        // --------------------------------------------------

        const availableProduce = await Produce.countDocuments({
            status: "ACTIVE",
        });


        // --------------------------------------------------
        // 3. Count active deals
        // --------------------------------------------------

        const activeDeals = await Deal.countDocuments({
            buyer: req.user._id,
            status: "ACCEPTED",
        });


        // --------------------------------------------------
        // 4. Count pending deals
        // --------------------------------------------------

        const pendingDeals = await Deal.countDocuments({
            buyer: req.user._id,
            status: "PENDING",
        });


        // --------------------------------------------------
        // 5. Count completed deals
        // --------------------------------------------------

        const completedDeals = await Deal.countDocuments({
            buyer: req.user._id,
            status: "COMPLETED",
        });


        // --------------------------------------------------
        // 6. Send dashboard statistics
        // --------------------------------------------------

        return res.status(200).json({
            success: true,

            statistics: {
                availableProduce,
                activeDeals,
                pendingDeals,
                completedDeals,
            },
        });

    } catch (error) {
        console.error(
            "Get buyer dashboard error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to load buyer dashboard.",
        });
    }
};


// Get Buyer Profile
export const getBuyerProfile = async(req , res)=>{
    try{
         const buyer = await User.findById(req.user._id).select(
       "name phone role village phoneVerified"
    );

    if(!buyer){
        return res.status(404).json({
            success : false,
            message : "Buyer not Found"
        });
    }

    if(buyer.role !== "BUYER"){
        return res.status(403).json({
            success : false,
            message : "Only Buyer can access the Profile"
        });
    }

    return res.status(200).json({
        success : true,
        buyer
    });
    }
    catch(error){
        console.error("Get Buyer Profile Error:" , error);

        return res.status(500).json({
            success : false,
            message : "Unable to get Buyer Profile"
        });
    }
}

// Update Buyer Profile
export const updateBuyerProfile = async(req , res)=>{
    try{
        const buyer = await User.findById(req.user.id);

        if(!buyer){
            return res.status(404).json({
                success : false,
                message : "Buyer not found"
            });
        }

        if(buyer.role !== "BUYER"){
            return res.status(403).json({
                success : false,
                message : "Only Buyer can update their profile."
            });
        }

        const {
            name,
            village,
            location      
        } = req.body;

        if(!name || !name.trim()){
            return res.status(400).json({
                success : false,
                message : "Name is required"
            });
        }

        if(!village || !village.trim()){
            return res.status(400).json({
                success : false,
                message : "Village is required"
            });
        }

        if(!location || !location.trim()){
            return res.status(400).json({
                message : "Location is required"
            });
        }

        buyer.name = name.trim();
        buyer.village = village.trim();
        buyer.location = location.trim();

        await buyer.save();

         return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            farmer: {
                id: buyer._id,
                name: buyer.name,
                phone: buyer.phone,
                village: buyer.village,
                phoneVerified: buyer.phoneVerified,
            },
        })
    }
    catch(error){
         console.error("Update Buyer profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update Buyer profile.",
        });
    }
}