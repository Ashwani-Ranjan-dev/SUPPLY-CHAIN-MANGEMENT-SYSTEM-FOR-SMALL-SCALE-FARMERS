import mongoose from "mongoose";

const MarketPriceSchema = new mongoose.Schema(
    {
        crop : {
            type : String,
            required : true,
            trim : true
        },
        market : {
            type : String,
            required : true,
            trim : true
        },
        location : {
            type : String,
            required : true,
            trim : true
        },
        unit : {
            type : String,
            enum : 
            [
                "KG",
                "QUINTAL",
                "TON"
            ],
            default : "QUINTAL",
        },
        minPrice : {
            type : Number,
            required : true,
            min : 0
        },
        maxPrice : {
            type : Number,
            required : true,
            min : 0
        },
        modalPrice : {
            type : Number,
            required : true,
            min : 0
        },
        updatedAt: {
            type : Date,
            default : Date.now,
        },
    },{
        timestamps : true,
    }
);

const MarketPrice = mongoose.model("MarketPrice" , MarketPriceSchema);

export default MarketPrice;