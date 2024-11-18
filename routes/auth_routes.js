// const express=require("express");
//  const router=express();
//  const auth=require('../middleware/auth')
//  const upload=require('../middleware/uploadFile')

// const {registerUser,login,profile,updateProfile}=require('../controllers/auth_controller')


// router.post('/register',registerUser)
// router.post('/login',login)

// router.get('/profile',auth,profile)
// router.post('/updateProfile',auth,upload.single('photo'),updateProfile)

const express = require("express");
const router = express.Router(); // Correct way to create a router
const auth = require('../middleware/auth');
const upload = require('../middleware/uploadFile');
const {getOrder}=require('../controllers/order_controller')

const {
  registerUser,
  login,
  profile,
  updateProfile,
  loadDashboard
} = require('../controllers/auth_controller');

router.post('/register', registerUser);
router.post('/login', login);

router.get('/profile', auth, profile);
router.post('/updateProfile', auth, upload.single('photo'), updateProfile);
router.post('/dashboard', loadDashboard);
router.get('/getAllOrders', auth, getOrder);
module.exports = router; // Export the router
