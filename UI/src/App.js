import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './splitter-logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Grid>
          <Row className="show-grid">
            <Col sm={10} md={8} smOffset={1} mdOffset={2}>
              <Purchase time="5hrs ago" business="Playa Bowls" price="$20.62" />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function Purchase(props) {
  return (
    <div className="Purchase">
      <Row>
        <div className="col-md-12">
          <p className="pull-left">
            <div className="caption">{props.time}</div>
            <h1 className="h1">{props.business}</h1>
            <div className="price">{props.price}</div>
          </p>
          <button className="pull-right"></button>
        </div>
      </Row>
    </div>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

export default App;