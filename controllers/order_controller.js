const User=require("../models/user_model");

exports.getOrder=async(req,res)=>{
    try{
        const userId=req.user._id;
        const user=await User.findById(userId)
        res.status(200).json({
            STATUS: "SUCCESSFUL",
            Msg: "Order fetched successfully",
            DATA: user.order,
        })
    }catch(err){
        res.status(400).json({
            STATUS: "FAILED",
            Msg: err.message,
        })
    }
}