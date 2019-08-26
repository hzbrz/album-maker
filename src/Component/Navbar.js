import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Signout from './Signout';

class Navabar extends Component {


  ulStyle = {
    listStyleType: "none",
  }

  liStyle = {
    display: 'inline',
    marginRight: "10px",
    paddingnBottom: "90px",
  }

  render() {
    return (
        <div>
          <ul style={this.ulStyle}>
            <li style={this.liStyle}>
              <Link to="/albums">Albums</Link>
            </li>
            <li style={this.liStyle}>
              <Link to="/user">User</Link>
            </li>
            <li style={this.liStyle}>
              <Signout push={this.props.push}/>
            </li>
          </ul>

          <hr />
        </div>
    )
  }
}

export default Navabar;