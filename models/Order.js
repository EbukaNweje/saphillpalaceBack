const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    name: {type: String, required: true},
    products: {type: String, required: true},
    Address: {type: String, required: true},
    Gross: {type: Number},
    Admin: {type: Number, required: true},
    phone: {type: Number, required: true},
    company: {type: String}
}, {timestamps:true })

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel