const express = require("express");

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const photoController = require("../controllers/photoController");

router.get("/photos", isAuth, photoController.getUserPhotos);

router.post("/photo", isAuth, photoController.storePhoto)

module.exports = router;