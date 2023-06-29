const Section = require('../models/Section');
const Course = require('../models/Course');

//createSection
exports.createSection = async (req, res) => {
    try {
        //data fetch
        const {sectionName, courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        //section create
        const newSection = await Section.create({
            sectionName,
        });

        //update the course object with the section id and alsp populating the section and subsections
        const updatedCourse = await Course.findByIdAndUpdate(
                {_id : courseId},
                {
                    $push : {
                        courseContent : newSection._id,
                    },
                },
                {new : true}
            ).populate({
                path : 'courseContent',
                populate : {
                    path : 'subSections',
                },
            }).exec();

            //verify this populate thing

        //return the response       
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            data: updatedCourse,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });       
    }
}

//update Section
exports.updateSection = async (req, res) => {
    try {
        const {newSectionName, sectionId} = req.body;

        //data validation
        if(!newName){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        const sectionDetails = await Section.findByIdAndUpdate(
            {_id : sectionId},
            {
                sectionName : newSectionName,
            },
            {new : true}
        ).populate('subSections').exec();

        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: sectionDetails,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }
}

//delete a Section
exports.deleteSection = async (req, res) => {
    try {
        //get ID - assuming that we are sending ID in params
        const {sectionId} = req.params;

        //find by Id and delete
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        // let courseId;
        // await Section.findById(sectionId)
        //         .populate('course', '_id') // Populates the 'course' field with only the '_id' field of the Course document
        //         .exec((err, section) => {
        //             if (err || !section) {
        //             // Handle error or section not found here
        //             } else {
        //             courseId = section.course._id;
        //             // Do something with the courseId here
        //             }
        //         });
        //     //remove from courseContent array
        //     const updatedCourse = await Course.findByIdAndUpdate(
        //         {_id : courseId},
        //         {
        //             $pull : {
        //                 courseContent : deletedSection._id,
        //             },
        //         },
        //         {new : true}
        //     ).populate({
        //         path : 'courseContent',
        //         populate : {
        //             path : 'subSections',
        //         },
        //     }).exec();
        
        //is this all necessary, to delete from the courseContent array ? 
        //I think it is not necessary, as we are not deleting the section from the courseContent array
        //we are just deleting the section from the section collection


        //return the response       
        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
            data: updatedCourse,
        });

    } catch (error) {
        
    }
}


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
