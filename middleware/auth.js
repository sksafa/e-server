const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require('jsonwebtoken');

//protected route for user / admin
exports.isAuthenticatedUser = catchAsyncErrors( async(req, res, next) =>{
    const {token} = req.cookies;
    if(!token){
        return(next (new errorHandler("Please login for this resource",401)));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    next();
})

//private route for admin.  Is admin

exports.authorizeRoles =(...roles) =>{
    return(req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new errorHandler(`${req.user.role} cannot access this resource`));
        };
        next();
    }
}

