const nodemailer = require('nodemailer');
require('dotenv').config();
const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host : process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: 'StudyNotion',
            to: `${email}`,
            subject : `${title}`,
            html : `${body}`
        };

        const info = await transporter.sendMail(mailOptions);
        //through this we send the email to the user
        console.log('Email sent: ' + info);
        return info;
    } catch (error) {
        console.log(error);
    }
}

module.exports = mailSender;