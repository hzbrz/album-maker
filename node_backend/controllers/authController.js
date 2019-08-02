exports.getUser = (req, res) => {
  res.send("Login page")
}

// this function is going to take the data from social login (google login) then use that to sign the user into the api/server
// using jwt in order to make the user have authentication with the program itself
exports.login = (req, res) => {
  
}