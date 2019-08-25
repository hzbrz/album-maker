const firebase = require("firebase");

exports.getUserAlbums = (req, res, next) => {
  const userId = req.userId;
  let firestore = firebase.firestore();
  let albumColl = firestore.collection("albums")
  let albumsArray = []
  firestore.collection("users").doc(userId).get()
  .then(snap => {
    return new Promise((resolve, reject) => {
      snap.data().albumUserPartOf.forEach(albumId => {
        albumColl.doc(albumId).get()
        .then(snap => {
          console.log(snap.data())
          let albumObj = {
            name: snap.data().roomName,
            id: albumId
          }
          albumsArray.push(albumObj)
          resolve(albumsArray)
        })
        .catch(err => console.log("Could not get the albums collection ", err))
      })
    })
    .then(albumsArr => {
      console.log(albumsArr)
      res.status(200).json({ message: "Albums fetched", albums: albumsArr})
    })
    .catch(err => console.log("Promise resolve failed, could not get the albums ", err))
  })
  .catch(err => console.log("Could not fetch the user for albums ", err))
}

exports.getUserPhotos = (req, res, next) => {
  // if album id exists then get album photos, else just get user photos
  const albumId = req.body.albumId;
  let userId = req.userId;
  let imageArray = [];
  let firestore = firebase.firestore();
  // if the user is not using a referral link
  if (!albumId) {
    console.log("User is not part of an album ", albumId)
    // if there is not inv link then just create photo normally and set it to part of the user profile in db
    firestore.collection('photos').where("creator", "==", userId).get()
      .then(snap => {
        return new Promise((resolve, reject) => {
          snap.forEach(image => {
            let imageObj = {
              image: image.data().image,
              _id: image.id,
              filepath: ""
            }
            imageArray.push(imageObj)
          })
          resolve(imageArray);
        })
          .then(imageArr => {
            res.status(200).json({ message: "User photos fetched from profile", images: imageArr })
          })
          .catch(err => console.log("ERROR cant find pictures "))
      })
      .catch(err => console.log("ERROR while getting photos ", err.message))
    // else if the user signs in with an inviation/referral link
  } else {
    console.log("User used a referral link to sign in ", albumId)
    // get photos from the album id and albums collection
    firestore.collection("albums").doc(albumId).get()
      .then(albumSnap => {
        res.status(200).json({ message: "User photos fetched from album", images: albumSnap.data().photos })
      })
      .catch(err => console.log("Cannot get photos from the album ", err))
  }
}

exports.storePhoto = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  const path = req.body.filepath;
  const albumId = req.body.albumId;
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
          // store image as blob then store in db and then get photo from db to client
          return { image: snap.data().image, id: photoRef.id }
        })
        // promise handling the image that was returned
        .then(image => {
          if (!albumId) {
            console.log("STORE PHOTO NO ALBUM ID")
            userObjectFromDb.get()
              .then(snap => {
                // sending the photo to the db under photos collection
                res.status(200).json({
                  message: "Photo inserted",
                  photoUrl: image.image,
                  creator: { _id: snap.id, name: snap.data().name }
                })
              })
              .catch(err => console.log("could not get user object from db ", err))
          } else {
            console.log("STORE PHOTO ALBUM ID FOUND: ", albumId)
            firestore.collection("albums").doc(albumId).update({
              photos: firebase.firestore.FieldValue.arrayUnion({ image: image.image, _id: image.id, filepath: path })
            })
            res.status(200).json({
              message: "Photo inserted in album",
              photoUrl: image
            })
          }
        })
        .catch(err => console.log("no image is found ", err))
    })
    .catch(err => console.log("ERROR while storing the photo ", err))
}


exports.deletePhoto = (req, res, next) => {
  // reading the id from the parameter of the request
  const photoId = req.params.photoId;
  let userId = req.userId;
  let albumId = req.albumId;
  let image = req.originalUrl.split("?image=")[1];
  let storage = image.split("/?filepath=");
  const imageUrl = storage[0].trim();
  const filepath = storage[1].replace("%20", " ");
  let firestore = firebase.firestore();
  let userDocRef = firestore.collection("users").doc(userId)
  let imageObj = {
    _id: photoId, filepath: filepath, image: imageUrl
  }

  if (!albumId) {
    console.log("albumID is not found")
    userDocRef.update({ photos: firebase.firestore.FieldValue.arrayRemove(photoId) })
    firestore.collection('photos').doc(photoId).get()
      .then(snap => {
        res.json({ message: "User deleted", path: snap.data().filepath })
        firestore.collection('photos').doc(photoId).delete();
      })
      .catch(err => console.log("ERROR while getting photo from db ", err))
  } else {
    firestore.collection("albums").doc(albumId).update({
      photos: firebase.firestore.FieldValue.arrayRemove(imageObj)
    })
    res.json({ message: "User deleted", path: null })
    // userDocRef.update({ photos: firebase.firestore.FieldValue.arrayRemove(photoId) })
    // firestore.collection('photos').doc(photoId).get()
    //   .then(snap => {
    //     res.json({ message: "User deleted", path: null })
    //     firestore.collection('photos').doc(photoId).delete();
    //   })
    //   .catch(err => console.log("ERROR while getting photo from db ", err))
  }
}