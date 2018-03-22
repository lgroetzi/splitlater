import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Col, Row } from 'react-bootstrap';

class Login extends Component {
  render() {
    return (
      <Grid className="login">
        <Row className="show-grid">
        	<Col sm={10} md={4} smOffset={1} mdOffset={4}>
	      		<h1 className="h1">Login</h1>
	      		<form>
							<input type="text" placeholder="Email Address..." />
							<div>
								<button type="submit" value="Send Token">Send Token</button>
							</div>
		  			</form>
		  		</Col>
				</Row>
      </Grid>
    );
  }
}

export default Login