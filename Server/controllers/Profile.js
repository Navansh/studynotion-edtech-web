//profile need not be created as hamne ek dummy profile user ke signup ke time create kar di thi
//initializing them with "" 
//hence, now we need to just update them

const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
const Course = require('../models/Course');

exports.updateProfile = async (req, res) => {
    try {
        //if the user is logged in, means by auth middleware, the request already has the decoded token
        //and the token contains, email, accountType, userid
        //we can use the userid to find the user in the database
        const {dateOfBirth = "", about="", contactNumber, gender =""} = req.body;

        const id = req.user.id;

        //validating the data
        if (!contactNumber) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }
            
        //updating the profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;

        const updatedProfile = await Profile.findByIdAndUpdate(
            {_id : profileId},
            {
                dateOfBirth,
                about,
                contactNumber,
                gender
            },
            {new : true}
        );

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

//delete account
exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;
        console.log(req.user.id)
        //validation
		const userDetails = await User.findOne({_id : id});
        console.log("Printing user details " ,userDetails)
        const profileId = userDetails.additionalDetails;

        if(!userDetails || !profileId){
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }

        //delete the profile
        await Profile.findByIdAndDelete(profileId);

        //now unenroll the user from all the courses
        //get the courses enrolled by the user
        const coursesEnrolled = userDetails.courses;
        //for each course, find the user and remove it from the list
        coursesEnrolled.forEach(async (courseId) => {
            await Course.findByIdAndUpdate(
                {_id : courseId},
                {$pull : {usersEnrolled : id}},
                {new : true} 
            );
        });


        //finally, scheduling the deleting of the user after 3 days
        //we are not deleting the user directly, because we want to give the user a chance to undo the deletion
        //hence, we are scheduling the deletion after 3 days
        //we are using setTimeout function to schedule the deletion

        //first, we need to get the user again, because we need the createdAt field
        // TODO : We'll use cron jobs to schedule the deletion of the user

        // setTimeout(async () => {
        //     //get the user again
        //     const user = await User.findById(id);

        //     //if the user is null, means the user has already been deleted
        //     //hence, we need not do anything
        //     if(!user){
        //         return;
        //     }

        //     //if the user is not null, means the user has not been deleted
        //     //hence, we need to delete the user
        //     await User.findByIdAndDelete(id);

        // }, 3 * 24 * 60 * 60 * 1000); //3 days

        await User.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}


exports.getAllUserDetails = async (req, res) => {
    try {
        //get the id of the user
        const id = req.user.id;

        //find the user details
        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        //if no user found
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: 'No user found',
            });
        }

        //if users found
        return res.status(200).json({
            success: true,
            message: 'User found',
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};