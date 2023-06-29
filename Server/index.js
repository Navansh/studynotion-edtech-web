const express = require("express");
const app = express();

// Importing the Routes
const userRoutes = require("./routes/User");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const profileRoutes = require("./routes/Profile");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// Connecting to the Database
database.connect();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        //this means that the requests originating from the above mentioned origins will be allowed
        credentials: true,
    }
));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

//cloudinary
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/profile", profileRoutes);

//default route
app.get("/", (req, res) => {
    return res.json({
        success : true,
        message: "Your server for the E-Learning App is running",
    });
});

//activate the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);







