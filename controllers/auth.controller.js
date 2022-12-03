const jwt = require('jsonwebtoken'); // to generate token
const bcrypt = require('bcrypt'); 
const User = require('../models/User');
const schema = require("../models/validation");
const multer = require("multer");
const Products = require('../models/Product');
const Seller =require("../models/Sellers");
const path = require("path")
const Category = require("../models/Category")
const cloudinary = require("../config/cloudinary")



const getUser = async (req, res) => {
    try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json(user)
    } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error')
}};

const getAllUsers = async (req, res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users)
    }catch(error){
        res.status(500).send('Server Error')
    }
}

const signUp = async(req, res, next)=>{
    try {
        const result = await schema.validateAsync(req.body)
        // console.log(result)
        let checkUser = await User.findOne({email: result.email});
        if (checkUser) {
            return res.status(400).json({
            errors: [{
                msg: 'User already exists',
            }, ],
            });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(result.password, salt);
        const user = await User.create({
            name: result.name,
            email: result.email,
            // avatar,
            password: hashPassword,
        });

		res.status(201).json({ message: "Success" , data: user});
        } catch (error) {
            if(error.isJoi === true) error.status = 422
        next(error)
        }
}

const login = async (req, res, next)=>{
    try{
        const {email} = req.body
        const user = await User.findOne({email})
        if(user){
            const checkPassword = await bcrypt.compare(req.body.password, user.password)
            if(checkPassword){
                const { password, ...info } = user._doc
                const token = jwt.sign({
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    isAdmin: user.isAdmin
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

const verified = async(req, res, next)=>{
    try{
        const authToken = req.headers.authorization
        if(authToken){
            const token = authToken.split(" ")[1]
            jwt.verify(token, "IWoulDBEtHEBestPROgrMMERinTHEWorld", (error, payload)=>{
                if(error){
                    res.status(400).json({message: "Please check your token"})
                }else{
                    req.user = payload
                    next()
                }
            })
        }else{
            res.status(400).json({message: "token incorrect"})
        }
    }catch(error){
        res.status(400).json({message: "You don't have the permission to do this operation"})
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

const upload = multer({storage: storage}).single("image")

const add = async (req, res, next)=>{
    const { name, price,description, quantity } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path)
    const id = req.params.id;
    const catId = req.params.catId;
    const cate = await Category.findById(catId);
    const adminUser = await User.findById(id);
    try{
        const createStore = await Products({
            name,
            price,
            description,
            quantity,
            image: result.secure_url,
            cloudPath: result.public_id
        })
        createStore.user = adminUser;
        createStore.category = cate;
        createStore.save();
        adminUser.products.push(createStore);
        adminUser.save();
        res.status(200).json({message: "Item Created"})
        // if(req.user.isAdmin){
        //     const createStore = await Products({
        //         name,
        //         price,
        //         description,
        //         quantity,
        //         image: result.secure_url,
        //         cloudPath: result.public_id
        //     })
        //     createStore.user = adminUser;
        //     createStore.category = cate;
        //     createStore.save();
        //     adminUser.products.push(createStore);
        //     adminUser.save();
        //     res.status(200).json({message: "Item Created"})
        // }else{
        //     res.status(400).json({message: "You don't have permission to add items"})
        // }
    }catch(error){
        res.status(400).json({message: "You don't have have the permission to carry out this task"});
        next(error)
    }
}

const addCategory = async (req, res, next)=>{
    try{
        const newCategory = await Category.create({
            name: req.body.name
        })
        res.status(201).json({message: "Success"})
    }catch(err){
        next(err)
    }
}

const getAllCat = async (req, res, next)=>{
    try{
        const allCat = await Category.find()
        res.status(200).json({data: allCat})
    }catch(err){
        next(err)
    }
}

const getAllProducts = async (req, res, next) =>{
    try{
        const allProducts = await Products.find();
        res.status(200).json({data: allProducts})
    }catch(err){
        next(err)
    }
}
const getSingleProducts = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const singleProd = await Products.findById(id);
        res.status(200).json({data: singleProd})
    }catch(err){
        next(err)
    }
}

const getProductsForAdmin = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const products = await Products.find().where("user").equals(`${id}`);
        res.status(200).json({data: products})
    }catch(err){
        next(err)
    }
};

const deleteUser = async (req, res)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
    res.status(500).json(err);
    }
};
const deleteProduct = async (req, res)=>{
    try {
        await Products.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
    res.status(500).json(err);
    }
};


module.exports = {
    getUser,
    signUp,
    login,
    add,
    verified,
    upload,
    addCategory,
    getAllCat,
    getAllProducts,
    getAllUsers,
    getSingleProducts,
    getProductsForAdmin,
    deleteUser,
    deleteProduct
}