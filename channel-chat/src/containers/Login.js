import React, { Component } from "react";
import { API_ROOT } from "../constants/index";
import { Button } from "semantic-ui-react";
import { fetchJson } from "../util/request";
import { Link, Redirect } from "react-router-dom";

export default class Login extends Component {
  state = {
    username: "",
    isLoggedIn: false
  };

  constructor() {
    super();
    this.username = React.createRef();
    this.password = React.createRef();

    if (this.getToken()) {
      this.getProfile();
    }

    this.logout = this.logout.bind(this);
  }

  handleLogin = async ev => {
    ev.preventDefault();
    let username = this.username.current.value;
    let password = this.password.current.value;

    const response = await fetchJson(`${API_ROOT}/login`, {
      method: "POST",
      body: JSON.stringify({ user: { username, password } })
    });
    if (response && response.jwt) {
      this.saveToken(response.jwt);
      this.getProfile();
    } else {
      alert(response.message);
    }
  };

  saveToken(jwt) {
    localStorage.setItem("jwt", jwt);
  }

  getProfile = async () => {
    const userObj = fetchJson(`${API_ROOT}/profile`);
    this.setState({ user: userObj.user, isLoggedIn: true });
  };

  logout() {
    this.clearToken();
    this.setState({ username: "" });
    return false;
  }

  clearToken(jwt) {
    localStorage.setItem("jwt", "");
  }

  getToken(jwt) {
    return localStorage.getItem("jwt");
  }

  render() {
    if (this.state.isLoggedIn === true) {
      return <Redirect to="/" />;
    }
    return (
      <div className="App ui two column centered grid">
        <div className="column">
          <form className="ui form">
            <div className="field">
              <label>Username</label>
              <input type="text" placeholder="username" ref={this.username} />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="password"
                ref={this.password}
              />
            </div>
            <button className="ui secondary button" onClick={this.handleLogin}>
              Log in
            </button>
            <Button onClick={this.logout}>log out</Button>
          </form>
          <Link to="/signup"> Don't have an account? Sign up</Link>
        </div>
      </div>
    );
  }
}
