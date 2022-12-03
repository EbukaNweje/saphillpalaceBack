const dotenv = require("dotenv")
dotenv.config({path: './index.env'})
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    // cloud_name: process.env.CLOUD_NAME, 
    // api_key: "v0vQKVaV2lnXj7dkjrLmdX48_0A",  
    // api_secret: 434824617451519 
    cloud_name: 'ebuka-commerce', 
    api_key: '652245734538293', 
    api_secret: '4cvnLYVqvbtjasphnhTFvkkrY38'
  });

  module.exports = cloudinary