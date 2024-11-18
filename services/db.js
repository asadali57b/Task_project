
const User = require('../models/user_model');

const addToCart = async (userId, productDetail) => {
    try {
        const user = await User.findById(userId);
        if (!user) return { status: "FAILED", message: "User not found" };

        let foundProductInCart = user.cart?.find(product => product._id == productDetail._id);
        if (foundProductInCart) return { status: "FAILED", message: "Product already in cart" };

        user.cart.push(productDetail);
        await user.save();
        return user.cart;
    } catch (error) {
        return { status: "ERROR", message: error.message };
    }
};

const createOrder = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return { status: "FAILED", message: "User not found" };

        user.cart.forEach(item => user.order.push(item));
        user.cart = [];  // Empty the cart after placing the order
        await user.save();
        return user.order;
    } catch (error) {
        return { status: "ERROR", message: error.message };
    }
};

module.exports = { addToCart, createOrder };
