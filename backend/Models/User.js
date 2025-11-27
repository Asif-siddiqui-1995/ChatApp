const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"],
            trim: true,
        },
        avatar: {
            type: String,
        },
        jobTitle: {
            type: String,
        },
        bio: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            validate: {
                validator: function (email) {
                    return validator.isEmail(email);
                },
                message: (props) => `Email (${props.value}) is Invalid`,
            },
            unique: true,
        },
        password: {
            type: String,
        },
        passwordChangedAt: {
            type: Date,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
        },
        otp_expiry_time: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Online", "Offline"],
            default: "Offline",
        },
        socketId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// userSchema.pre("save", async function (next) {
//     // only run this function if password is modified
//     if (!this.isModified("password") || !this.password) return next();
//     // Hashed the password with the cost of 12
//     this.password = await bcrypt.hash(this.password.toString(), 12);
//     console.log(this.password.toString(), "From PRE SAVE HOOK");
//     next();
// });

userSchema.pre("save", async function (next) {
    if (this.isModified("otp") && this.otp) {
        if (this.otp) {
            this.otp = await bcrypt.hash(this.otp.toString(), 12);

            console.log(this.otp.toString(), "From PRE SAVE HOOK");
        }
    }
    if (this.isModified("password") && this.password) {
        if (this.password) {
            this.password = await bcrypt.hash(this.password.toString(), 12);
            console.log(this.password.toString(), "From PRE SAVE HOOK");
        }
    }
    next();
});

//METHODS
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

const User = new mongoose.model("Users", userSchema);
module.exports = User;
