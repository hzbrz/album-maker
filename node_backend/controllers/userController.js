const firebase = require("firebase");

exports.createRoom = (req, res, next) => {
  // TODO: user can only have one album as of now, logic: if the user already as an album id associated with them, then they
  // cant create another album if not let the user create an album
  let userId = req.userId;
  let name = req.body.name;
  let firestore = firebase.firestore();
  let userDocRef = firestore.collection("users").doc(userId)

  userDocRef.get()
    .then(snap => {
      // if the album field comes as undefined that means the album field does not exist and thus the user has never created one
      if (typeof snap.data().album == "undefined") {
        // creating an album/room for the user in the db and then the user that creates it is set as an admin
        firestore.collection("albums").add({
          roomName: name + "'s room",
          // the user is added as an admin in an admins array
          admins: firebase.firestore.FieldValue.arrayUnion(userId)
        })
          .then(albumRef => {
            // using update because we are just updating the document using set just resets the entire doc and only puts the album id
            userDocRef.update({ album: albumRef.id })
            res.status(200).json({ message: "Album created", refLink: "http://localhost:3000/" + albumRef.id })
          })
          .catch(err => console.log("could not create an album room ", err))
      }
      // if album already exists then they cant anymore... for now(adv feature)
      else {
        res.status(200).json({ message: "User already has created an album" })
      }
    })
    .catch(err => console.log("Could not get the user to read the fields ", err))
}