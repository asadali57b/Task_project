
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    dob: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    photo: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    order:[
        {
            _id:String,
            name:String,
            price:Number,
            quantity:Number    

        }
    ],

    cart:[
        {
            _id:String,
            name:String,
            price:Number,
            quantity:Number        
        }
    ],
    createdAt: { type: Date, default: Date.now },
    token:{
        type:String
    }
});

module.exports = mongoose.model('User_Services', UserSchema);
