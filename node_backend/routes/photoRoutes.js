const express = require("express");

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const photoController = require("../controllers/photoController");

router.get("/albums", isAuth, photoController.getUserAlbums);

router.post("/photos", isAuth, photoController.getUserPhotos);

router.post("/photo", isAuth, photoController.storePhoto);

// delete requires an Id becasue the delete method does not take a body during the request from client
router.delete("/photo/:photoId/:album/:matchUser", isAuth, photoController.deletePhoto)

module.exports = router;