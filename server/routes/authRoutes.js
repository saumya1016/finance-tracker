const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    verifyLoginOtp, 
    sendOtp, 
    forgotPassword, 
    changePassword,
    getUserProfile 
} = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');


// 1. OTP Service
router.post('/send-otp', sendOtp);

// 2. Signup Flow
router.post('/register', register);

// 3. Two-Step Login Flow 
router.post('/login', login); 
router.post('/verify-login-otp', verifyLoginOtp); 

// 4. Password Recovery
router.post('/forgot-password', forgotPassword);



// 5. User Profile Data
router.get('/me', auth, getUserProfile); 

// 6. Authenticated Password Change
router.post('/change-password', auth, changePassword);

module.exports = router;