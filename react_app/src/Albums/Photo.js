import React, { Component } from 'react';
import * as firebase from "firebase";

class Photo extends Component {

  state = {
    // JSON.parse turns it into a JS object, localstorage only stores as strings
    // JSON.stringify is used to store arrays and objects and parse to parse
    isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
    token: localStorage.getItem("token"),
    formControls: {
      image: {
        value: ""
      }
    }
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

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      formControls: {
        ...this.state.formControls,
        [name]: {
          ...this.state.formControls[name],
          value
        }
      }
    });
  }

  uploadPhotos = () => {
    fetch("http://localhost:8080/album/photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.state.token}`
      },
      // this is the request body that will be passed into the server 
      body: JSON.stringify({
        imageUrl: this.state.formControls.image.value,
      })
    })
      .then(res => {
        if (res.status !== 200) {
          console.error("could not fetch the photos");
        }

        return res.json()
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(err => console.log(err))
  }

  getPhotos = () => {
    fetch("http://localhost:8080/album/photos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.state.token}`
      }
    })
      .then(res => {
        if (res.status !== 200) {
          console.error("could not fetch the photos");
        }

        return res.json()
      })
      .then(resData => {
        console.log(resData);
      })
      .catch(err => console.log(err))
  }
  
  render() {
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
        <h1>This is the Photos page</h1>
        <br />
        <form>
          <input
            type="imageUrl"
            name="image"
            value={this.state.formControls.image.value}
            onChange={this.changeHandler}
            placeholder={"Enter your image url"}
          />
        </ form>
        <button onClick={this.uploadPhotos}>Upload photo</button>
        &nbsp; <button onClick={this.getPhotos}>Get photos</button>
        <p> Do you want to signout?</p>
        <button onClick={this.logout}>Sign-out</button>
      </div>
    );
  }
}

export default Photo;