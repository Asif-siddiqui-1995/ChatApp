const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({path: "./../config.env"});
const OTPTemplate = require("./../Templates/OTP");

// const NODEMAILER_USER = process.env.NODEMAILER_USER;
// const NODEMAILER_APP_PASSWORD = process.env.NODEMAILER_APP_PASSWORD;
const NODEMAILER_APP_PASSWORD = "mcuitjrjwgcwsigk";

const NODEMAILER_USER = "mohammadasifshahid@gmail.com";

console.log(NODEMAILER_APP_PASSWORD, NODEMAILER_USER);
// create a transport using email service

const transporter = nodeMailer.createTransport({
    host: `smtp.google.com`,
    port: 456,
    secure: true,
    service: "gmail",
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_APP_PASSWORD,
    },
});

const Mailer = async ({name, otp, email}) => {
    const mailOptions = {
        to: email, //recipiant email
        subject: "Verify Your Chatapp",
        html: OTPTemplate({name, otp}),
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email Sent: %s", info.messageId);
    } catch (error) {
        console.log("Error Sending Email", error);
        throw new Error("Error Sending mail");
    }
};

module.exports = Mailer;
