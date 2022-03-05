const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Your Name."],
        minlength: [3, "Name should be 3 character"],
        maxlength: [15, "Name can not big than 15 Character"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password should greater than 8 character"],
        select:false
    },
    avatar:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    role:{
        type: String,
        default: "user" 
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,

})

userSchema.pre("save", async function(next){
    this.password = await bcrypt.hash(this.password,10);
})

module.exports = mongoose.model("User", userSchema);
