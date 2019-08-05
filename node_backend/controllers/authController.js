const firebase = require("firebase");
const jwt = require("jsonwebtoken");
const jwt_secret = require("../secrets").jwt.secret;

exports.getUser = (req, res, next) => {
  // vars to store pulled things from db
  let email, image, name;
  // user id that I get from the is-auth middleware
  userId = req.userId;
  let firestore = firebase.firestore();
  // this is the user that is located in that id 
  let userObjectFromDb = firestore.doc("users/" + userId)
  userObjectFromDb.get()
    .then(userDoc => {
      // getting and storing the user's info from db to send to client
      email = userDoc.data().email;
      image = userDoc.data().profileImage;
      name = userDoc.data().name
      res.status(200).json({ message: "user gotten", email: email, name: name, profilePic: image })
    })
    .catch(err => console.log("Could not get the user from db"))
}

// this function is going to take the data from social login (google login) then use that to sign the user into the api/server
// using jwt in order to make the user have authentication with the program itself
exports.login = (req, res, next) => {
  const email = req.body.email
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const profile_pic = req.body.profile_image
  // const username = req.body.profile_name

  // using firestore to find the user with email math and if not found then user gets created
  let firestore = firebase.firestore();
  let usersCollection = firestore.collection("users")

  // this is the var that will store the token
  let token;
  // query where the user's email match
  let query = usersCollection.where("email", "==", email).get()
    .then(userDoc => {
      // if no matching users are found
      if (userDoc.empty) {
        console.log("No matching user found")
        // create the user in users collection in firestore
        firestore.collection("users").add({
          email: email,
          name: firstName + " " + lastName,
          profileImage: profile_pic
        })
          // returned promise has the user object that I can use
          .then(userRef => {
            console.log("User created")
            userRef.get()
              .then(snap => {
                // creating the JWT token so I can pass it to client
                token = jwt.sign({
                  email: snap.data().email,
                  userId: snap.id
                }, jwt_secret, { expiresIn: "10h" })
                // sending the token and userId to the client after user gets created
                res.status(201).json({ message: "User created", userId: userRef.id, token: token })
              })
              .catch(err => console.log("Could not get data for token ", err))
          })
          .catch(error => console.log("error while creating user in db ", error))
      }
      // otherwise if user is found then get the user data and send it to client along with JWT 
      else {
        // storing the id in this var so I have scope outside of forEach
        let id;
        console.log("User found")
        userDoc.forEach(snap => {
          id = snap.id
          // creating JWT token
          token = jwt.sign({
            email: snap.data().email,
            userId: snap.id
          }, jwt_secret, { expiresIn: "1h" })
        })
        // sending the token and userId to the client after user gets found
        res.status(200).json({ message: "User found", userId: id, token: token })
      }
    })
    .catch(err => console.log("Error getting documents ", err))
} 