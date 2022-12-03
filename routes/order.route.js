const express = require('express');
const router = express.Router();
const { addOrder, updateOrder, deleteOrder, getAllOrders, getOneOrder } = require("../controllers/order.controller");

router.post("/new", addOrder);
router.patch("/change/:id", updateOrder);
router.delete("/remove/:id", deleteOrder);
router.get("/see/:id", getOneOrder);
router.get("/see/", getAllOrders);


module.exports = router;