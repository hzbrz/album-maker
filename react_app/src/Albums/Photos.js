import React, { Component } from 'react';
import * as firebase from "firebase";

class Photos extends Component {

  ulStyle = {
    listStyleType: "none",
  }

  imgStyle = {
    width: "240px",
  }

  liStyle = {
    display: 'inline',
    marginRight: "10px",
    paddingnBottom: "90px",
  }

  state = {
    isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
    token: localStorage.getItem("token"),
    images: []
  }


  componentDidMount = () => {
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
        this.setState({ images: resData.images })
      })
      .catch(err => console.log(err))
  }

  deletePost = (photoId) => {
    fetch("http://localhost:8080/album/photo/" + photoId, {
      method: "DELETE",
      headers: {
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
        console.log("Photo deleted ", resData)
        let photoStorageref = firebase.storage().ref(resData.path);
        photoStorageref.delete()
          .then(result => {
            console.log("PHOTO DELETED FROM STORAGE ".toLowerCase())
          })
          .catch(err => console.log("ERROR WHILE DELETING FROM STORAGE ", err))
      })
      .catch(err => console.log("ERROR while deleting data ", err))
  }

  // function to go to another page and redirect
  nextPath = (path) => {
    this.props.history.push(path);
  }

  ifNotLoggedInGoBack = () => {
    this.nextPath("/photo")
  }

  render() {
    return (
      <div>
        <h1>This is the photos page</h1>&nbsp; <button onClick={this.ifNotLoggedInGoBack}>Take a photo?</button>
        <div style={this.imageContainer}>
          <ul style={this.ulStyle}>
            {this.state.images.map((item) => (
              <li style={this.liStyle} key={item._id}>
                <img style={this.imgStyle} src={item.image} alt="user" />
                <button onClick={this.deletePost.bind(this, item._id)}>Delete photo</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Photos;