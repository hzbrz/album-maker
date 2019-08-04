import React, { Component } from "react";
import * as firebase from "firebase";
import { withRouter, Redirect } from "react-router-dom";


class Photo extends Component {

  ulStyle = {
    listStyleType: "none",
  }

  _isMounted = false;

  state = {
    isSignedIn: false,
    token: null
  }

  componentDidMount() {
    this._isMounted = true;
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


  nextPath = (path) => {
    this.props.history.push(path);
  }

  logout = () => {
    firebase.auth().signOut()
    console.log("Signed out")
    this.nextPath("/")
  }

  ifNotLoggedInGoBack = () => {
    this.nextPath("/")
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
    this._isMounted = false;
  }

  render() {
    try {
      let token = this.props.location.state.token;
    } catch {
      return (
        <div>
          <h1>This is the photo page</h1>
          <br />
          <p>Please login agian an error occured</p>
          <button onClick={this.logout}>Sign-out</button>
        </div>
      );
    }

    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>Album creator</h1>
          <p>You are not logged in</p>
          <button onClick={this.ifNotLoggedInGoBack}>Go back?</button>
        </div>
      );
    }
    return (
      <div>
        <ul style={this.ulStyle}>
          <li><button onClick={this.logout}>Sign-out</button></li>
        </ul>
        <h1>This is the photo page</h1>
        <br />
        <p>Welcome {firebase.auth().currentUser.displayName} ! Do you want to signout</p>
      </div>
    );
  }
}

export default withRouter(Photo);