const express = require('express')
const router = express.Router()
const { getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    singleProductDetails, 
    createProductReview, 
    getSingleProductReviews,
    deleteReview
} = require('../controller/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// router.route("/product/:id").put(updateProduct);
router.route("/products").get(getAllProducts);
router.route("/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);
router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.route("/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)
router.route("/product/:id").get(singleProductDetails);

router.route("/product/review").post(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getSingleProductReviews);
router.route("/reviews").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteReview);


module.exports = router