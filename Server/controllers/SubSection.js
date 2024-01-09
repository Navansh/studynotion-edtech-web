const SubSection = require("../models/Subsection");
const Section = require("../models/Section");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
//createSubSection
exports.createSubSection = async (req, res) => {
  try {
    //data fetch
    const { sectionId, title, description } = req.body;

    //extract video file from the request
    const video = req.files.video;

    console.log("these are all the files", req.body);

    //data validation
    if (!title || !description || !video || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const videoUrl = uploadDetails.secure_url;

    //subSection create
    const SubSectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    //update the section object with the subSection id and alsp populating the section and subsections
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSections: SubSectionDetails._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "subSections",
      })
      .exec();

    //return the response
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    //data validation
    // if(!newTitle || !newTimeDuration || !newDescription || !subSectionId || !newVideo){
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Please fill all the fields',
    //     });
    // }

    // const uploadDetails = await uploadImageToCloudinary(newVideo, process.env.FOLDER_NAME)

    // const newVideoUrl = uploadDetails.secure_url;

    // //subSection update
    // const updatedSubSection = await SubSection.findByIdAndUpdate(
    //         {_id : subSectionId},
    //         {
    //             title : newTitle,
    //             timeDuration : newTimeDuration,
    //             description : newDescription,
    //             videoUrl : newVideoUrl,
    //         },
    //         {new : true}
    //     );

    // //return the response
    // return res.status(200).json({
    //     success: true,
    //     message: 'SubSection updated successfully',
    //     data: updatedSubSection,
    // });

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    // const { subSectionId } = req.body;

    //data validation
    // if (!subSectionId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please fill all the fields",
    //   });
    // }

    //subSection delete
    // const deletedSubSection = await SubSection.findByIdAndDelete({
    //   _id: subSectionId,
    // });

    //update the section object with the subSection id and alsp populating the section and subsections
    // const updatedSection = await Section.findByIdAndUpdate(
    //         {_id : deletedSubSection.sectionId},
    //         {
    //             $pull : {
    //                 subSections : deletedSubSection._id,
    //             },
    //         },
    //         {new : true}
    //     ).populate({
    //         path : 'subSections',
    //     }).exec();

    //do we need to this ??, i.e. updating the section also ?
    //return the response
    // return res.status(200).json({
    //   success: true,
    //   message: "SubSection deleted successfully",
    //   data: updatedSection,
    // });

    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSections: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSections"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
