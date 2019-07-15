import React from "react";
import axios from "axios";
import { hot } from "react-hot-loader";
import AuthService from "../services/auth.js";
import AppointmentService from "../services/appointments.js";
import { Switch, Route, Link, withRouter } from "react-router-dom";
import Appointments from "./AppointmentsF";
import Home from "./Home";
import Login from "./Login";
import GLogin from "./GLogin";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";

import {slide as Menu} from "react-burger-menu";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      isLoading: true,
      menuOpen: false,
      user: {},
    };
    let authService = new AuthService();
    this.authService = authService;
    let appointmentService = new AppointmentService();
    this.appointmentService = appointmentService;
}

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

  handleStateChange (state) {
    this.setState({menuOpen: state.isOpen})  
  }

  closeMenu () {
    this.setState({menuOpen: false})
  }

  componentDidMount() {
    this.getLoggedIn();
  }

  render() {
    const { navstate = {} } = this.props.location;
    const { error } = navstate;
    const { name, surname, username } = this.state.user;
    const { loggedIn, user, isLoading, isNavBarVisible } = this.state;

    return !isLoading ? (
      <div className="main">
          <Menu 
            isOpen={this.state.menuOpen}
            onStateChange={(state) => this.handleStateChange(state)}
          >
              <Link onClick={() => this.closeMenu()} to="/login">Login</Link>
              <Link onClick={() => this.closeMenu()} to="/profile">Profile</Link>
              <Link onClick={() => this.closeMenu()} to="/appointments">Appointments</Link>
              <Link onClick={() => this.closeMenu()} to="/">Home</Link>
              <button onClick={() => {
                this.handleLogout()
                this.closeMenu()}
              }>Log out</button>
          </Menu>
          <div className="navbar">
            {loggedIn && <div>Logged in as {name || username}</div>}
          </div>
        {!loggedIn && error && <div>ERROR: {error}</div>}
        <Switch>
          <Route
            exact
            path="/"
            render={() => 
              <Home 
                handleLogin={this.handleLogin} 
                authService={this.authService} 
              />}
          />
          <ProtectedRoute
            path="/appointments"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            component={props => 
              <Appointments 
                router={props} 
                user={user} 
                authService = {this.authService}
                appointmentService = {this.appointmentService}
              />}
          />
          <ProtectedRoute
            path="/profile"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            component={props => 
              <Profile 
                router={props} 
                user={user} 
                authService = {this.authService}
                appointmentService = {this.appointmentService}
              />}
          />
          <Route
            path="/login-guest"
            render={() => 
              <GLogin 
                handleLogin={this.handleLogin} 
                authService={this.authService}
              />}
          />
          <Route
            path="/login"
            render={() => 
              <Login 
                handleLogin={this.handleLogin} 
                authService={this.authService}
              />}
          />
        </Switch>
      </div>
    ) : (
      <div>Loading...</div>
    );
  }
}

export default hot(module)(withRouter(App));
