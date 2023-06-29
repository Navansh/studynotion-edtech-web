const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (image, folder, height, quality) => {
    try {

        const options = {folder}

        if(height) options.height = height;
        if(quality) options.quality = quality;

        options.resource_type = 'auto';

        return await cloudinary.uploader.upload(image.tempFilePath, options);
    } catch (error) {
        console.log(error);
    }
}

