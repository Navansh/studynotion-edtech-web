const express = require("express");
const router = express.Router();

// Import the Controllers
//Profile Controllers
const { updateProfile, getAllUserDetails, deleteAccount, getEnrolledCourses, updateDisplayPicture } = require("../controllers/Profile");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Update Profile
router.put("/updateProfile", auth, updateProfile);

// Get All User Details
router.get("/getAllUserDetails", auth, getAllUserDetails);

// Delete Account
router.delete("/deleteProfile",auth, deleteAccount);

router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);


module.exports = router;

