import React from 'react';
import './App.css';
import Login from "./Auth/Login";
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path='/' component={Login} /> {/* app = home */}
        {/* <Route path='/login' component={Login} /> */}
        {/* <Route path='/photos' component={Photo} /> */}
      </div>
    </Router>
  );
}

export default App;
