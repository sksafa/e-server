const ErrorHandler = require('../utils/errorHandler');

ErrorHandler

module.exports =(err,req, res, next)=>{
   err.statusCode = err.statusCode || 500
   err.message = err.message || "Internal Server error"
  // wrong mongo db id error
  if(err.name === "CastError"){
      const message = `Resource Not Found with this id. Invalid Id ${err.path}`;
      err = new ErrorHandler(message,404);
  }
   res.status(err.statusCode).json({
       success:false,
       message: err.message
   });
}