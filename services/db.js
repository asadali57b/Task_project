const User=require('../models/user_model');

const addToCart=async(userId,productDetail)=>{

    try {
        
        const user=await User.findById(userId);
        let foundProductInCart=user.cart?.find(product=>product._id==productDetail._id);
        if(foundProductInCart) return {status:"FAILED",message:"Product already in cart"}
        user.cart.push(productDetail);
        await user.save();
        return user.cart

    } catch (error) {
        return  error
    }

}


const createOrder=async(userId)=>{


        try {
            
            let user=await User.findById(userId);
            user.cart.forEach(item=>user.order.push(item));
           
            user.cart=[];
            await user.save();
            return user.order

        } catch (error) {
            console.log(error)
            return error
        }




}






module.exports={addToCart,createOrder}