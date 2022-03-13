const express = require('express');
const { orderCreate,getSingleOrder,getAllOrders,getAdminAllOrders } = require('../controller/orderControler');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

router.route("/order/new").post(isAuthenticatedUser, orderCreate);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, getAllOrders);
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"), getAdminAllOrders);


module.exports = router