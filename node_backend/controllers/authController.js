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
  const username = req.body.profile_name

  let loadedUser;

}