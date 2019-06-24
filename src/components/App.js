import React from "react";
import axios from "axios";
import AuthService from "../services/auth.js"
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Appointments from "./Appointments";
import Home from "./Home";
import Login from "./Login";
import GLogin from "./GLogin";
import ProtectedRoute from "./ProtectedRoute";

import { toast } from "react-toastify";
toast.configure();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      isLoading: true,
      user: {},
      isNavBarVisible: false,
    };
    let authService = new AuthService();
    this.authService = authService;
}

  toggleNavBar = () => {
    this.setState(prevState => ({
      isNavBarVisible: !prevState.isNavBarVisible
    }));
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
    console.log(this.authService)
    this.authService
      .loggedin()
      .then(result => {
        this.handleLogin(result.data, false);
      })
      .catch(() => this.setState({ isLoading: false }));
  };

  handleLogout = () => {
    this.authService
      .logout()
      .then(
        this.setState({ ...this.state, loggedIn: false }, () =>
          this.props.history.push("/")
        )
      );
  };

  notify = () => toast(" 🦄  wow so easy!");

  componentDidMount() {
    this.getLoggedIn();
    document.addEventListener("keydown", event => {
      if (event.keyCode === 65) {
        this.toggleNavBar();
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", event => {
      if (event.keyCode === 65) {
        this.toggleNavBar();
      }
    });
  }

  render() {
    const { navstate = {} } = this.props.location;
    const { error } = navstate;
    const { name, surname, username } = this.state.user;
    const { loggedIn, user, isLoading, isNavBarVisible } = this.state;

    return !isLoading ? (
      <div className="main">
        {isNavBarVisible && (
          <div className="links">
            <Link to="/login">Login</Link>
            <Link to="/login-guest">Guest</Link>
            <Link to="/appointments">Appointments</Link>
            <Link to="/">Home</Link>
            <button onClick={this.notify}>Easy?</button>
            <button onClick={this.handleLogout}>Log out</button>
          </div>
        )}
        {loggedIn && <div>Logged in as {name || username}</div>}
        {!loggedIn && error && <div>ERROR: {error}</div>}
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Home handleLogin={this.handleLogin} authService={this.authService} />}
          />
          <ProtectedRoute
            path="/appointments"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            component={props => <Appointments router={props} user={user} />}
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
    ) : (
      <div>Loading...</div>
    );
  }
}

export default withRouter(App);
