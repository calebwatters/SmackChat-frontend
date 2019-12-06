import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <div className="ui secondary menu">
        <div className="header">
          <h1>SmackChat Messenger</h1>
        </div>

        <div className="right menu">
          <div className="item">
            {this.props.user ? (
              <Link onClick={this.props.logout} to="/login">
                Logout
              </Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}
