const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const Course = require('../models/Course');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();
//createSubSection
exports.createSubSection = async (req, res) => {
    try {
        //data fetch
        const {title, timeDuration, description, sectionId} = req.body;

        //extract video file from the request
        const video = req.files.videoFile;
        
        //data validation
        if(!title || !timeDuration || !description || !video || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)

        const videoUrl = uploadDetails.secure_url;

        //subSection create
        const newSubSection = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl,
        });

        //update the section object with the subSection id and alsp populating the section and subsections
        const updatedSection = await Section.findByIdAndUpdate(
                {_id : sectionId},
                {
                    $push : {
                        subSections : newSubSection._id,
                    },
                },
                {new : true}
            ).populate({
                path : 'subSections',
            }).exec();

        //return the response       
        return res.status(200).json({
            success: true,
            message: 'SubSection created successfully',
            data: updatedSection,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });       
    }
}

//update SubSection
exports.updateSubSection = async (req, res) => {
    try {
        const {newTitle, newTimeDuration, newDescription, subSectionId} = req.body;

        const newVideo = req.files.videoFile;

        //data validation
        if(!newTitle || !newTimeDuration || !newDescription || !subSectionId || !newVideo){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        const uploadDetails = await uploadImageToCloudinary(newVideo, process.env.FOLDER_NAME)

        const newVideoUrl = uploadDetails.secure_url;

        //subSection update
        const updatedSubSection = await SubSection.findByIdAndUpdate(
                {_id : subSectionId},
                {
                    title : newTitle,
                    timeDuration : newTimeDuration,
                    description : newDescription,
                    videoUrl : newVideoUrl,
                },
                {new : true}
            );
                
        //return the response
        return res.status(200).json({
            success: true,
            message: 'SubSection updated successfully',
            data: updatedSubSection,
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });       
    }
}

//delete SubSection
exports.deleteSubSection = async (req, res) => {
    try {
        const {subSectionId} = req.body;

        //data validation
        if(!subSectionId){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        //subSection delete
        const deletedSubSection = await SubSection.findByIdAndDelete({_id : subSectionId});

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
        return res.status(200).json({
            success: true,
            message: 'SubSection deleted successfully',
            data: updatedSection,
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });       
    }
}