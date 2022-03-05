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
    const features = new Features(Product.find(), req.query).search().filter().pagination(resultPerPage);
    // const product = await Product.find();
    const product = await features.query;
    res.status(200).json({
        success:true,
        product
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
        return next( new ErrorHandler("product isddd not found with this id", 404));
    }
    res.status(200).json({
        success:true,
        product
    })
})