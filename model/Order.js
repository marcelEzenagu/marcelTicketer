const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    status: {type: String},
    distance: {type: Number, default:3}
})

const Order = mongoose.model("Order", orderSchema)

module.exports = Order