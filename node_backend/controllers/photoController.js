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
          res.status(200).json({ message: "Albums fetched", albums: albumsArr })
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
  let userColl = firestore.collection("users")
  // if the user is not using a referral link
  if (!albumId) {
    console.log("User is not part of an album ", albumId)
    // if there is not inv link then just create photo normally and set it to part of the user profile in db
    res.status(200).json({ message: "User did not select an album", images: [] })
    // else if the user signs in with an inviation/referral link
  } else {
    console.log("User clicked on an album before coming to Photos component ", albumId)
    // get photos from the album id and albums collection
    firestore.collection("albums").doc(albumId).get()
      .then(snap => {
        return new Promise((resolve, reject) => {
          snap.data().photos.forEach(photo => {
            firestore.collection("photos").doc(photo.photoId).get()
            .then(snap => {
              userColl.doc(snap.data().creator).get()
              .then(creator => {
                let imageObj = {
                  _id: photo.photoId,
                  image: snap.data().image,
                  creator: creator.data().name
                }
                imageArray.push(imageObj)
                resolve(imageArray)
              })
              .catch(err => console.log("Cannot get the user object from db ", err))
            })
            .catch(err => console.log("cannot get the photo collection ", err))
          })
        })
        .then(imageArr => {
          res.status(200).json({ message: "Image array fetched", images: imageArr })
        })
        .catch(err => console.log("Cannot resolve the promise and get the array of photos ", err))
      })
      .catch(err => console.log("Cannot get the albums from the db ", err))
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
            console.log("CANNOT STORE PHOTO, NO ALBUM ID")
            // the picture does get taken and stored in db, but since album is found to store it to
            // I delete it both from the photos collection and the photos array in user coll
            firestore.collection("photos").doc(image.id).delete();
            userObjectFromDb.update({ photos: firebase.firestore.FieldValue.arrayRemove(image.id) })

            res.status(200).json({ message: "Photo cannot be inserted because no album was selected" })
          } else {
            console.log("STORE PHOTO ALBUM ID FOUND: ", albumId)
            firestore.collection("albums").doc(albumId).update({
              // only storing the ref to the photo
              photos: firebase.firestore.FieldValue.arrayUnion({ photoId: image.id })
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
