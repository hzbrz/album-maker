const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const firebase = require("firebase");
const cors = require("cors");

// express app
const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyA1xuAemcildff2sBobHd6sqZaDVUHkgXQ",
  authDomain: "wedding-app-248623.firebaseapp.com",
  databaseURL: "https://wedding-app-248623.firebaseio.com",
  projectId: "wedding-app-248623",
  storageBucket: "wedding-app-248623.appspot.com",
  messagingSenderId: "851647299055",
  appId: "1:851647299055:web:f367ab0c39724568"
};

firebase.initializeApp(firebaseConfig);

app.use(bodyParser.json({ limit: "5mb" }))

app.use(morgan("dev"))

app.use(cors())

// // adding a general middleware to add headers that prevent from causing a CORS error which is irrelevant while creating APIs
// app.use((req, res, next) => {
//   // EVERY RES SENT WILL NOW HAVE THESE HEADERS BELOW 
  
//   // header to let know which domain can access our server, for this we are letting all servers with * wildcard
//   res.setHeader('Access-Control-Allow-Origin', "*")
  
//   // letting the client know which http methods are allowed
//   res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE")

//   // which headers the client can set, this lets the client send in the content-type and authorization headers which 
//   // are useful for requesting data to the server and API, also some default headers get passed in
//   res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authorization")
  
//   // moving on to the next middleware
//   next();
// })


app.use("/auth", authRoutes);
app.use("/album", photoRoutes);
app.use("/setting", userRoutes);

let server = app.listen(process.env.PORT || 8080, function () {
  let port = server.address().port;
  console.log("App now running on port", port);
});