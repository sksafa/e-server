const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// create or registration user 
exports.createUser = catchAsyncErrors(async(req,res,next)=>{
    const {name,email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"https://test.com",
            url:"https://test.com"
        }
    })
    res.status(201).json({
        success:true,
        user
    })
})
