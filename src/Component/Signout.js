import React, { Component } from 'react';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';

class Signout extends Component {
  
  signoutContainer = {
    float: "right",
    marginRight: "20px"
  }

  logout = () => {
    console.log(this.props)
    firebase.auth().signOut()
    localStorage.setItem("isSignedIn", false)
    console.log("Signed out")
    this.props.history.push("/")
  }

  render() {
    return (
      <div style={this.signoutContainer}>
        <button onClick={this.logout}>Sign-out</button>
      </div>
    )
  }
}

export default withRouter(Signout);