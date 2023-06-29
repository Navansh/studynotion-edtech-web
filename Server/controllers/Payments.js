const razorpay = require('razorpay');
const crypto = require('crypto');

//we have instance from config/razorpay.js
const {instance} = require('../config/razorpay');

const Course = require('../models/Course');
const User = require('../models/User');

const mailSender = require('../utils/mailSender');

//capture the payment
exports.capturePayment = async (req, res) => {
    try {
        //get CourseId and userId
        const {course_id} = req.body;
        const userId = req.user.id;

        //validate the data
        if(!course_id) return res.status(400).json({message: 'Please select a course'});
        //checking if its a valid course
        const courseDetails = await Course.findById(course_id);
        if (!courseDetails) return res.status(400).json({message: 'Invalid course'});

        
        //has user already paid for the course ? 
        //check this by searching the user's object id in the studentsenrolled array of the course
        //but first we need to convert our userId(string) to ObjectId
        const uid = require('mongoose').Types.ObjectId(userId);


        //difference between userId and uid -> userId is a string and uid is an ObjectId
        //we need to convert userId to ObjectId to search in the studentsEnrolled array
        //we can't use userId directly as it is a string and not an ObjectId


        if (courseDetails.studentsEnrolled.includes(uid)) {
            return res.status(400).json({message: 'You have already enrolled for this course'})
        }

        //create Order
        const options = {
            amount: courseDetails.price * 100, //amount in paise
            currency: 'INR',
            receipt: `receipt_${courseDetails._id}_${userId}`,
            notes :{
                courseId : course_id,
                userId
            },
        }

        const paymentResponse = await instance.orders.create(options);

        //return the response
        res.status(200).json({
            success : true,
            courseName : courseDetails.name,
            courseDescription : courseDetails.description,
            thumbnail : courseDetails.thumbnail,
            orderId : paymentResponse.id,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
};

//verify signature
exports.verifySignature = async (req, res) => {
    //this request is originating from Razorpay
    try {
        const webhooksecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        
        //get the signature from the request header
        const signature = req.headers['x-razorpay-signature'];


        //verify the signature
        //creating a Hmac -> Hash-based message authentication code
        //which is a type of message authentication code (MAC) calculated using a hash function in combination with a secret key
        //Hmac is a cryptographic hash function
        //this way we can verify the signature, from Razorpay, as Razorpay will also use the same algo to create the signature
        //and then send to us
        const shasum = crypto.createHmac('sha256', webhooksecret);

        //converting the request body to JSON and then updating the shasum with it
        shasum.update(JSON.stringify(req.body));

        //when we run hashing algo on particular input we get digest
        //we convert the digest to hexa decimal
        const digest = shasum.digest('hex');

        if(signature === digest) {
            console.log("Payment Successfull");

            //we start our post payment process

            //now we won't get the course_id and userId from the request body
            //hence we will get it from the notes
            const {courseId, userId} = req.body.payload.payment.entity.notes;

            //fulfill the order
            const enrolledCourse = await Course.findByIdAndUpdate(courseId, {   
                $push : {studentsEnrolled : userId}
            }, {new : true});

            if (!enrolledCourse) return res.status(500).json({message: 'Internal Server Error'});

            console.log(enrolledCourse);

            //update the user's enrolled courses
            //find the student and update the coursesEnrolled array
            const enrolledStudent = await User.findOneAndUpdate({_id : userId}, {
                $push : {courses : courseId}
            }, {new : true});

            console.log(enrolledStudent);

            //send mail to the student
            const emailResponse = await mailSender({
                email : enrolledStudent.email,
                subject : 'Congratulations on your Successful Enrollment',
                body : `You have successfully enrolled for the course ${enrolledCourse.name}`
            });

            console.log(emailResponse);

            return res.status(200).json({
                success : true,
                message : 'Payment Successfull'
            });


        } else {
            return res.status(400).json({
                success : false,
                message : 'Payment Failed'
            }); 
        }

    } catch (error) {
        return res.status(400).json({
            success : false,
            message : 'Payment Failed'
        });
    }
}