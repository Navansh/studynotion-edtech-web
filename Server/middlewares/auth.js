const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Course = require('../models/Course');
const Category = require('../models/Category');
const CourseProgress = require('../models/CourseProgress');
const Section = require('../models/Section');

//auth
exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        //if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'You need to login first!',
            });
        }

        //verifying the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);


            req.user = decoded;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'You need to login first!',
            });
        }

        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'You need to login first!',
        });
    }
};


//isStudent
exports.isStudent = async (req, res, next) => {
    try {
        //we can get the role from the req.user object which we added durinmg the auth middleware
        if (req.user.accountType !== 'Student') {
            return res.status(403).json({
                error: 'You are not authorized to access this route',
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            error: 'You need to login first!',
        });
    }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        //we can get the role from the req.user object which we added durinmg the auth middleware
        if (req.user.accountType !== 'Admin') {
            return res.status(403).json({
                error: 'You are not authorized to access this route',
            });
        }
        
        next();
    } catch (err) {
        return res.status(401).json({
            error: 'You need to login first!',
        });
    }
};


//isInstuctor
exports.isInstructor = async (req, res, next) => {
    try {
        //we can get the role from the req.user object which we added durinmg the auth middleware
        if (req.user.accountType !== 'Instructor') {
            return res.status(403).json({
                error: 'You are not authorized to access this route',
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            error: 'You need to login first!',
        });

    }
};