import React, { Component } from 'react';
import logo from './splitter-logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="cell">
          <div className="caption">
            5hr ago
          </div>
          <h1 className="h1">Playa Bowls</h1>
          <div className="price">
            $20.19
          </div>
        </div>
      </div>
    );
  }
}

export default App;
