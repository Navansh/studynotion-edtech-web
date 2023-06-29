const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerification')

const otpSchema = new mongoose.Schema({
    email : {
        type: String,
        trim: true,
        required: true,
    },
    otp : {
        type: String,
        trim: true,
        required: true,
    },
    createdAt : {   
        type: Date,
        default: Date.now,
        expires: 5*60,
        //this is the time in seconds after which the document will be deleted
        //hence the otp will be valid for 5 minutes
    }

});

//here we'll use pre hook to send the otp to the user's email
//for this we'll use the nodemailer package
//we'll use the pre hook on the save method

//a function to send email
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "OTP for verification", otpTemplate(otp));
        console.log("Mail Sent Successfully: ",mailResponse);
    } catch (error) {
        console.log("Error occured while sending email: ",error)
        throw error;
    }
}

otpSchema.pre('save', async function(next){
    //here next is the function that will be called after the pre hook is executed
    //******here doc is not passed as abhi tak save nhi hua hai
    //here we'll use the pre hook to send the otp to the user's email
    //for this we'll use the nodemailer package
    //we'll use the pre hook on the save method
    try {
        await sendVerificationEmail(this.email, this.otp);
        //ye email and otp upar defined hai, in Schema
        next();
    } catch (error) {
        console.log("Error occured while sending email: ",error)
        throw error;
    }
});



module.exports = mongoose.model('OTP', otpSchema);