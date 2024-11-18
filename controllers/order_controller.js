const User=require("../models/user_model");
const mongoose = require("mongoose");

exports.getOrder = async (req, res) => {
    try {
      // Validate if req.user._id exists and is valid
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(400).json({
          STATUS: "FAILED",
          Msg: "User ID is missing or not authenticated.",
        });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          STATUS: "FAILED",
          Msg: "Invalid User ID format.",
        });
      }
  
      // Fetch user and their orders
      const user = await User.findById(userId).populate("order"); // Assuming "order" is a referenced field
      if (!user) {
        return res.status(404).json({
          STATUS: "FAILED",
          Msg: "User not found.",
        });
      }
  
      res.status(200).json({
        STATUS: "SUCCESSFUL",
        Msg: "Order fetched successfully",
        DATA: user.order,
      });
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({
        STATUS: "FAILED",
        Msg: "Server error",
        error: err.message,
      });
    }
  };
  