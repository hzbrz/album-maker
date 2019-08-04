import React, { Component } from "react";
import * as firebase from "firebase";
import { withRouter } from "react-router-dom";


class Photo extends Component {
  state = {
    // JSON.parse turns it into a JS object, localstorage only stores as strings
    // JSON.stringify is used to store arrays and objects and parse to parse
    isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
    token: localStorage.getItem("token")
  }

  // function to go to another page and redirect
  nextPath = (path) => {
    this.props.history.push(path);
  }

  logout = () => {
    firebase.auth().signOut()
    localStorage.setItem("isSignedIn", false)
    console.log("Signed out")
    this.nextPath("/")
  }

  ifNotLoggedInGoBack = () => {
    this.nextPath("/")
  }

  render() {
    // console.log(typeof this.state.isSignedIn)
    if (this.state.isSignedIn === false) {
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
        <h1>This is the photo page</h1>
        <br />
        <p>Welcome! Do you want to signout</p>
        <p>{this.state.token}</p>
        <button onClick={this.logout}>Sign-out</button>
      </div>
    );
  }
}

export default withRouter(Photo);