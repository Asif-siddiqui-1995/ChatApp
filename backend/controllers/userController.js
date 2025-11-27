const Conversation = require("../Models/Conversation");
const catchAsync = require("../utilities/catchAsync");

// Get Me
exports.getMe = catchAsync(async (req, res, next) => {
    const {user} = req;
    res.status(200).json({
        status: "success",
        message: "User Info FOund Successfully",
        data: {
            user,
        },
    });
});
//Update

exports.updateMe = catchAsync(async (req, res, next) => {
    const {name, jobTitle, bio, country} = req.body;
    const {_id} = req.user;
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            name,
            jobTitle,
            bio,
            country,
        },
        {
            new: true,
            validateModifiedOnly: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "profile Updated Sucessfully",
        data: {
            user: updatedUser,
        },
    });
});

// update Avatar

exports.updateAvatar = catchAsync(async (req, res, next) => {
    const {avatar} = req.body;
    const {_id} = req.user;
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatar,
        },
        {
            new: true,
            validateModifiedOnly: true,
        }
    );
    res.status(200).json({
        status: "success",
        message: "Avatar Updated Sucessfully",
        data: {
            user: updatedUser,
        },
    });
});

//update password
exports.updatePassword = catchAsync(async (req, res, next) => {
    const {currentPassword, newPassword} = req.body;
    const {_id} = req.user;
    const user = await User.findById(_id).select("+password");
    if (!(await user.correctPassword(currentPassword, user.password))) {
        return res.status(400).json({
            status: "error",
            message: "Current Password is incorrect",
        });
    }
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save({});
    res.status(200).json({
        status: "success",
        message: "Passord Updated Successfully",
    });
});

//Get users
exports.getUsers = catchAsync(async (req, res, next) => {
    const {_id} = req.user;
    const other_verified_users = await User.fin({
        _id: {$ne: _id},
        verfied: true,
    }).select("name avatar _id status");
    res.status(200).json({
        status: "success",
        message: "user Found successfully",
        data: {
            users: other_verified_users,
        },
    });
});

// Start Conversation

exports.startConversation = catchAsync(async (req, res, next) => {
    const {userId} = req.body;
    const {_id} = req.user;
    // Check if a conversation b/w those user already exsists
    let conversation = await Conversation.findOne({
        participants: {$all: {userId, _id}},
    })
        .populate("messages")
        .populate("participants");
    if (conversation) {
        return res.status(200).json({
            status: "success",
            data: {
                conversation,
            },
        });
    } else {
        // create new conversation
        let newConversation = await conversation.create({
            participants: [userId, _id],
        });
        newConversation = await conversation
            .findById(newConversation._id)
            .populate("messages")
            .populate("participants");
        return res.status(201).json({
            status: "success",
            data: {
                conversation: newConversation,
            },
        });
    }
});

//Get Conversations
exports.getConversation = catchAsync(async (req, res, next) => {
    const {_id} = req.user;
    // Find all conversation where the current user is a participant
    const conversations = await Conversation.find({
        participants: {$in: [_id]},
    })
        .populate("messages")
        .populate("participants");
    // Send the list of conversation as a response
    res.status(200).json({
        status: "success",
        data: {
            conversations,
        },
    });
});
