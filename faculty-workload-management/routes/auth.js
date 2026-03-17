const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/login", authController.showLogin);
router.post("/login", authController.postLogin);

router.get("/register", authController.showRegister);
router.post("/register", authController.postRegister);

router.post("/logout", authController.postLogout);

module.exports = router;

