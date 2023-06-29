const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: [20, 'Username cannot be more than 20 characters'],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email : {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password cannot be less than 6 characters'],
        select: false,
    },
    accountType: {
        type: String,
        enum: ['Student', 'Admin', 'Instructor'],
        reqired : true,
        default: 'user',
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Profile"
    },
    courses : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Course"
    }],
    token : {
        type: String,
    },
    resetPasswordExpires : {
        type: Date,
    },
    image : {
        type: String,
        //as this will be replaced by the url of the image
        required : true,
    },
    courseProgress : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "CourseProgress"
    }],
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },

},{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);


