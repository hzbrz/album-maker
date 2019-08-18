const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController")
const isAuth = require("../middleware/is-auth");

router.get("/user", isAuth, authController.getUser)

router.post('/login', authController.login)

module.exports = router;
