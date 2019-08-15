const firebase = require("firebase");

// const admin = require("firebase-admin");
// const bucket = require("../secrets").bucket;
// const serviceAccount = require("C:\\Users\\wazih\\Desktop\\courses\\keys\\wedding_serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: bucket
// });


exports.getUserPhotos = (req, res, next) => {
  let userId = req.userId;
  let imageArray = [];
  let firestore = firebase.firestore();
  firestore.collection('photos').where("creator", "==", userId).get()
    .then(snap => {
      snap.forEach(image => {
        return new Promise((resolve, reject) => {
          imageArray.push(image.data().image)
          resolve(imageArray);
        }) 
        .then(imageArr => {
          console.log(imageArr)
          res.status(200).json({ message: "User photos fetched", images: imageArr })
        })
        .catch(err => console.log("ERROR cant find pictures ", err))
      })
    })
    .catch(err => console.log("ERROR while getting photos ", err))
}

exports.storePhoto = (req, res, next) => {
  const imageUrl = req.body.imageUrl;
  let userId = req.userId
  let firestore = firebase.firestore();
  let userObjectFromDb = firestore.doc("users/" + userId);
  firestore.collection("photos").add({
    image: imageUrl,
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