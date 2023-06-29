const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Section = require('../models/Section');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Category = require('../models/Category');

//createCourse
exports.createCourse = async (req, res) => {
    try {
        //user state currently -> He is logged in 
        //checks -> if he is an instructor
        let {courseName, courseDescription, whatYouWillLearn, price, tag, language = "English", category,instructions, status} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnail;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !language || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        if (!status || status === undefined) {
			status = "Draft";
		}

        //check for instructor
        //why we need to check for instructor ? -> because we need to store its ObjectId in the course document
        const userID = req.user.id;
        //using this ID, we find instructor in the DB
        if(!userID){
            return res.status(400).json({
                success: false,
                message: 'User ID not found',
            });
        }

        const instructorDetails = await User.findById(userID);
        console.log(instructorDetails);

        //why calling this ? when we have user.id
        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: 'Instructor not found',
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
        const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME); 
        //tempFilePath is the path where the image is stored temporarily

        //create an entry for new course in the DB
        const newCourseDetails = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn,
            price,
            tag : tag,
            category: categoryDetails._id,
			status: status,
			instructions: instructions,
            language,
            thumbnail : thumbnailDetails.secure_url,
        });

        console.log(newCourseDetails);

        //update the instructor object with the course id
        //hence effectively pushing the created Course in the instrucotr's courses list
        await User.findByIdAndUpdate({_id : instructorDetails._id}, 
            {
                $push : {
                    courses : newCourseDetails._id,
                },
            },
            {new : true},
        );

        await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourseDetails._id,
				},
			},
			{ new: true }
		);

        //update the tag object with the course id
        // tagDetails.course.push(courseDetails._id);
        // await tagDetails.save();
        
        return res.status(200).json({
            success: true,
            message: 'Course created successfully',
            data: newCourseDetails,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });    
    }
};


//getAllCourses
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, 
            {
                courseName : true,
                courseDescription : true,
                price : true,
                thumbnail : true,
                instructor : true,
                ratingAndReviews : true,
                studentsEnrolled : true,
            }).populate('instructor').exec();

        return res.status(200).json({
            success: true,
            message: 'All courses fetched successfully',
            data: allCourses,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }
};

exports.getCourseDetails = async (req, res) => {
    try {
        const courseID = req.body.courseId;
        const courseDetails = await Course.findById(courseID)
                              .populate(
                                {
                                    path : 'instructor',
                                    populate : {
                                        path : 'additionalDetails',
                                    }
                                }
                              ).populate('category')
                              .populate('ratingAndReviews')
                              .populate({
                                path : 'courseContent',
                                populate : {
                                    path : 'subSection',
                                }
                              }).exec();


        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: 'Course with courseId : ' + courseID + ' not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course details fetched successfully',
            data: courseDetails,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });

    }
}

exports.getCourseDetails = async (req, res) => {
    try {
            //get id
            const {courseId} = req.body;
            //find course details
            const courseDetails = await Course.find(
                                        {_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails",
                                                },
                                            }
                                        )
                                        .populate("category")
                                        // .populate("ratingAndreviews")
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSections",
                                            },
                                        })
                                        .exec();

                //validation
                console.log(courseDetails)
                if(!courseDetails || courseDetails.length === 0) {
                    return res.status(400).json({
                        success:false,
                        message:`Could not find the course with ${courseId}`,
                    });
                }
                //return response
                return res.status(200).json({
                    success:true,
                    message:"Course Details fetched successfully",
                    data:courseDetails,
                })

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}