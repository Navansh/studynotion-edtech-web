const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//create Category ka handler function

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    //fetch data

    //not adding konse course ki category hai, as when we will create a course, we will add the category to the course
    // and update the category object with the course id

    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
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
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    //by adding this second argument, we are telling the DB to return only the name and description of the category

    console.log(allCategories);

    return res.status(200).json({
      success: true,
      message: "All Categories fetched successfully",
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const categoryId = req.body.categoryId;

    //get courses for the selected category
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
        populate: {
            path: "instructor",
        }
      })
      .exec();

    console.log("This is the selected Category",selectedCategory);

    //validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    //get courses from different categories
    const otherCategories = await Category.find({ _id: { $ne: categoryId } })
      .populate("courses")
      .exec();
    //this will return all the categories except the one with the categoryId in the form of an array

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        //populate instructor path also
        populate: {
            path: "instructor",
        }
        
      })
      .exec();

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
            path: "instructor",
        }
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    //get top selling courses
    //we will sort the courses in descending order of the number of students enrolled
    //but studentEnrolled is itself an array, so we will sort it by the length of the array of studentsEnrolled
    const topSellingCourses = await Category.find({})
      .populate({
        path: "courses",
        options: {
          sort: {
            "studentsEnrolled.length": -1,
          },
          limit: 10,
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Category Page Details fetched successfully",
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
