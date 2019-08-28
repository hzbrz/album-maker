const express = require("express");

const router = express.Router();

const isAuth = require('../middleware/is-auth');
const loggedInRef = require("../middleware/loggedInRef");
const photoController = require("../controllers/photoController");

// if the user is redirected while logged in and has an invitation to an album then handle it in the same func or middleware?
router.post("/albums", isAuth, loggedInRef, photoController.getUserAlbums);

router.post("/photos", isAuth, photoController.getUserPhotos);

router.post("/photo", isAuth, photoController.storePhoto);

// delete requires an Id becasue the delete method does not take a body during the request from client
router.delete("/photo/:photoId/:album/:matchUser", isAuth, photoController.deletePhoto)

module.exports = router;