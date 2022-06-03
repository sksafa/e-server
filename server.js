
    const app = require('./app');
    require('dotenv').config()
  const cloudinary = require('cloudinary');

    process.on("uncaughtException",(err)=>{
      console.log(`Error: ${err.message}`)
      console.log(`Shuting down the server for uncaughtException`)
    })

    // const mongoose = require('mongoose');

    // const URI = process.env.DB_URL;

    // mongoose.connect(URI, {
    //     useNewUrlParser: true, 
    //     useUnifiedTopology: true 
    // }, err => {
    // if(err) throw err;
    // console.log('Connected to MongoDB!!!')
    // });
  const connectDatabase = require("./db/database.js")
  connectDatabase();
  
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret:  process.env.CLOUDINARY_SECRET,
  });

    const port = process.env.PORT || 8000;
    

    const server = app.listen( port,()=>{
        console.log("server is runnig" ,port);
    })

//unhandel reaction

process.on("unhandledRejection", (err)=>{
  console.log(`shutting down server for ${err.message}`);
  console.log(`shutting down server due to Unhandled promise rejection`);
  server.close(()=>{
    process.exit(1)
  });
});




