const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    status: {type: Boolean, default: false},
    storeName: {type: String, required: true},
    Address1: {type: String, required: true},
    Address2: {type: String, required: true},
    cityTown: {type: String, required: true},
    stateCountry: {type: String, required: true},
    password: {type: String, required: true},
    storePhone:{type: Number, required: true},
    postCode: {type: Number, required: true},
    productType: {type: String, required: true},
    Products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
        }
    ]
}, {timestamps: true})

const sellerModel = mongoose.model("Seller", sellerSchema)

module.exports = sellerModel