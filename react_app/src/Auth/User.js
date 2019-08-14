import React, { Component } from "react";
import * as firebase from "firebase";
import { withRouter } from "react-router-dom";


class User extends Component {

  photoStyle = {
    width: "120px",
    height: "120px"
  }

  state = {
    // JSON.parse turns it into a JS object, localstorage only stores as strings
    // JSON.stringify is used to store arrays and objects and parse to parse
    isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    user: {
      name: "",
      profilePic: "",
      emai: ""
    }
  }

  // sending fetch post req for user profile information from api
  componentDidMount() {
    console.log("TRYING TO FETCH USER")
    fetch("http://localhost:8080/auth/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.state.token}`
      }
    })
      .then(res => {
        if (res.status !== 200) {
          console.error("could not fetch the user");
        }

        return res.json()
      })
      .then(resData => {
        console.log("User data: ", resData);
        this.setState({
          name: resData.name,
          profilePic: resData.profilePic,
          email: resData.email
        })
      })
      .catch(err => console.log(err))
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
        <h1>This is the User Profile page</h1>
        <br />
        <img style={this.photoStyle} src={this.state.profilePic} alt="User's profile" />
        <p>Email: {this.state.email}</p>
        <p>Welcome {this.state.name}! Do you want to signout?</p>
        <button onClick={this.logout}>Sign-out</button>
      </div>
    );
  }
}

export default withRouter(User);