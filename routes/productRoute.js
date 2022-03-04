const express = require('express')
const router = express.Router()
const { getAllProducts,createProduct,updateProduct,deleteProduct,singleProductDetails } = require('../controller/productController')

router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(singleProductDetails);


module.exports = router