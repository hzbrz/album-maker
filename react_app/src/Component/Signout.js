import React, { Component } from 'react';
import * as firebase from 'firebase';

class Signout extends Component {
  
  signoutContainer = {
    float: "right",
    marginRight: "20px"
  }

  logout = () => {
    firebase.auth().signOut()
    localStorage.setItem("isSignedIn", false)
    console.log("Signed out")
    this.props.push("/")
  }

  render() {
    return (
      <div style={this.signoutContainer}>
        <button onClick={this.logout}>Sign-out</button>
      </div>
    )
  }
}

export default Signout;