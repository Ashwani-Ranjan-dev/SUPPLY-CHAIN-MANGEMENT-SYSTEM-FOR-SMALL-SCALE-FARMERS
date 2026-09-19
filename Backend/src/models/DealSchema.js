import mongoose from "mongoose";

const dealSchema = new mongoose.Schema({
    
    farmer: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    buyer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    produce : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Produce",
        required : true
    },
    quantity : {
        type : Number,
        required : true,
        min : 0.1
    },
    unit : {
        type : String,
        enum : ["KG" , "QUINTAL" , "TON"],
        required : true
    },
    offeredPrice : {
        type : Number,
        required : true,
        min : 0
    },
    totalAmount :  {
        type : Number,
        required : true,
        min : 0
    },
    message : {
        type : String,
        trim : true,
        default : ""
    },
    status : {
        type : String,
        enum : [
            "PENDING",
            "ACCEPTED",
            "REJECTED",
            "CANCELLED",
            "COMPLETED"
        ],
        default : "PENDING"
    },
},
{
    timestamps: true,
}
);

const Deal = mongoose.model("Deal" , dealSchema);

export default Deal;