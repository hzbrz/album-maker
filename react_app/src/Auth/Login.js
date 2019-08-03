import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import { google } from "../secrets";

class Login extends Component {

  responseGoogle = (response) => {
    console.log("response from Google Login", response);
    // let token = response.Zi.id_token.trim()
    let email = response.profileObj.email
    let firstName = response.profileObj.givenName
    let lastName = response.profileObj.familyName
    // profile image from google dim 96x96px
    let profile_image = response.profileObj.imageUrl
    let profile_name = response.profileObj.name
  }

  // logout = () => { 
  //   console.log("Logout clicked")
  // }

  render() {
    return (
      <div>
        <GoogleLogin
          clientId={google.google_client_id}
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        />
        <br/>

    {/* <GoogleLogout
          clientId={google.google_client_id}
          buttonText="Logout"
          onLogoutSuccess={this.logout}
        ></GoogleLogout> */}
      </div>
        );
      }
    }
    
export default Login;