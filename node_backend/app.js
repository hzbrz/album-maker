const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const { firebase_config } = require("./secrets");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const firebase = require("firebase");

// express app
const app = express();

firebase.initializeApp(firebase_config);

app.use(bodyParser.json())

app.use(morgan("dev"))

// adding a general middleware to add headers that prevent from causing a CORS error which is irrelevant while creating APIs
app.use((req, res, next) => {
  // EVERY RES SENT WILL NOW HAVE THESE HEADERS BELOW 
  
  // header to let know which domain can access our server, for this we are letting all servers with * wildcard
  res.setHeader('Access-Control-Allow-Origin', "*")
  
  // letting the client know which http methods are allowed
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE")

  // which headers the client can set, this lets the client send in the content-type and authorization headers which 
  // are useful for requesting data to the server and API, also some default headers get passed in
  res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authorization")
  
  // moving on to the next middleware
  next();
})

app.use("/auth", authRoutes);
app.use("/album", photoRoutes)

const port = 8080;

app.listen(port, () => {
  console.log("app is listening on port " + port)
});