import React from "react";
import axios from "axios";
import { hot } from "react-hot-loader";
import AuthService from "../services/auth.js";
import AppointmentService from "../services/appointments.js";
import { Switch, Route, Link, withRouter, Redirect } from "react-router-dom";
import Appointments from "./AppointmentsF";
import CustomerLogin from "./Home";
import UserLogin from "./Login.js";
import Profile from "./Profile";
import Book from "./AppointmentsBook";
import ProtectedRoute from "./ProtectedRoute";

import Spinner from "./spinners/Ripple.js";
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
        if (result.data.message) {
          this.setState({isLoading: false});
        } else {
          this.handleLogin(result.data, false);
        }
      })
    //legacy from when loggedIn returned a 403 on wrong credentials:
      .catch(() => this.setState({ isLoading: false })); 
  };

  handleLogout = () => {
    this.authService
      .logout()
      .then( () => {
        this.setState({ ...this.state, loggedIn: false, user: {}, isLoading: true }, () =>
          this.props.history.push("/")
        )
      });
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

  componentDidUpdate() {
    if(this.state.isLoading) {
      this.getLoggedIn()
    }
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
              <Link onClick={() => this.closeMenu()} to="/appointments">Citas</Link>
              <Link onClick={() => this.closeMenu()} to="/profile">Perfil de Usuario</Link>
              <Link onClick={() => this.closeMenu()} to="/login">Acceso Gestión</Link>
              <button onClick={ async () => {
                await this.handleLogout() //this is important to avoid race between handleLogout and closeMenu
                this.closeMenu()}
              }>Desconectar</button>
          </Menu>
          <div className="navbar">
            {loggedIn && <div> Usuario: {name || username}</div>}
            {!loggedIn && error && <div className="login-error">ERROR: {error}</div>}
          </div>
        <div className="login-error">
          {!loggedIn && error && <div>ERROR: {error}</div>}
        </div>
        <Switch>
          <Route
            exact
            path="/"
            render={() => loggedIn 
              ? 
              ( user.role==='Admin' ? <Redirect to="/appointments-book" /> : <Redirect to="/appointments" />)
              :
              <CustomerLogin 
                handleLogin={this.handleLogin} 
                authService={this.authService} 
              />}
          />
          <Route
            path="/login"
            render={() => loggedIn 
              ? 
              ( user.role==='Admin' ? <Redirect to="/appointments-book" /> : <Redirect to="/appointments" />)
              :
              <UserLogin 
                handleLogin={this.handleLogin} 
                authService={this.authService} 
              />}
          />
          <ProtectedRoute
            path="/appointments"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            allowedRoles={['Customer']}
            component={props => 
              <Appointments 
                router={props} 
                user={user} 
                authService = {this.authService}
                appointmentService = {this.appointmentService}
                handleLogout = {this.handleLogout}
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
                handleLogin = {this.handleLogin}
                authService = {this.authService}
                appointmentService = {this.appointmentService}
              />}
          />
          <ProtectedRoute
            path="/appointments-book"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            allowedRoles={['Admin']}
            redirectURL={"/login"}
            component={props => 
              <Book 
                router={props} 
                user={user} 
                handleLogin = {this.handleLogin}
                authService = {this.authService}
                appointmentService = {this.appointmentService}
              />}
          />
        </Switch>
      </div>
    ) : (
      <div className="loading-main" >
        <Spinner />
      </div>
    );
  }
}

export default hot(module)(withRouter(App));
