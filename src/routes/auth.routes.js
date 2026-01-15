const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", auth, authController.logout);

router.patch("/change-password", auth, userController.changePassword);
router.patch("/profile", auth, userController.updateProfile);
router.post("/refresh-token", authController.refreshToken);
module.exports = router;
