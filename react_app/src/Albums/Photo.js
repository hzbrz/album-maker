import React, { Component } from 'react';
import * as firebase from "firebase";
import Camera from 'react-html5-camera-photo';
import "react-html5-camera-photo/build/css/index.css";

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

  uploadPhotos = (dataUri) => {
    let dataString = dataUri.split(',')[1]
    let path = dataString.slice(200, 220).split("/")[0] + "thistoday"
    let byteString = atob(dataString);
    console.log(path)

    let storageRef = firebase.storage().ref("images/" + path)
    // separate out the mime component
    let mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let imageStream = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      imageStream[i] = byteString.charCodeAt(i);
    }

    let dataView = new DataView(arrayBuffer);
    let blob = new Blob([dataView], { type: mimeString });
    storageRef.put(blob)
      .then(snap => {
        console.log("photo stored", snap)
      })
      .catch(err => console.log("ERROR while uploading photo ", err))
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
        <Camera
          onTakePhoto={(dataUri) => { this.uploadPhotos(dataUri); }}
        />
        &nbsp; <button onClick={this.getPhotos}>Get photos</button>
        <p> Do you want to signout?</p>
        <button onClick={this.logout}>Sign-out</button>
      </div>
    );
  }
}

export default Photo;