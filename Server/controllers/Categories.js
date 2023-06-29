const Category = require('../models/Category');

//create Category ka handler function

exports.createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;

        //fetch data 

        //not adding konse course ki category hai, as when we will create a course, we will add the category to the course
        // and update the category object with the course id

        //validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'Please fill all the fields',
            });
        }

        //create an entry in the DB
        const categoryDetails = await Category.create({
            name,
            description,
        });
        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
            data: categoryDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, {name : true, description : true});
        //by adding this second argument, we are telling the DB to return only the name and description of the category

        console.log(allCategories);

        return res.status(200).json({
            success: true,
            message: 'All Categories fetched successfully',
            data: allCategories,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }

}

exports.categoryPageDetails = async (req, res) => {
    try {
        const categoryId = req.body.categoryId; 

        //get courses for the selected category
        const selectedCourses = await Category.findById(categoryId)
                .populate('courses').exec();
                 
        console.log(selectedCourses);

        //validation
        if(!selectedCourses){
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        
        //get courses from different categories
        const otherCategories = await Category.find({_id : {$ne : categoryId}}).populate('courses').exec();
        //this will return all the categories except the one with the categoryId in the form of an array

        //get top selling courses
        //we will sort the courses in descending order of the number of students enrolled
        //but studentEnrolled is itself an array, so we will sort it by the length of the array of studentsEnrolled
        const topSellingCourses = await Category.find({}).populate({
            path: 'courses',
            options: {
                sort: {
                    'studentsEnrolled.length': -1,
                },
                limit: 10,
            },
        }).exec();

        return res.status(200).json({
            success: true,
            message: 'Category Page Details fetched successfully',
            data: {
                selectedCourses,
                otherCategories,
                topSellingCourses,
            },
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}