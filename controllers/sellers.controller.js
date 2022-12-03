const sellers = require("../models/Sellers.js");
const Products = require("../models/Product")
const jwt = require('jsonwebtoken'); // to generate token
const bcrypt = require('bcrypt');
const schema = require("../models/validation");
const multer = require("multer");
const path = require("path");
const Category = require("../models/Category")
const cloudinary = require("../config/cloudinary")

const createSeller = async(req, res, next) =>{
    try{
        let checkUser = await sellers.findOne({email: req.body.email});
        if (checkUser) {
            return res.status(400).json({
            errors: [{
                msg: 'User already exists',
            }, ],
            });
        }
        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newSeller = await sellers.create({
            name: req.body.name,
            lastName: req.body.lastName,
            storeName: req.body.storeName,
            Address1: req.body.Address1,
            Address2: req.body.Address2,
            email: req.body.email,
            cityTown: req.body.cityTown,
            stateCountry: req.body.stateCountry,
            storePhone: req.body.storePhone,
            postCode: req.body.postCode,
            productType: req.body.productType,
            password: hashPassword,
        });

		res.status(201).json({ message: "Success" , data: newSeller});
    }catch(err){
        next(err)
    }
}

const login = async (req, res, next)=>{
    try{
        const {email} = req.body
        const user = await sellers.findOne({email})
        if(user){
            const checkPassword = await bcrypt.compare(req.body.password, user.password)
            if(checkPassword){
                const { password, ...info } = user._doc
                const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                    name: user.name,
                }, "IWoulDBEtHEBestPROgrMMERinTHEWorld", { expiresIn: "1d"})
                res.status(200).json({message:`Welcome ${user.name}`, data: {...info, token}})
            }else{
                res.status(400).json({ message: "Password is incorrect" });
            }
        }else{
            res.status(400).json({ message: "user not found" });
        }
    }catch(error){
        next(error)
    }
}

const getSellers = async (req, res, next)=>{
    try{
        const allSellers = await sellers.find();
        res.status(200).json({data: allSellers})
    }catch(err){
        next(err)
    }
}

const getSingleSeller = async(req, res, next)=>{
    try{
        const id = req.params.id;
        const oneSeller = await sellers.findById(id)
        res.status(200).json({data: oneSeller})
    }catch(err){
        next(err)
    }
}

const getProductsForSeller = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const products = await Products.find().where("Seller").equals(`${id}`);
        res.status(200).json({data: products})
    }catch(err){
        next(err)
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
    }
})

const uploads = multer({storage: storage}).single("image")
// const upload = multer({storage: storage}).single("image")

const addProduct = async (req, res, next)=>{
    const {name, price, description, quantity} = req.body
    const id = req.params.id;
    const catId = req.params.catId;
    const Cat = await Category.findById(catId);
    const seller = await sellers.findById(id);
    const results = await cloudinary.uploader.upload(req.file.path)
    try{
        const createStore = await Products({
            name,
            price,
            description,
            quantity,
            image: results.secure_url,
            cloudPath: results.public_id
        })
        createStore.seller = seller;
        createStore.category = Cat;
        createStore.save();
        seller.Products.push(createStore);
        seller.save();
        res.status(200).json({message: "Item Created"})
    }catch(err){
        next(err)
    }
}

module.exports = {
    getProductsForSeller,
    createSeller,
    // upload,
    getSellers,
    getSingleSeller,
    addProduct,
    uploads,
    login
}