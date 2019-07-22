// this is the empty shell for the express app

const express = require("express");
const morgan = require("morgan")

const app = express()

app.use(morgan("dev"))

app.get("/", (req, res) => {
  res.send("learning how to hello REST API with js")
})

const port = 8080;

app.listen(port, () => {
  console.log("app is listening on port " + port)
});