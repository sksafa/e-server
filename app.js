const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const ErrorHandler = require("./middleware/error")
const app = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(cors());


const product = require("./routes/productRoute");
const user = require("./routes/userRoute")

app.use("/api/v2", product);
app.use("/api/v2", user);
app.use(ErrorHandler);

module.exports = app