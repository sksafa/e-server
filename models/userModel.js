const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs/dist/bcrypt");
const crypto = require("crypto");

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
//generate hashed password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

//code for me to another 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES
    });
};

//login password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//forget password
userSchema.methods.getResetToken = function(){
    //generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //hashing and adding resetPasswordToken to user schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTime = Date.now() + 15*60*1000;
    return resetToken;
}

module.exports = mongoose.model("User", userSchema);
