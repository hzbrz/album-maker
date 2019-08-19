import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Referral extends Component {

  render() {
    return (
      <Redirect to={
        { pathname: "/", state: { albumId: this.props.location.pathname } }
      } />
    );
  }
}

export default Referral;