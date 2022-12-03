const express = require('express');
const router = express.Router();
const {
    getProductsForSeller,
    createSeller,
    getSellers,
    getSingleSeller,
    // upload,
    addProduct,
    login,
    uploads
} = require("../controllers/sellers.controller")

router.get("/Product/:id", getProductsForSeller);
router.post("/Create", createSeller);
router.post("/login", login);
router.get("/all", getSellers);
router.get("/one/:id", getSingleSeller);
router.post("/create/:id/:catId", uploads, addProduct);

module.exports = router