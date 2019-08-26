import React from 'react';
import './App.css';
import Login from "./Auth/Login";
import User from "./Auth/User";
import Photo from "./Albums/Photo";
import Photos from "./Albums/Photos";
import Albums from "./Albums/Albums";
import Referral from "./Component/Referral";
import Navbar from './Component/Navbar';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import { firebaseConfig } from "./secrets";

firebase.initializeApp(firebaseConfig);

const App = (props) => {
  return (
    <Router>
      <div className="App">
        {/* passing the push prop to the navbar so I can then pass it on to signout for use */}
        <Navbar push={props.history.push}/>
        <Switch>
          <Route exact path='/' component={Login} /> {/* app = home */}
          <Route path='/user' component={User} />
          <Route path='/photo' component={Photo} />
          <Route path='/photos' component={Photos} />
          <Route path='/albums' component={Albums} />
          <Route component={Referral} />
        </Switch>
      </div>
    </Router>
  );
}

// I had to use withRouter to get the rputer props such as push and etc so I can pass it down to the Signout component
export default withRouter(App);
