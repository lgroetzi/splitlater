import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Col, Row } from 'react-bootstrap';

import Purchase from '../components/purchase.js';

class Home extends Component {
  render() {
    return (
      <div className="Home">
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

export default Home