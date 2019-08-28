const firebase = require("firebase");
const albumIdArrSecret = require("../secrets").secret_id_for_albums_arr;

module.exports = (req, res, next) => {
  const albumId = req.body.albumId;
  const userId = req.userId;
  let firestore = firebase.firestore();
  if (!albumId) {
    console.log("User was not redirected after invite")
  } else {
    // get the albums ids from the album_ids coll that tarcks all album/rooms
    firestore.collection("albums_ids").doc(albumIdArrSecret).get()
      .then(snap => {
        if (snap.data().ids.includes(albumId)) {
          console.log("Album id found in the array, this room exists!")
          // then setting
          firestore.collection("users").doc(userId).update({
            albumUserPartOf: firebase.firestore.FieldValue.arrayUnion(albumId)
          })
        } else {
          // if the albumId does not match any of the rooms that in the db then
          console.log("Album id was not matched with anything in db albums")
        }
      })
      .catch(err => console.log("Could not get the album/room ids ", err))
  }

  req.currentAlbum = albumId

  next();
}