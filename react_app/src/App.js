import React from 'react';
import './App.css';
import Login from "./Auth/Login";
import Photo from "./Albums/Photo";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as firebase from 'firebase';
import { firebaseConfig } from "./secrets";

firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={Login} /> {/* app = home */}
        <Route path='/photos' component={Photo} />
      </div>
    </Router>
  );
}

export default App;
