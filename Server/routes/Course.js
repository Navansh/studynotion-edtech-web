const express = require("express");
const router = express.Router();

// Import the Controllers
//Course Controllers
const {
    createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
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

const {
    updateCourseProgress,
    getProgressPercentage,
  } = require("../controllers/courseProgress")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
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
router.post("/getCourseDetails", getCourseDetails);
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
router.delete("/deleteCourse", deleteCourse)

// ********************************************************************************************************
//                                      Category routes
// ********************************************************************************************************

// Show All Categories, 
router.get("/showAllCategories", showAllCategories);
// Create a Category, categories can only be created by Admins
router.post("/createCategory", auth, isAdmin, createCategory);
// Get Category Page Details
router.post("/getCategoryPageDetails", categoryPageDetails);

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
