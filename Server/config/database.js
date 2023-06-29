const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    // Connecting to the database
    mongoose
        .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        })
        .then(() => {
        console.log('Successfully connected to the database');
        })
        .catch((err) => {
        console.log('Could not connect to the database. Exiting now...', err);
        console.error(err);
        process.exit(1);
        });
    }

