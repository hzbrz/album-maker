const firebase = require("firebase");

exports.getUser = (req, res) => {
  res.send("Login page")
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
  // TODO - create JWT and use it to auth and send JWT to client and auth using that is-auth
  let firestore = firebase.firestore();
  let usersCollection = firestore.collection("users")
  // query where the user's email match
  let query = usersCollection.where("email", "==", email).get()
    .then(userDoc => {
      // if no matching users are found
      if (userDoc.empty) {
        console.log("No matching user found")
        // create the user in users collection in firestore
        firestore.collection("users").add({
          email: email,
          name: firstName + lastName,
          profileImage: profile_pic
        })
          // returned promise has the user object that I can use
          .then(userRef => {
            console.log("User created")
            console.log(userRef.id)
            userRef.onSnapshot(snap => console.log(snap.data(), snap.id))
            res.status(201).json({ message: "User created", userId: userRef.id })
          })
          .catch(error => console.log("error while creating user in db ", error))
      } else {
        // otherwise if user is found then get the user data and send it to client along with JWT
        console.log("User found")
        userDoc.forEach(snap => {
          console.log(snap.id, "=> ", snap.data())
          res.status(200).json({ message: "User found", userId: snap.id })
        }) 
      }
    })
    .catch(err => console.log("Error getting documents ", err))
} 