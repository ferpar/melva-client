import React from "react";
import axios from "axios";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Appointments from "./Appointments";
import Home from "./Home";
import Login from "./Login";
import GLogin from "./GLogin";
import ProtectedRoute from "./ProtectedRoute";

class App extends React.Component {
   
  state = {
    loggedIn: false,
    isLoading: true,
    user: {}
  };

  handleLogin = (userObj, redirect = false, redirectURL) => {
    const { navstate = {} } = this.props.location;
    const { prevLocation } = navstate;

    this.setState(
      {
        ...this.state,
        loggedIn: true,
        isLoading: false,
        user: userObj
      },
      () => {
        redirect && this.props.history.push(redirectURL || prevLocation || "/");
      }
    );
  };

  getLoggedIn = () => {
    axios
      .get("http://localhost:3010/api/auth/loggedin", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        withCredentials: true // <= that's what changed
      })
      .then(result => {
        console.log('didMount');
        console.log(result);
        this.handleLogin(result.data, false);
      })
      .catch(() => this.setState({isLoading:false}))
  }

  handleLogout = () => {
    axios
      .get("http://localhost:3010/api/auth/logout", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        withCredentials: true // <= that's what changed
      })
      .then(
        this.setState({ ...this.state, loggedIn: false }, () =>
          this.props.history.push("/")
        )
      );
  };


  componentDidMount() {
    this.getLoggedIn();
  }

  render() {
    console.log('render');
    console.log(this.state);
    console.log(this.props);
    const { navstate = {} } = this.props.location;
    const { error } = navstate;
    const { name, surname, username } = this.state.user;
    const { loggedIn, user, isLoading } = this.state;
    return (
      !isLoading ?
      <div className="main">
        <div className="links">
          <Link to="/login">Login</Link>
          <Link to="/login-guest">Guest</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/">Home</Link>
          <button onClick={this.handleLogout}>Log out</button>
        </div>
        {loggedIn && <div>Logged in as {name || username}</div>}
        {!loggedIn && error && <div>ERROR: {error}</div>}
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Home handleLogin={this.handleLogin} />}
          />
          <ProtectedRoute
            path="/appointments"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            component={(props) => <Appointments router={props} user={user}/>}
          />
          <Route
            path="/login-guest"
            render={() => <GLogin handleLogin={this.handleLogin} />}
          />
          <Route
            path="/login"
            render={() => <Login handleLogin={this.handleLogin} />}
          />
        </Switch>
      </div>
      :
      <div>Loading...</div>
    );
  }
}

export default withRouter(App);
