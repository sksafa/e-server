
    const app = require('./app');
    require('dotenv').config()
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
    
    const port = process.env.PORT || 8000;
    

    const server = app.listen( port,()=>{
        console.log("server is runnig" ,port);
    })

    


