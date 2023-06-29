const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender : {
        type: String,
    },
    dateOfBirth : {
        type: String,
    },
    about : {
        type: String,
        trim : true,
        //use of trim here is to remove any white spaces
    },
    contactNumber : {
        type: Number,
        trim : true,
    }


});

module.exports = mongoose.model('Profile', profileSchema);