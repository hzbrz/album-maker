const firebase = require("firebase");

exports.getUserPhotos = (req, res, next) => {
  // if album id exists then get album photos, else just get user photos
  let userId = req.userId;
  let imageArray = [];
  let firestore = firebase.firestore();
  firestore.collection('photos').where("creator", "==", userId).get()
    .then(snap => {
      return new Promise((resolve, reject) => {
        snap.forEach(image => {
          let imageObj = {
            image: image.data().image,
            _id: image.id
          }
          imageArray.push(imageObj)
          resolve(imageArray);
        })
      })
        .then(imageArr => {
          res.status(200).json({ message: "User photos fetched", images: imageArr })
        })
        .catch(err => console.log("ERROR cant find pictures "))
    })
    .catch(err => console.log("ERROR while getting photos ", err.message))
}

exports.storePhoto = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  const path = req.body.filepath;
  let userId = req.userId
  let firestore = firebase.firestore();
  let userObjectFromDb = firestore.doc("users/" + userId);
  firestore.collection("photos").add({
    image: imageUrl,
    filepath: path,
    creator: userId
  })
    .then(photoRef => {
      console.log("Photo created")
      userObjectFromDb.update({ photos: firebase.firestore.FieldValue.arrayUnion(photoRef.id) })
      // getting references to send the response to the client
      photoRef.get()
        .then(snap => {
          // TODO: store image as blob then store in db and then get photo from db to client
          return snap.data().image
        })
        // promise handling the image that was returned
        .then(image => {
          userObjectFromDb.get()
            .then(snap => {
              // sending the photo to the db under photos collection
              res.status(200).json({
                message: "Photo inserted",
                photoUrl: image,
                creator: { _id: snap.id, name: snap.data().name }
              })
            })
            .catch(err => console.log("could not get user object from db ", err))
        })
        .catch(err => console.log("no image is found ", err))
    })
    .catch(err => console.log("ERROR while storing the photo ", err))
}


exports.deletePhoto = (req, res, next) => {
  // reading the id from the parameter of the request
  const photoId = req.params.photoId;
  let userId = req.userId;
  let firestore = firebase.firestore();
  let userDocRef = firestore.collection("users").doc(userId)
  userDocRef.update({ photos: firebase.firestore.FieldValue.arrayRemove(photoId) })
  firestore.collection('photos').doc(photoId).get()
    .then(snap => {
      res.json({ message: "User deleted", path: snap.data().filepath })
      firestore.collection('photos').doc(photoId).delete();
    })
    .catch(err => console.log("ERROR while getting photo from db ", err))
}