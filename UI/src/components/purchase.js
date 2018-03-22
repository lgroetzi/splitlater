import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Grid, Col, Row } from 'react-bootstrap';

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
          <button className="pull-right round-btn"></button>
        </div>
      </Row>
    </div>
  );
}

export default Purchase