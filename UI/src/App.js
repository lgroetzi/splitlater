import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './splitter-logo.svg';
import './App.css';
import './grid.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Purchase time="5hrs ago" business="Playa Bowls" price="$20.62" />
      </div>
    );
  }
}

function Purchase(props) {
  return (
    <div className="Purchase">
      <p>
        <div className="caption">{props.time}</div>
        <h1 className="h1">{props.business}</h1>
        <div className="price">{props.price}</div>
      </p>
      <button></button>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

export default App;