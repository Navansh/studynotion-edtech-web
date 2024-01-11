const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const Section = require("../models/Section");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Category = require("../models/Category");
const SubSection = require("../models/Subsection");
const { convertSecondsToDuration } = require("../utils/secToDuration");

//createCourse
exports.createCourse = async (req, res) => {
  try {
    //user state currently -> He is logged in
    //checks -> if he is an instructor
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      language = "English",
      category,
      instructions,
      status,
    } = req.body;

    console.log("These are the tags received", tag);

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    // console.log(thumbnail)

    const newTag = JSON.parse(tag);
    const newInstructions = JSON.parse(instructions);

    // console.log("These are all the fields", courseName, courseDescription, whatYouWillLearn, price, tag, language, category, instructions, status)

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    //check for instructor
    //why we need to check for instructor ? -> because we need to store its ObjectId in the course document
    const userID = req.user.id;
    //using this ID, we find instructor in the DB
    if (!userID) {
      return res.status(400).json({
        success: false,
        message: "User ID not found",
      });
    }

    const instructorDetails = await User.findById(userID);
    console.log(instructorDetails);

    //why calling this ? when we have user.id
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor not found",
      });
    }

    //check for a valid tag, Why ? as frontend mein toh dropdown hoga
    //as when we'll test this API using Postman, we'll send tag and then this will be required

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }
    //upload image to cloudinary
    const thumbnailDetails = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );
    //tempFilePath is the path where the image is stored temporarily

    //create an entry for new course in the DB
    const newCourseDetails = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tag: newTag,
      category: categoryDetails._id,
      status: status,
      instructions: newInstructions,
      language,
      thumbnail: thumbnailDetails.secure_url,
    });

    console.log(newCourseDetails);

    //update the instructor object with the course id
    //hence effectively pushing the created Course in the instrucotr's courses list
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourseDetails._id,
        },
      },
      { new: true }
    );

    console.log(
      "This is ID used to enter in the categories of the masti",
      category
    );
    const categoryResult = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourseDetails._id,
        },
      },
      { new: true }
    );

    // console.log("This the result of the API Call, pushing this data", categoryResult)

    //update the tag object with the course id
    // tagDetails.course.push(courseDetails._id);
    // await tagDetails.save();

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourseDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//getAllCourses
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        courseDescription: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const courseID = req.body.courseId;

    const courseDetails = await Course.findOne({
      _id: courseID,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseID}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })

    // const courseDetails = await Course.findById(courseID)
    //   .populate({
    //     path: "instructor",
    //     populate: {
    //       path: "additionalDetails",
    //     },
    //   })
    //   .populate("category")
    //   .populate("ratingAndReviews")
    //   .populate({
    //     path: "courseContent",
    //     populate: {
    //       path: "subSections",
    //     },
    //   })
    //   .exec();

    // if (!courseDetails) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Course with courseId : " + courseID + " not found",
    //   });
    // }

    // return res.status(200).json({
    //   success: true,
    //   message: "Course details fetched successfully",
    //   data: courseDetails,
    // });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// exports.getCourseDetails = async (req, res) => {
//     try {
//             //get id
//             const {courseId} = req.body;
//             //find course details
//             const courseDetails = await Course.find(
//                                         {_id:courseId})
//                                         .populate(
//                                             {
//                                                 path:"instructor",
//                                                 populate:{
//                                                     path:"additionalDetails",
//                                                 },
//                                             }
//                                         )
//                                         .populate("category")
//                                         // .populate("ratingAndreviews")
//                                         .populate({
//                                             path:"courseContent",
//                                             populate:{
//                                                 path:"subSections",
//                                             },
//                                         })
//                                         .exec();

//                 //validation
//                 console.log(courseDetails)
//                 if(!courseDetails || courseDetails.length === 0) {
//                     return res.status(400).json({
//                         success:false,
//                         message:`Could not find the course with ${courseId}`,
//                     });
//                 }
//                 //return response
//                 return res.status(200).json({
//                     success:true,
//                     message:"Course Details fetched successfully",
//                     data:courseDetails,
//                 })

//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
// }

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    // console.log("courseDetails at getFullCourseDetails API Call : ", courseDetails)

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("course at the Delete Course API", course);

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSections;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
