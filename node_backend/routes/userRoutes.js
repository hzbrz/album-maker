const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/is-auth");
const userController = require("../controllers/userController");

router.post("/room", isAuth, userController.createRoom);

module.exports = router;