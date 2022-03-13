const ErrorHandler = require("../utils/errorHandler"); 
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Features = require("../utils/Features")
const Order = require('../models/oderModel')

// create order
exports.orderCreate = catchAsyncErrors(async (req,res,next ) =>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user:req.user._id,
    });

    res.status(200).json({
        success:true,
        order,
    });
});

// get single order 
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );
    if(!order){
        return next (new ErrorHandler('order items not found with this id'));
    }
    res.status(200).json({
        success:true,
        order
    })
});

//Get all orders -- user 
exports.getAllOrders = catchAsyncErrors(async(req,res, next) =>{

    const orders = await Order.find({user:req.user._id});
    res.status(200).json({
        success:true,
        orders
    })
});

//get all orders for admin
exports.getAdminAllOrders = catchAsyncErrors(async(req,res, next) =>{

    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
});