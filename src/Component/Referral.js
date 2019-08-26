import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Referral extends Component {
  // TODO: Need to redirect based on logged in status otherwise the albumId comes up as an empty string and 
  // the user can never get to an album if they are already logged in
  render() {
    return (
      <Redirect to={
        { pathname: "/", state: { albumId: this.props.location.pathname } }
      } />
    );
  }
}

export default Referral;