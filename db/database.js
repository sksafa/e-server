const mongoose = require('mongoose');
require('dotenv').config()


const URI = process.env.DB_URL;


const connectDatabase = () =>{
    mongoose.connect(URI,{
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then((data) =>{
         console.log("db conneted",data.connection.host)
    })

}


module.exports = connectDatabase;