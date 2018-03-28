import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Col, Row } from 'react-bootstrap';

class Plaid extends Component {
  render() {
    return (
      <Grid className="onboarding">
        <Row className="show-grid">
        	<Col sm={10} md={4} smOffset={1} mdOffset={4}>
	      		<h1 className="h1">Link your bank account</h1>
				<button href="#">Link Now</button>
		  	</Col>
		</Row>
      </Grid>
    );
  }
}

export default Plaid