import React, { Component } from 'react';

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
              <li style={this.liStyle} key={item}><img style={this.imgStyle} src={item} alt="user" /></li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Photos;