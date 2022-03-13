const ErrorHandler = require('../utils/errorHandler');

ErrorHandler

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server error"
    // wrong mongo db id error
    if (err.name === "CastError") {
        const message = `Resource Not Found with this id. Invalid Id ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Duplicate email error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //jwt wrong error
    if (err.code === "jsonWebTokenError") {
        const message = `Your url is invalid please try again`;
        err = new ErrorHandler(message, 400);
    }

    //jwt expired error
    if (err.code === "TokenExpiredError") {
        const message = `Your url is expired please try again`;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}