const mongoose = require('mongoose')
const {
    ObjectId
} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    category: {
        type: ObjectId,
        ref: 'Category',
    },
    quantity: {
        type: Number
    },
    image: {
        type: String
    },
    cloudPath:{
        type: String
    },
    seller:{
        type:ObjectId,
        ref:"Sellers",
    },
    user:{
        type: ObjectId,
        ref: "Users"
    }
}, {
    timestamps: true
})

module.exports = Products = mongoose.model("Product", productSchema)