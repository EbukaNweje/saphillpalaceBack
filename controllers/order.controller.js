const Order = require("../models/Order");

const addOrder = async (req, res, next)=>{
    try{
        const newOrder = await Order.create({
            name: req.body.name,
            Address: req.body.Address,
            products: req.body.products,
            Gross: req.body.Gross,
            phone: req.body.phone,
            company: req.body.company,
            Admin: req.body.Admin
        });
        res.json(200).json({data: newOrder});
    }catch(err){
        next(err)
        res.json({error: err.message})
    }
};

const updateOrder = async (req, res)=>{
    try {
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
        $set: req.body,
        },
        { new: true }
    );
    res.status(200).json(updatedOrder);
    } catch (err) {
    res.status(500).json(err);
    }
};

const deleteOrder = async (req, res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted...");
    } catch (err) {
    res.status(500).json(err);
    }
};

const getAllOrders = async (req, res, next) =>{
    try{
        const allOrders = await Order.find();
        res.status(200).json({data: allOrders})
    }catch(err){
        next(err)
    }
}
const getOneOrder = async (req, res, next) =>{
    try{
        const Id = req.params.id
        const oneOrder = await Order.findById(Id);
        res.status(200).json({data: oneOrder})
    }catch(err){
        next(err)
    }
}


module.exports = {
    addOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOneOrder
}