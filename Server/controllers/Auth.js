const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const Profile = require('../models/Profile');
const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');
const { response } = require('express');
require('dotenv').config();

//sendOTP
exports.sendOTP = async (req, res) => {
    try {
        //fetching email from the request body
        const {email} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address',
            });
        }

        //checking if the email is already registered or not
        const checkUserPresence = await User.findOne({email});

        //if the user exists, then we send error
        if(checkUserPresence){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
        });

        console.log("OTP: ",otp);

        //making sure OTP that is generated is unique
        //so if the same OTP exists in the database, then we'll generate a new OTP
        //and we'll keep on generating new OTP until we get a unique OTP
        let result = await OTP.findOne({otp});
        //the difference between let and var is that let is block scoped and var is function scoped

        while(result){
            otp = otpGenerator.generate(6, {
                upperCase: false, specialChars: false, alphabets: false
            });
            result = await OTP.findOne({otp});
        }

        //this is not a very great way to generate OTPs as it requires a lot of Db calls
        //a better library to use which always a unique OTP is shortid

        //now as the OTP is generated, we'll save it in the database
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);
        //and cz OTP ke model par pre save hook laga hai, hence OTP.create se pehle hi email par OTP bhej diya jayega


        console.log("OTP Body: ",otpBody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            data: otpBody,
            otp: otp,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//signup
exports.signup = async (req, res) => {
    try {
        //fetching email, password and otp from the request body
        const {
            email,
            firstName,
            lastName,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;
            
        //checking if the email and other data is valid or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nameRegex = /^[a-zA-Z]+$/;
        const contactNumberRegex = /^[0-9]{10}$/;

        //validating mandatory fields 
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are mandatory',
            });
        }
        
        //validating email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address',
            });
        }

        //validating name
        if (!firstName || !nameRegex.test(firstName)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid first name',
            });
        }

        if (!lastName || !nameRegex.test(lastName)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid last name',
            });
        }

        //validating contact number
        if (contactNumber && !contactNumberRegex.test(contactNumber)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid contact number',
            });
        }

        //match the 2 given passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        //validate the password
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z]).{8,}$/;

        if (!passRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
            });
        }

        //checking if the user already exists or not
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        
        //find the most recent OTP generated for the user
        const recentOTP = await OTP.findOne({email}).sort({createdAt: -1}).limit(1);
        //this returns the most recent OTP generated for the user with the specified email
        //createdAt : -1 means that we want the most recent OTP, as -1 means descending order
        //limit(1) means that we want only 1 OTP
        console.log(recentOTP);

        //checking if the OTP is valid or not
        if(recentOTP.length === 0){
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        } else if(recentOTP.otp !== otp){
            //as recentOTP is a document of model OTP, hence recentOTP.otp is the otp field of the document
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }


        //if the OTP is valid, then we'll create a new user
        //and we'll hash the password before saving it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //creating entry in Db
        //for that we first need to create the referencing model objects for the user
        //which are additonaldetails(Profile)
        //not creating for courses(Course) and courseProgress(CourseProgress) as they are not mandatory
        //for creating a user entry in DB

        //creating the additionalDetails object
        const profileDetails = await Profile.create({
            //as we want ObjectId, jo ki Db mein save karne par hi milegi
            //hence, just creating an Object will not work here
            gender : "",
            dateOfBirth : "",
            about : "",
            contactNumber : "",
        });

        console.log("Profile Details created successfully : ",profileDetails);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            approved: approved,
            contactNumber,
            additionalDetails : profileDetails._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}.svg`,
            //this image will be generated by the dicebear api, which will generate a random image based on the name
            //'s initials 
        });

        //and send the respective response
        return res.status(200).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//login
exports.login = async (req, res) => {
    try {
        //fetching email and password from the request body
        const {email, password} = req.body;
        
        //checking if the email and password is valid or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //validating mandatory fields
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are mandatory',
            });
        }

        //validating email
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address',
            });
        }

        //checking if the user exists or not
        const user = await User.findOne({ email }).select('+password').populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User does not exist, Please signup first',
            });
        }
        console.log(user)
        //password matching
        //then, issue JWT token to the user

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email : user.email,
                id : user._id,
                accountType : user.accountType,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            //also attaching the token to the user object, this is NOT on Db
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(
                    Date.now() + 3 * 24 * 60 * 60 * 1000 //3 day
                ),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                message: 'User logged in successfully',
                data: user,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid Password',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//changePassword and not forget password 
//as we are not sending any email to the user
exports.changePassword = async (req, res) => {
    try {
        //get data from req's body
        const {oldPassword, newPassword, confirmNewPassword} = req.body;

        //user details
        const userId = req.user.id;
        
        //get old password, new password and confirm new password

        //validation on password
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z]).{8,}$/;
        //this pass regex will check for atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(403).json({
                success: false,
                message: 'All fields are mandatory',
            });
        }

        //now check if the new password and confirm new password are same or not
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: 'New Password and Confirm New Password do not match',
            });
        }

        //now check if the new password is valid or not
        if(!newPassword || !passRegex.test(newPassword)){
            return res.status(400).json({
                success: false,
                message: 'Invalid Password',
            });
        }

        //find the db Entry of the user, on the basis of the id req
        const userDetails = await User.findById(userId);

        //check if the old password is correct or not, hence we need to verify the supplied password 
        const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
        //with the hashed password in db

        if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

        //if the old password is correct, then we'll update the password in the db)){
        //update the password in database
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);


        //send mail of password updation
        try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

        // return response
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            data: updatedUserDetails,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
        
    }
};