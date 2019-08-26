import React, { Component } from 'react';
import * as firebase from "firebase";
import Camera from 'react-html5-camera-photo';
import "react-html5-camera-photo/build/css/index.css";

class Photo extends Component {

  state = {
    // JSON.parse turns it into a JS object, localstorage only stores as strings
    // JSON.stringify is used to store arrays and objects and parse to parse
    isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
    userId: localStorage.getItem("userId"),
    token: localStorage.getItem("token"),
    photoInserted: true,
    formControls: {
      image: {
        value: ""
      }
    },
    albumId: null
  }

  componentDidMount() {
    // this is used to check if the user has specified an album
    if (typeof this.props.location.state == "undefined") {
      this.setState({ albumId: null })
    } else {
      this.setState({ albumId: this.props.location.state.albumId })
    }
  }

  logout = () => {
    firebase.auth().signOut()
    localStorage.setItem("isSignedIn", false)
    console.log("Signed out")
    this.props.history.push("/")
  }

  ifNotLoggedInGoBack = () => {
    this.props.history.push("/")
  }

  goToPhotosFeed = () => {
    this.props.history.push("/photos", { albumId: this.state.albumId });
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
    this.setState({ photoInserted: false })
    let dataString = dataUri.split(',')[1]
    // let path = dataString.slice(200, 220).split("/")[0] + "thistoday";
    let date = new Date().toJSON().slice(0, 10)
    let ms = Date.now();
    let byteString = atob(dataString);

    // this is the storage reference path
    let storageRef = firebase.storage().ref(this.state.userId + "/image@ " + date + ms);
    // this is the mime from the dataUri
    // let mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    let mimeString = "image/jpg"

    // write the bytes of the string to an ArrayBuffer
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let imageStream = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      imageStream[i] = byteString.charCodeAt(i);
    }
    // create a new dataview with the arraybuffer to create the blob
    let dataView = new DataView(arrayBuffer);
    // create blob and store in firebase storage
    let blob = new Blob([dataView], { type: mimeString });
    // using the put method to store the blob depending if there is an album specified to store the pic
    if (!this.state.albumId) {
      // if no album is specified then the photo is never stored
      console.log("Photo cannot be inserted, because no album specified")
      this.setState({ photoInserted: true })
    } else {
      // album was specified store in storage and in db
      storageRef.put(blob)
        .then(snap => {
          // getting the downloadUrl from the storage after storing
          snap.ref.getDownloadURL().then(url => {
            console.log("File available at: ", url)
            // sending a post request with the download URL so I can store in db from API
            fetch("http://localhost:8080/album/photo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.state.token}`
              },
              // this is the request body that will be passed into the server 
              body: JSON.stringify({
                imageUrl: url,
                filepath: snap.metadata.fullPath,
                albumId: this.state.albumId
              })
            })
              .then(res => {
                if (res.status !== 200) {
                  console.error("could not fetch the photos");
                }

                return res.json()
              })
              .then(resData => {
                console.log("Photo inserted ", resData);
                this.setState({ photoInserted: true })
              })
              .catch(err => console.log(err))
          })
        })
        .catch(err => console.log("ERROR while uploading photo ", err))
    }
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
        <h1>Take a Photo</h1>
        {this.state.photoInserted ? <button onClick={this.goToPhotosFeed}>Go to Feed</button> : <h4>Loading...</h4>}
        <div>
          <br />
          <Camera
            onTakePhoto={(dataUri) => { this.uploadPhotos(dataUri); }}
          />
          {/* <p> Do you want to signout?</p>
          <button onClick={this.logout}>Sign-out</button> */}
        </div>
      </div>
    );
  }
}

export default Photo;