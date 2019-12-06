import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <div className="ui secondary pointing menu">
        <div className="header ">
          <h1>SmackChat</h1>
        </div>

        <div className=" right menu">
          {this.props.user ? (
            <a className="ui item">
              <Link onClick={this.props.logout} to="/login">
                Logout
              </Link>
            </a>
          ) : (
            <a className="ui item">
              <Link to="/login">Login</Link>
            </a>
          )}
        </div>
      </div>
    );
  }
}
