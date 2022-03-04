const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter a name of your product"],
        trim: true,

    },
    description: {
        type: String,
        required: [true, "Please add a description of your product "],
        trim: true,
        maxlength: [4000, "Description is cannot exceed 4000 character"],
    },
    price: {
        type: Number,
        required: [true, "Please add a description of your product "],
        maxlength: [8, "Price is cannot exceed 8 character"],

    },
    discountPrice: {
        type: String,
        maxlength: [4, "Discount price is cannot exceed 4 character"],
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    rating: {
        type: Number,
    },
    image: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },

        }
    ],
    category: {
        type: String,
        required: [true, "Please add a category of your product"],
    },
    stock: {
        type: Number,
        required: [true, "Please add some stock of your product"],
        maxlength: [3, "Stock price is cannot exceed 3 character"],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                // required: true,
            },
            name: {
                type: String,
                // required: true,
            },
            rating: {
                type: Number,
                // required: true,
            },
            comment: {
                type: String,
            },
            time:{
                type:Date,
                default:Date.now(),
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        // required: true,
    },
    createAt:{
        type:Date,
        default:Date.now(),
    }


})


module.exports = mongoose.model("Product",productSchema);

