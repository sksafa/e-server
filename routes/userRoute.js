const express = require('express')
const router = express.Router()
const { createUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    userDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
} = require('../controller/userController')

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

router.route("/registration").post(createUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, userDetails);
router.route("/me/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update/info").put(isAuthenticatedUser, updateProfile);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);
// router.route("/me").get(isAuthenticatedUser, userDetails);
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router