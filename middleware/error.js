const ErrorHandler = require('../utils/errorHandler');

ErrorHandler

module.exports =(err,req, res, next)=>{
   err.statusCode = err.statusCode || 500
   err.message = err.message || "Internal Server error"

   res.status(err.statusCode).json({
       success:false,
       message: err.message
   });
}