const firebase = require("firebase");

module.exports = (req, res, next) => {
  let albumId = req.body.albumId;
  let firestore = firebase.firestore();
  if (!albumId) {
    console.log("User was not redirected after invite")
  } else {

  }
  next();
}