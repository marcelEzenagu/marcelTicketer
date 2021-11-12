const express = require ("express")
const dotenv = require("dotenv");
dotenv.config() 
const Order = require('./model/Order');
const orderRouter = require("./routes");

const app = express();

// middleware
app.use(express.json());
    app.use(express.urlencoded());

    // routes


app.use(orderRouter)


module.exports = app