const firebase = require("firebase");
const imageDataUri = require("image-data-uri");
const fileUrl = require("file-url");
// const admin = require("firebase-admin");
// const bucket = require("../secrets").bucket;
// const serviceAccount = require("C:\\Users\\wazih\\Desktop\\courses\\keys\\wedding_serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: bucket
// });

exports.getUserPhotos = (req, res, next) => {
  userId = req.userId;
  let firestore = firebase.firestore();
  let photocollection = firestore.collection('photos')
  let userObjectFromDb = firestore.doc("users/" + userId);
  userObjectFromDb.get()
    .then(snap => {
      // creating my promise which gets resolved once the array full of images is created
      return new Promise((resolve, reject) => {
        // client var
        let imageArray = [];
        snap.data().photos.forEach(photoId => {
          photocollection.doc(photoId).get()
            .then(snap => {
              imageArray.push(snap.data().image)
              resolve(imageArray);
            })
            .catch(err => reject("could not get the photo from db ", err))
        })
        // I handle the resolved array that is returned by the promise and sent it as res to the client
      }).then(imageArr => {
        res.status(200).json({ message: "User photos fetched", images: imageArr })
      })
    })
    .catch(err => console.log("Could not find user ", err))
}

exports.storePhoto = (req, res, next) => {
  const dataUri = req.body.imageUrl;
  let path = ""
  let filePath = 'C:\\Users\\wazih\\Desktop\\courses\\Wedding\\react_app\\public\\images\\filename.png';

  return new Promise((resolve, reject) => {
    imageDataUri.outputFile(dataUri, filePath)
    .then(path => {
      console.log(path)
      resolve(path)
    })
    .catch(err => console.log(err))
  }).then(data => {
    res.status(200).json({
      message: "photo stored",
      path: data
    })
  })


  // let userId = req.userId
  // let firestore = firebase.firestore();
  // let userObjectFromDb = firestore.doc("users/" + userId);
  // let photocollection = firestore.collection("photos").add({
  //   image: buffer,
  //   creator: userId
  // })
  //   .then(photoRef => {
  //     console.log("Photo created")
  //     userObjectFromDb.update({ photos: firebase.firestore.FieldValue.arrayUnion(photoRef.id) })

  //     // getting references to send the response to the client
  //     photoRef.get()
  //       .then(snap => {
  //         // TODO: store image as blob then store in db and then get photo from db to client
  //         return snap.data().image
  //       })
  //       // promise handling the image that was returned
  //       .then(image => {
  //         userObjectFromDb.get()
  //           .then(snap => {
  //             res.status(200).json({
  //               message: "Photo inserted",
  //               photoUrl: image,
  //               creator: { _id: snap.id, name: snap.data().name }
  //             })
  //           })
  //           .catch(err => console.log("could not get user object from db ", err))
  //       })
  //       .catch(err => console.log("no image is found ", err))
  //   })
  //   .catch(err => console.log("ERROR while storing the photo ", err))
  next()
}