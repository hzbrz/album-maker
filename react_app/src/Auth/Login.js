import React, { Component } from "react";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from 'firebase';
import { firebase_config } from "../secrets";

firebase.initializeApp(firebase_config);

class Login extends Component {
  state = {
    isSignedIn: false // Local signed-in state.
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
        console.log(authResult);
        return false;
      }
    }
  };

  componentDidMount() {
    // using the onAuthStateChanged observer to manage user and managing state
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      // listening to the firebase Auth state and setting the local state 
      (user) => {
        if (user) {
          // setting state based on firebase auth state
          this.setState({ isSignedIn: true })
        } else {
          this.setState({ isSignedIn: false })
        }
      });
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    // if the user is not signed in or false then show the login page else show the signout button
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>Album creator</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiCallback={ui => console.log(ui)} uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </div>
      );
    }
    return (
      <div>
        <h1>Album creator</h1>
        <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
        <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
      </div>
    );
  }
}

export default Login;