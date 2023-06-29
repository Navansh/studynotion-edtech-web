const express = require("express");
const router = express.Router();

// Import the Controllers
//User Controllers
const {sendOTP, signup, login, changePassword} = require('../controllers/Auth');
const {resetPasswordToken, resetPassword} = require('../controllers/ResetPassword');

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Auth routes
// ********************************************************************************************************

// Send OTP
router.post('/sendOTP', sendOTP);

// Signup
router.post('/signup', signup);

// Login
router.post('/login', login);

// Change Password
router.post('/changePassword', auth, changePassword);

// Reset Password Token
router.post("/reset-password-token", resetPasswordToken)

// Reset Password
router.post('/resetPassword', resetPassword);

module.exports = router;






