const jwt = require("jsonwebtoken");
const jwt_secret = require("../secrets").jwt.secret;

// this middleware is to check if the user has a valid token before they can access the app and server logic/db
module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1].trim();
  let decodedToken;

  // trying to decode the token to verify with the server that the user is legit
  try{
    decodedToken = jwt.verify(token, jwt_secret);
  } catch(err) {
    console.log("Token did not verify ", err)
  }
  // if still the token is undefined then send a 400 to client 
  if(!decodedToken) {
    res.status(400).json({ message: "Not Authenticated, token not found." })
  }
  // storing the userId from db that we passed into the token while signing into the request so I can access later
  req.userId = decodedToken.userId;
  req.albumId = decodedToken.albumId;

  // moving onto next middleware
  next();
}