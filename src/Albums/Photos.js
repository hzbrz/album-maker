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

  constructor(props) {
    super(props)
    // need this to set the initial state based on if the user clicked on an album to get to this component
    if (typeof props.location.state == "undefined") {
      this.state = {
        isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
        token: localStorage.getItem("token"),
        images: [],
        albumId: null,
        loading: true
      }
    } else {
      this.state = {
        isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false,
        token: localStorage.getItem("token"),
        images: [],
        albumId: props.location.state.albumId,
        loading: true
      }
    }
  }

  // TODO: for data fetching optimization I can add a caching that checks for an increase in the number of images 
  // and only fetches photos if there is an increase, this can also be done by comparing timestamps in the db/api
  componentDidMount = () => {
    this.getPhotos();
  }

  getPhotos = () => {
    fetch("https://album-api-hz.herokuapp.com/album/photos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
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
        console.log(resData);
        // set state to the images arr or empty arr if there is no array in the albums coll
        this.setState({ images: resData.images || [], loading: false })
      })
      .catch(err => console.log(err))
  }

  deletePost = (photoId, albumId, userId) => {
    fetch("https://album-api-hz.herokuapp.com/album/photo/" + photoId + "/" + albumId + "/" + userId, {
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
        console.log(resData)
        if (!resData.path) {
          console.log("User did not create photo")
        } else {
          let photoStorageref = firebase.storage().ref(resData.path);
          photoStorageref.delete()
            .then(result => {
              console.log("PHOTO DELETED FROM STORAGE ".toLowerCase())
            })
            .catch(err => console.log("ERROR WHILE DELETING FROM STORAGE ", err))
        }
      })
      .catch(err => console.log("ERROR while deleting data ", err))
  }

  takePhoto = () => {
    this.props.history.push("/photo", {
      albumId: this.state.albumId
    })
  }

  goToAlbums = () => {
    this.props.history.push("/albums");
  }

  render() {
    if (!this.state.albumId) {
      return (
        <div>
          <h4>Please select an album</h4>
          <button onClick={this.goToAlbums}>Go to Albums Page</button>
        </div>
      )
    }
    return (
      <div>
        <h1>This is the photos page</h1>&nbsp; <button onClick={this.takePhoto}>Take a photo?</button>
        {this.state.loading ? <h3>Loading....</h3> :
          <div style={this.imageContainer}>
            <ul style={this.ulStyle}>
              {this.state.images.map((item) => (
                <li style={this.liStyle} key={item._id}>
                  <img style={this.imgStyle} src={item.image} alt={item.creator} />
                  <button onClick={this.deletePost.bind(this, item._id, this.state.albumId, item.userId)}>Delete photo</button>
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default Photos;