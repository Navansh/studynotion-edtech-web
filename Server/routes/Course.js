const express = require("express");
const router = express.Router();

// Import the Controllers
//Course Controllers
const {
    createCourse,
    getAllCourses,
    getCourseDetails,
} = require("../controllers/Course");

// Categories Controllers
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Categories");

// Sections Controllers
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

// Sub-Sections Controllers
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/Subsection");

// Rating Controllers
const {
    createRatingAndReview,
    getAverageRating,
    getAllRatingAndReview,
} = require("../controllers/RatingAndReview");

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
// Add a Sub-Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);
// Get All Courses
router.get("/getAllCourses", getAllCourses);
// Get Course Details
router.get("/getCourseDetails", getCourseDetails);

// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Show All Categories, 
router.get("/showAllCategories", showAllCategories);
// Create a Category, categories can only be created by Admins
router.post("/createCategory", auth, isAdmin, createCategory);
// Get Category Page Details
router.post("/categoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating routes
// ********************************************************************************************************

// Create a Rating
router.post("/createRating", auth, isStudent, createRatingAndReview);
// Get Average Rating for a Course
router.get("/getAverageRating/:courseID", getAverageRating);
// Get All Ratings for a Course
router.get("/getAllRating/:courseID", getAllRatingAndReview);


module.exports = router;
