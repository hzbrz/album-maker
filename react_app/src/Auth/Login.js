import React, { Component } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from "firebase";
import { Redirect } from "react-router-dom";

class Login extends Component {

  state = {
    isSignedIn: false, // Local signed-in state.
    token: ""
  };

  // firebaseUI config 
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // signInSuccessUrl: 'http://localhost:3000',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // this is the callback that runs after login and gives me the user object
      signInSuccessWithAuthResult: (authResult) => {
        // let token = authResult.credential.idToken.trim()
        // send request to API with the body after login
        fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          // this is the request body that will be passed into the server 
          body: JSON.stringify({
            email: authResult.additionalUserInfo.profile.email,
            firstName: authResult.additionalUserInfo.profile.given_name,
            lastName: authResult.additionalUserInfo.profile.family_name,
            profile_image: authResult.additionalUserInfo.profile.picture,
            profile_name: authResult.additionalUserInfo.profile.name
          })
        })
          .then(res => {
            if (res.status === 422) {
              throw new Error("Validation failed.");
            }
            if (res.status !== 200 && res.status !== 201) {
              console.log('Error!');
              throw new Error('Creating a user failed!');
            }
            return res.json();
          })
          .then(resData => {
            console.log("login page", resData)
            // setting the token to state to pass into photos component
            this.setState({ isSignedIn: true, token: resData.token });
          })
          .catch(err => {
            console.log(err)
            this.setState({ isSignedIn: false });
          })
      }
    }
  };


  render() {
    // if the user is not signed in or false then show the login page else show the signout button
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>Album creator</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    }
    return (
      <Redirect to={
        // passing the token to the photos page through the react-router props
        { pathname: "/photos", state: { token: this.state.token } }
      } />
    );
  }
}

export default Login;