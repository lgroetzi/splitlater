import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, Link, HashRouter as Router } from 'react-router-dom';

import './App.css';
import { Button, Grid, Col, Row } from 'react-bootstrap';
import logo from './splitter-logo.svg';

import NotFound from './pages/NotFound';
import Login from './pages/Login.js';
import Plaid from './pages/Plaid.js';
import Home from './pages/Home.js';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/plaid" component={Plaid} />
    <Route component={NotFound} />
  </Switch>
);

export default (props) => (
  <Router {...props}>
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Routes />
    </div>
  </Router>
);

