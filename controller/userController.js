const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require('../utils/jwtToken');
const SendMail = require("../utils/sendMail");
const crypto = require("crypto");
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// create or registration user 
exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await  cloudinary.v2.uploader.upload(req.body.avatar, {
        folder :"avatars",
        width:150,
        crop:"scale",
    })
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id:myCloud.public_id,
            url: myCloud.secure_url,
        }
    })
    sendToken(user, 200, res);
})



//login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
        return next(new errorHandler("Please enter email and password", 400))
    }

    const user = await User.findOne({email}).select("+password");
    console.log("this is user", user)
    if (!user) {
        console.log("after if ", user)
        return next(new ErrorHandler("User Not find with this email and password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new errorHandler("User Not find with this email and password", 401))
    }
    sendToken(user, 201, res);
})



//logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "log out success"
    })
})

// Forget Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new errorHandler("User not find with this mail", 404));
    }
    //get reset password token
    const resetToken = user.getResetToken();
    await user.save({
        validateBeforeSave: false
    });
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl}`;
    try {
        await SendMail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTime = undefined;

        await user.save({
            validateBeforeSave: false
        });
        return next(new errorHandler(error.message))

    }

});

//reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime: { $gt: Date.now() },
    })
    if (!user) {
        return next(new errorHandler("Reset password url is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler("Password is not matched with the new password", 400));
    }
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save();
    sendToken(user, 200, res);

})

// get user details 
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});


// update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new errorHandler("Old Password Is incorrect", 400))
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password not matched with each other", 400));
    }

    user.password = req.body.newPassword;

    await user.save()
    sendToken(user, 200, res)

});

//update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    // we add cloudinary letter than we are giving condition
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true
    })
});

// get all user  for admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
});


// get single  user details for admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User Not find with this id", 400))
    }
    res.status(200).json({
        success: true,
        user
    })
});


//update user role for -- admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    // we add cloudinary letter than we are giving condition
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        user
    })
});

//delete user for -- admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    // we add cloudinary letter than we are giving condition

    const user = await User.findByIdAndUpdate(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User Not find with this id", 400))
    }
    await user.remove()

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
});

