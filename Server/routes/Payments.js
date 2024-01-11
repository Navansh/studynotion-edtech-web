const express = require("express");
const router = express.Router();

// Import the Controllers
const {capturePayment,verifyPayment,
    sendPaymentSuccessEmail,} = require('../controllers/Payments');

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Payment routes
// ********************************************************************************************************

// Capture Payment
router.post('/capturePayment', auth, isStudent, capturePayment);

// Verify Signature
router.post("/verifyPayment", auth, isStudent, verifyPayment)

router.post(
    "/sendPaymentSuccessEmail",
    auth,
    isStudent,
    sendPaymentSuccessEmail
  )

module.exports = router;
