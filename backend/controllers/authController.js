// Register new user

const User = require("../Models/User");
const otpGenrator = require("otp-generator");
const catchAsync = require("../utilities/catchAsync");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const Mailer = require("../services/mailer");

// sign JWT Token

const signToken = (userId) => {
    jwt.sign({userId}, process.env.TOKEN_KEY);
};

exports.register = catchAsync(async (req, res, next) => {
    const {name, email, password} = req.body;
    console.log("Received Data:", req.body);
    const existing_user = await User.findOne({
        email: email,
        verified: false,
    });

    let new_user;

    if (existing_user && existing_user.verified === true) {
        return res.status(400).json({
            status: "error",
            message: "Email already in use",
        });
    } else if (existing_user && existing_user.verified === false) {
        await User.findOneAndDelete({email: email});
    }
    new_user = await User.create({
        name,
        email,
        password,
    });

    req.userId = new_user._id;
    next();
});

// Send OTP

exports.sendOTP = catchAsync(async (req, res, next) => {
    const {userId} = req;
    //generate new OTP
    const new_otp = otpGenrator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    console.log("New OTP", new_otp);
    const otp_expiry_time = Date.now() + 10 * 60 * 1000;

    const user = await User.findByIdAndUpdate(
        userId,
        {
            otp_expiry_time: otp_expiry_time,
        },
        {
            new: true,
            validateModifyOnly: true,
        }
    );
    user.otp = new_otp;
    await user.save({});

    // SENT OTP VIA MAIL
    Mailer({name: user.name, email: user.email, otp: new_otp});

    res.status(200).json({
        status: "sucess",
        message: "OTP Sent Successfully",
    });
});

// Resend Otp
exports.resendOtp = catchAsync(async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({
        email,
    });
    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "Email not Found",
        });
    }

    // Generate new otp
    const new_otp = otpGenrator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    const otp_expiry_time = Date.now() + 10 * 60 * 1000;
    user.otp_expiry_time = otp_expiry_time;
    user.otp = new_otp;

    await user.save({});
    // Sent Mail
    Mailer({name: user.name, email: user.email, otp: new_otp});

    res.status(200).json({
        status: "sucess",
        message: "OTP Sent successfully",
    });
});

// Verify OTP

exports.verifyOTP = catchAsync(async (req, res, next) => {
    const {email, otp} = req.body;
    const user = await User.findOne({
        email,
        otp_expiry_time: {$gt: Date.now()},
    });
    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "Email is invalid or OTP Expired",
        });
    }
    if (user.verified) {
        return res.status(400).json({
            status: "error",
            message: "email already verified",
        });
    }
    if (!(await user.correctOTP(otp, user.otp))) {
        res.status(400).json({
            status: "error",
            message: "OTP is Incorrect",
        });
    }
    user.verified = true;
    user.otp = undefined;
    await user.save({new: true, validateModifyOnly: true});
    const token = signToken(user._id);
    res.status(200).json({
        status: "sucess",
        message: "OTP Verified Successfully",
        token,
        user_id: user._id,
    });
});

// Login
exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Both Email and Password are required",
        });
    }

    // Find user and select password explicitly
    const user = await User.findOne({email}).select("+password");

    // Debugging: Check if the user is found
    if (!user) {
        console.log("User not found for email:", email);
        return res.status(400).json({
            status: "error",
            message: "Invalid email or password",
        });
    }

    // Debugging: Check if password is retrieved
    console.log("Retrieved password from DB:", user.password);

    // Compare passwords
    const isPasswordCorrect = await user.correctPassword(
        password,
        user.password
    );

    // Debugging: Check if password comparison is working
    console.log("Password comparison result:", isPasswordCorrect);

    if (!isPasswordCorrect) {
        return res.status(400).json({
            status: "error",
            message: "Invalid email or password",
        });
    }

    // Generate token
    const token = signToken(user._id);

    return res.status(200).json({
        status: "success",
        message: "Login successful",
        token,
        user_id: user._id,
    });
});

//Protected Middleware
exports.protect = catchAsync(async (res, req, next) => {
    try {
        // Get Token and check if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return res.status(401).json({
                message:
                    "you are not logged in Please log in to access application",
            });
        }
        //Verify Token
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.TOKEN_KEY
        );
        console.log(decoded);

        //Check if user still exists
        const this_user = User.findById(decoded, userId);
        if (!this_user) {
            return res.status(401).json({
                message: "The user belonging to this token does not exist",
            });
        }
        // Check if user changed password after the token was issued
        if (this_user.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({
                message: "User Recently Changed Password! please login again",
            });
        }
        //Grant Access to protected Routes
        req.user = this_user;
        next();
    } catch (error) {
        console.log(error);
        console.log("Protect EndPoint");
        res.status(400).json({
            status: "error",
            message: "Authentication Failed",
        });
    }
});
