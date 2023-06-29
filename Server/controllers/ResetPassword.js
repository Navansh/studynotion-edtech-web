const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        //validating email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email',
            });
        }

        //validate email using regex
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        if (!regex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email',
            });
        }

        //check user on this email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        //generate token 
        const token = crypto.randomBytes(32).toString('hex');
        console.log(token);

        //update user info by adding the token and the expiry time
        const updatedDetails = await User.findByIdAndUpdate(user._id, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            //this is for 5 minutes
        }, {
            new: true
            //by this we'll get the updated user details
        });

        //send mail containing the URL for resetting the password
        //hence creating the url first
        const resetURL = `http://localhost:3000/updatePassword/${token}`;

        //sending the mail
        const mailResponse = await mailSender(email, "Reset Password", `Please click on the link below to reset your password: ${resetURL}`);
        console.log("Mail Sent Successfully: ", mailResponse);

        // return response
        return res.status(200).json({
            success: true,
            message: 'Reset Password link sent successfully',
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });

    }
}

//resetPassword
exports.resetPassword = async (req, res) => {
    try {
        //get the token from the url
        const {password, confirmPassword} = req.body;
        //getching the token from the URL, hence we need to get all the text after the last slash
        //hence to get all the text after the last slash, we'll use split method
        //split method will split the string into an array of strings
        //hence we'll get an array of strings, and we'll get the last element of the array
        const token = req.body.token;
        console.log(token);

        //validations : Token and the new password and confirm new password
        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all the required details',
            });
        }

        //check if the password and confirm password are same
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password do not match',
            });
        }

        //perform regex on password
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z]).{8,}$/;

        if (!passRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
            });
        }

        //get userDetails from the token
        const userDetails = await User.findOne({ token : token });
        
        //if no entry, return an error
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            //if this condition is true, then the token has expired
            return res.status(400).json({
                success: false,
                message: 'Token Expired',
            });
        }

        //if the token is not expired, then we'll update the password
        //hence we'll first hash the password and then update the password
        //hashing the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //updating the password
        const response = await User.findOneAndUpdate(
            { token: token },
            {password: hashedPassword},
            {new: true}
        )

        //return response
        return res.status(200).json({
            success: true,
            message: 'Password Updated Successfully',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });        
    }
}

