const User= require('../models/user_model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const Joi=require('joi');
// const signinSchema=require('../controllers/joi')
const SignupSchema=require('../controllers/joi')


exports.registerUser= async(req,res)=>{
    
    const { userName, mobile, dob, gender, email, password } = req.body;

    try {
        const {error}=SignupSchema.validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        let user= await User.findOne({email: req.body.email});
    if(user) return res.status(400).json({"message":"User Already resgistered"});
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            userName,
            mobile,
            dob,
            gender,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({  status:"SUCCESSFUL"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.login=async (req,res)=>{

}

 // Replace with your actual user model

// Login validation schema
const signinSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

exports.login = async (req, res) => {
    try {
        // Validate request body
        const { error } = signinSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, msg: error.details[0].message });
        }

        // Find user by email
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, msg: 'Invalid email or password' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, msg: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            'userData', 
            { expiresIn: '24h' }
        );
        user.token = token;
        await user.save();

        // Respond with success
        res.status(200).json({
            success: true,
            msg: 'User logged in successfully',
            token,
            data: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ success: false, msg: 'Server error', error: error.message });
    }
};



exports.profile= async(req,res)=>{
    try{
        const userId=req.user._id;
        userData=await User.findOne({_id:userId})

        res.status(200).json({
            success:true,
            msg:"Profile Data",
            Data:userData
        })
    }
    catch(err){
        res.status(400).json({
            success:false,
            msg:"No Authenticated"
        })
    }
}

 exports.updateProfile=async(req,res)=>{
    try{
        const {id,userName,mobile,email}= req.body;
        const photo = req.file ? req.file.filename : null; 

        let userId=await User.findOne({_id:id});
        if(!userId) return res.status(400).json({msg:"User Id not found"});

        let updateUsername=await User.findOne({_id:id,userName,mobile,email});
        if(updateUsername) return res.status(400).json({msg: "username already assigned"});

        let updatemobile=await User.findOne({_id:id,mobile});
        if(updatemobile) return res.status(400).json({msg: "mobile already assigned"});

        let updateemail=await User.findOne({_id:id,email});
        if(updateemail) return res.status(400).json({msg: "email already assigned"});
        

        var update={
            userName,
            mobile,
            email,
            ...(photo && { photo }) 

        }
        const  updateData= await User.findByIdAndUpdate({_id:id},{$set:update},{new:true})
        return res.status(200).json({
            success:true,
            msg:"Profile Updated Successfully ",
            data:updateData,
        })
        

    }
    catch(err){
        res.status(400).json({
            success:false,
            msg: err,
        })
    }
}

exports.loadDashboard = async (req,res) => {
    try {
        // console.log('Received user body:', req.body);

        console.log("data")
        const { userId } = req.body;
  console.log('Received user data:', userId);

  const user = await User.findById(userId).select('name email');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
   res.status(200).json(user);

    
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};