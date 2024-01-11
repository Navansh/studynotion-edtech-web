const razorpay = require('razorpay');
const crypto = require('crypto');
const { instance } = require("../config/razorpay")
const mongoose = require("mongoose")
const {
    courseEnrollmentEmail,
  } = require("../mail/templates/courseEnrollmentEmail")

const Course = require('../models/Course');
const User = require('../models/User');
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

const mailSender = require('../utils/mailSender');

  exports.capturePayment = async (req, res) => {
    const { courses } = req.body
    const  userId  = req.user.userId
    if (courses.length === 0) {
      return res.json({ success: false, message: "Please Provide Course ID" })
    }
  
    let total_amount = 0
  
    for (const course_id of courses) {
      let course
      try {
        // Find the course by its ID
        course = await Course.findById(course_id)
  
        // If the course is not found, return an error
        if (!course) {
          return res
            .status(200)
            .json({ success: false, message: "Could not find the Course" })
        }
  
        // Check if the user is already enrolled in the course
        const uid = new mongoose.Types.ObjectId(userId)
        if (course.studentsEnrolled.includes(uid)) {
          return res
            .status(200)
            .json({ success: false, message: "Student is already Enrolled" })
        }
  
        // Add the price of the course to the total amount
        total_amount += course.price
      } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
      }
    }
  
    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    }
  
    try {
      // Initiate the payment using Razorpay
      const paymentResponse = await instance.orders.create(options)
      console.log(paymentResponse)
      res.json({
        success: true,
        data: paymentResponse,
      })
    } catch (error) {
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: "Could not initiate order." })
    }
  }
  
  // verify the payment
  exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.id
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res.status(200).json({ success: false, message: "Payment Failed" })
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await enrollStudents(courses, userId, res)
      return res.status(200).json({ success: true, message: "Payment Verified" })
    }
  
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }
  
  // Send Payment Success Email
  exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.id
  
    if (!orderId || !paymentId || !amount || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all the details" })
    }
  
    try {
      const enrolledStudent = await User.findById(userId)
  
      await mailSender(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
    } catch (error) {
      console.log("error in sending mail", error)
      return res
        .status(400)
        .json({ success: false, message: "Could not send email" })
    }
  }
  
  // enroll the student in the courses
  const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide Course ID and User ID" })
    }
  
    for (const courseId of courses) {
      try {
        // Find the course and enroll the student in it
        const enrolledCourse = await Course.findOneAndUpdate(
          { _id: courseId },
          { $push: { studentsEnrolled: userId } },
          { new: true }
        )
  
        if (!enrolledCourse) {
          return res
            .status(500)
            .json({ success: false, error: "Course not found" })
        }
        console.log("Updated course: ", enrolledCourse)
  
        const courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: userId,
          completedVideos: [],
        })
        // Find the student and add the course to their list of enrolled courses
        const enrolledStudent = await User.findByIdAndUpdate(
          userId,
          {
            $push: {
              courses: courseId,
              courseProgress: courseProgress._id,
            },
          },
          { new: true }
        )
  
        console.log("Enrolled student: ", enrolledStudent)
        // Send an email notification to the enrolled student
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
  
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (error) {
        console.log(error)
        return res.status(400).json({ success: false, error: error.message })
      }
    }
  }





//This is the OLD code which can handle only one course at a time
//capture the payment
// exports.capturePayment = async (req, res) => {
//     try {
//         //get CourseId and userId
//         const {course_id} = req.body;
//         const userId = req.user.id;

//         //validate the data
//         if(!course_id) return res.status(400).json({message: 'Please select a course'});
//         //checking if its a valid course
//         const courseDetails = await Course.findById(course_id);
//         if (!courseDetails) return res.status(400).json({message: 'Invalid course'});

        
//         //has user already paid for the course ? 
//         //check this by searching the user's object id in the studentsenrolled array of the course
//         //but first we need to convert our userId(string) to ObjectId
//         const uid = require('mongoose').Types.ObjectId(userId);


//         //difference between userId and uid -> userId is a string and uid is an ObjectId
//         //we need to convert userId to ObjectId to search in the studentsEnrolled array
//         //we can't use userId directly as it is a string and not an ObjectId


//         if (courseDetails.studentsEnrolled.includes(uid)) {
//             return res.status(400).json({message: 'You have already enrolled for this course'})
//         }

//         //create Order
//         const options = {
//             amount: courseDetails.price * 100, //amount in paise
//             currency: 'INR',
//             receipt: `receipt_${courseDetails._id}_${userId}`,
//             notes :{
//                 courseId : course_id,
//                 userId
//             },
//         }

//         const paymentResponse = await instance.orders.create(options);

//         //return the response
//         res.status(200).json({
//             success : true,
//             courseName : courseDetails.name,
//             courseDescription : courseDetails.description,
//             thumbnail : courseDetails.thumbnail,
//             orderId : paymentResponse.id,
//             currency : paymentResponse.currency,
//             amount : paymentResponse.amount,
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: 'Internal Server Error'});
//     }
// };

// //verify signature
// exports.verifySignature = async (req, res) => {
//     //this request is originating from Razorpay
//     try {
//         const webhooksecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        
//         //get the signature from the request header
//         const signature = req.headers['x-razorpay-signature'];


//         //verify the signature
//         //creating a Hmac -> Hash-based message authentication code
//         //which is a type of message authentication code (MAC) calculated using a hash function in combination with a secret key
//         //Hmac is a cryptographic hash function
//         //this way we can verify the signature, from Razorpay, as Razorpay will also use the same algo to create the signature
//         //and then send to us
//         const shasum = crypto.createHmac('sha256', webhooksecret);

//         //converting the request body to JSON and then updating the shasum with it
//         shasum.update(JSON.stringify(req.body));

//         //when we run hashing algo on particular input we get digest
//         //we convert the digest to hexa decimal
//         const digest = shasum.digest('hex');

//         if(signature === digest) {
//             console.log("Payment Successfull");

//             //we start our post payment process

//             //now we won't get the course_id and userId from the request body
//             //hence we will get it from the notes
//             const {courseId, userId} = req.body.payload.payment.entity.notes;

//             //fulfill the order
//             const enrolledCourse = await Course.findByIdAndUpdate(courseId, {   
//                 $push : {studentsEnrolled : userId}
//             }, {new : true});

//             if (!enrolledCourse) return res.status(500).json({message: 'Internal Server Error'});

//             console.log(enrolledCourse);

//             //update the user's enrolled courses
//             //find the student and update the coursesEnrolled array
//             const enrolledStudent = await User.findOneAndUpdate({_id : userId}, {
//                 $push : {courses : courseId}
//             }, {new : true});

//             console.log(enrolledStudent);

//             //send mail to the student
//             const emailResponse = await mailSender({
//                 email : enrolledStudent.email,
//                 subject : 'Congratulations on your Successful Enrollment',
//                 body : `You have successfully enrolled for the course ${enrolledCourse.name}`
//             });

//             console.log(emailResponse);

//             return res.status(200).json({
//                 success : true,
//                 message : 'Payment Successfull'
//             });


//         } else {
//             return res.status(400).json({
//                 success : false,
//                 message : 'Payment Failed'
//             }); 
//         }

//     } catch (error) {
//         return res.status(400).json({
//             success : false,
//             message : 'Payment Failed'
//         });
//     }
// }