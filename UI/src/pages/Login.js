import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Col, Row, Alert, FormGroup, FormControl } from 'react-bootstrap';

// import { isEmail } from '../../api/src/lib/validation'; /* LoL */
import * as authlib from '../lib/auth';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = { email: null, emailSent: false, error: null, loading: false };
    this.onSubmit = this.onSubmit.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this);
    this.getEmailValidationState = this.getEmailValidationState.bind(this)
  }

  async onSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    try {
      await authlib.signIn(this.state.email);
      this.setState({ emailSent: true, error: null });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ loading: false });
    }
  }

  onEmailChange(event) {
  	console.log ('foo')
    const email = event.target.value;
    this.setState({ email });
  }

  getEmailValidationState() {
    if (!this.state.email) return null; /* Field wasn't touched yet */
    // try { isEmail(this.state.email); return null; } /* Success */
    // catch (error) { return 'error'; }
    return null;
  }
  render() {
    return (
      <Grid className="onboarding">
        <Row className="show-grid">
        	<Col sm={10} md={4} smOffset={1} mdOffset={4}>
	      		<h1 className="h1">Login</h1>
		      	{ this.state.error &&
		          <Row>
		            <Col md={12}>
		              <Alert bsStyle="warning">
		                <strong>Oh no!</strong> we couldn&#39;t get you in.
		                There&#39;s an error using this email address:
		                {' '}
		                <strong>{this.state.error}</strong>
		              </Alert>
		            </Col>
		          </Row> }
		        { this.state.emailSent &&
		          <Row>
		            <Col md={12}>
		              <Alert bsStyle="info">
		                <strong>Awesome!</strong> We know that email! Please 
		                check your email and to find a magical login link!
		              </Alert>
		            </Col>
		          </Row> }
		        { !this.state.emailSent &&
	      		<form onSubmit={this.onSubmit}> 						
							<FormControl
								onChange={this.onEmailChange.bind(this)}
								type="text"
								placeholder="Email Address..."
							/>
							<div>
								<button type="submit" value="Send Token">Send Token</button>
							</div>
		  			</form> }
		  		</Col>
				</Row>
      </Grid>
    );
  }
}