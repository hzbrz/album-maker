import React from 'react';
import './App.css';
import Login from "./Auth/Login";
import User from "./Auth/User";
import Photo from "./Albums/Photo";
import Photos from "./Albums/Photos";
import Referral from "./Component/Referral";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase';
import { firebaseConfig } from "./secrets";

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path='/' component={Login} /> {/* app = home */}
          <Route path='/user' component={User} />
          <Route path='/photo' component={Photo} />
          <Route path='/photos' component={Photos} />
          <Route component={Referral} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
