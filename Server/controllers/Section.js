const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/Subsection");

//createSection
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;
    console.log("This is the data", courseId);

    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    console.log("Will now hit the db");
    //section create
    const newSection = await Section.create({
      sectionName,
    });

    //update the course object with the section id and alsp populating the section and subsections
    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    //verify this populate thing

    //return the response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//update Section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    console.log("This is the data received", req.body);

    //data validation
    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    console.log("This is after section validation");

    const sectionDetails = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        sectionName: sectionName,
      },
      { new: true }
    )
      .populate("subSections")
      .exec();

    console.log("This is after section update in db");

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//delete a Section
exports.deleteSection = async (req, res) => {
  try {
    //get ID - assuming that we are sending ID in params
    const { sectionId, courseId } = req.body;

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });
    const section = await Section.findById(sectionId);
    console.log(sectionId, courseId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }
    // Delete the associated subsections
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    await Section.findByIdAndDelete(sectionId);

    // find the updated course and return it
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// //getAllSections
// exports.getAllSections = async (req, res) => {
//     try {
//         const allSections = await Section.find({},
//             {sectionName : true, subSections : true}
//             ).populate('subSections').exec();

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         });
//     }
// }

//getSectionById
