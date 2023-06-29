const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

//createRatingAndReview
exports.createRatingAndReview = async (req, res) => {
    try {
        //get user ID
        const userId = req.user.id;
        //this is done during the auth middleware

        //fetch data 
        const {rating, review, courseId} = req.body;

        //check if user is enrolled or not - only enrolled users can create reviews
        const courseDetails = await Course.findOne({
            _id : courseId,
            studentsEnrolled : {$elemMatch : {$eq : userId}},
        });
        //now we need to check if the user is enrolled or not
        //we'll check if the user is present in the courseDetails.enrolledStudents array or not

        //validation
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        //check if user has already created a review or not - only one review per user per course
        const alreadyReviewed = await RatingAndReview.findOne({
            course : courseId,
            user : userId,
        });

        if(alreadyReviewed){
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course",
            });
        }

        //create an entry in the DB
        const ratingAndReviewDetails = await RatingAndReview.create({
            rating,
            review,
            course : courseId,
            user : userId,
        });
        
        console.log(ratingAndReviewDetails);

        //add the ratingAndReviewDetails to the course
        courseDetails.ratingAndReviews.push(ratingAndReviewDetails._id);
        await courseDetails.save();

        return res.status(200).json({
            success: true,
            message: 'Rating and Review created successfully',
            ratingAndReviewDetails,
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });    
    }
};

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get the course ID
        const courseId = req.body.courseId;

        //calculate the average rating
        const result = await RatingAndReview.aggregate([
            {
                $match : {
                    course : new mongoose.Types.ObjectId(courseId),
                    //we have done this cz courseId is in string format and we need to convert it to ObjectId
                },
            },
            {
                $group : {
                    _id : null,
                    averageRating : {$avg : '$rating'},
                },
            },

        ]);
 
        //return rating -> 2 cases : 
        //1. if there are no reviews, return 0
        //2. if there are reviews, return the average rating
        if(result.length > 0){
            return res.status(200).json({
                success: true,
                message: 'Average rating calculated successfully',
                averageRating : result[0].averageRating,
            });
        }

        //case where there are no reviews
        return res.status(200).json({
            success: true,
            message: 'Average rating is 0 as there are no reviews yet',
            averageRating : 0,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


//getAllRatingAndReview
exports.getAllRatingAndReview = async (req, res) => {
    try {
        //here we are not doing course specific search, we are just fetching all the reviews
        //get the rating and review details
        const ratingAndReviewDetails = await RatingAndReview.find({})
        .sort({rating : "desc"})
        .populate({
            path : 'user',
            select : 'firstName lastName email image',
        })
        .populate({
            path : 'course',
            select : 'courseName',
        }).exec();

        //return the rating and review details
        return res.status(200).json({
            success: true,
            message: 'Rating and review details fetched successfully',
            data : ratingAndReviewDetails,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


//getRatingAndReview
exports.getRatingAndReview = async (req, res) => {
    try {
        //this is the route for getting all the reviews of a particular course
        //get the course ID
        const courseId = req.body.courseId;

        //get the rating and review details
        const ratingAndReviewDetails = await RatingAndReview.find({
            course : courseId,
        })
        .populate({
            path : 'user',
            select : 'name',
        })
        .sort({createdAt : -1});

        //return the rating and review details
        return res.status(200).json({
            success: true,
            message: 'Rating and review details fetched successfully',
            ratingAndReviewDetails,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

