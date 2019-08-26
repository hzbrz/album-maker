import React, { Component } from 'react';

class Albums extends Component {

  ulStyle = {
    listStyleType: "none",
  }

  liStyle = {
    display: 'inline',
    marginRight: "10px",
    paddingnBottom: "90px",
  }

  state = {
    token: localStorage.getItem("token"),
    albums: [],
    isSignedIn: JSON.parse(localStorage.getItem("isSignedIn")) || false
  }

  componentDidMount = () => {
    // if signed in fetch the album if not dont even do anything
    if (this.state.isSignedIn) {
      fetch("http://localhost:8080/album/albums", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.state.token}`
        }
      })
        .then(res => {
          if (res.status !== 200) {
            console.error("could not fetch the user's albums");
          }

          return res.json()
        })
        .then(resData => {
          console.log("Albums fetched ", resData);
          this.setState({ albums: resData.albums })
        })
        .catch(err => console.log(err))
    } else {
      console.log("Cannot get albums, user not signed in")
    }
  }

  ifNotLoggedInGoBack = () => {
    this.props.history.push("/");
  }

  goToPhotos = (albumId) => {
    this.props.history.push("/photos", {
      albumId: albumId
    })
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
        <div style={this.imageContainer}>
          <ul style={this.ulStyle}>
            {this.state.albums.map((album) => (
              <li style={this.liStyle} key={album.id}>
                <button onClick={this.goToPhotos.bind(this, album.id)}>{album.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Albums;