const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler"); 
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Features = require("../utils/Features")

//create product
exports.createProduct = catchAsyncErrors(async(req, res,next) =>{
     const product = await Product.create(req.body);
     res.status(201).json({
         success:true,
         product
     })
    // next()
})

// get all product 
exports.getAllProducts= catchAsyncErrors(async (req, res)=>{
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const features = new Features(Product.find(), req.query).search().filter().pagination(resultPerPage);
    // const product = await Product.find();
    const products = await features.query;
    res.status(200).json({
        success:true,
        products,
        resultPerPage,
        productsCount
    })
});

// update product 
exports.updateProduct = catchAsyncErrors(async (req, res) =>{
    let product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product is not found "
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useUnified: false
    });
    res.status(200).json({
        success:true,
        product
    })
})

//delete product
exports.deleteProduct = catchAsyncErrors(async (req, res) =>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"product is not found of this id"
        })
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })
})

//single prpoduct details
exports.singleProductDetails = catchAsyncErrors(async(req, res,next) =>{
    const product = await Product.findById(req.params.id);
    if(!product){ 
        return next( new ErrorHandler("product is not found with this id", 404));
    }
    res.status(200).json({
        success:true,
        product
    })
})

//create review or updated the review 
exports.createProductReview = catchAsyncErrors(async (req,res,next) =>{
    const {rating, comment, productId} =req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if(isReviewed){
        product.reviews.forEach((rev) => {
            if(rev.user.toString()===  req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) =>{
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,

    });
});

// single product review
exports.getSingleProductReviews = catchAsyncErrors (async (req,res,next) =>{
    const product = await Product.findById(req.query.id);
    if(!product){
        return next (new ErrorHandler("product is not find with this id",400));
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews
    });
});



// delete the review for admin user  
exports.deleteReview = catchAsyncErrors(async (req, res, next) =>{
   console.log("delete revew is working")
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next (new ErrorHandler("product is not find with this id",404))
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) =>{
        avg += rev.rating;
    });

    let ratings = 0;
    if(reviews.length === 0){
        ratings = 0;
    }else{
        ratings  = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify:false
        }
    );
    res.status(200).json({
        success:true
    });

});

