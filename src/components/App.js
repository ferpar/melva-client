import React from "react";
import axios from "axios";
import { hot } from "react-hot-loader";
import AuthService from "../services/auth.js";
import AppointmentService from "../services/appointments.js";
import CampaignService from "../services/campaigns.js";
import { Switch, Route, Link, withRouter, Redirect } from "react-router-dom";
import Appointments from "./AppointmentsF";
import Home from "./Home";
import UserLogin from "./Login.js";
import Profile from "./Profile";
import Book from "./AppointmentsBook";
import CampaignManager from "./Campaigns.js";
import ProtectedRoute from "./ProtectedRoute";

import Spinner from "./spinners/Ripple.js";

const level = ["", "XVaB8_*", "_Vwy3zA"]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      isLoading: true,
      user: {},
    };
    let authService = new AuthService();
    this.authService = authService;
    let appointmentService = new AppointmentService();
    this.appointmentService = appointmentService;
    let campaignService = new CampaignService();
    this.campaignService = campaignService;
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
        if (result.data.message) { //there will only be data.message if wrong credentials/error
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
              ( (user.role==='Admin' && level.includes(user.accessLevel)) ? <Redirect to="/appointments-book" /> : <Redirect to="/appointments" />)
              :
              <Home 
                handleLogin={this.handleLogin} 
                handleLogout={this.handleLogout}
                authService={this.authService} 
              />}
          />
          <Route
            path="/login"
            render={() => loggedIn 
              ? 
              ( (user.role==='Admin' && level.includes(user.accessLevel)) ? <Redirect to="/appointments-book" /> : <Redirect to="/appointments" />)
              :
              <UserLogin 
                handleLogin={this.handleLogin} 
                handleLogout={this.handleLogout}
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
                campaignService = {this.campaignService}
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
                handleLogout = {this.handleLogout}
                authService = {this.authService}
                appointmentService = {this.appointmentService}
                campaignService = {this.campaignService}
              />}
          />
          <ProtectedRoute
            path="/appointments-book"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            allowedRoles={['Admin']}
            accessLevel={[level[1], level[2]]}
            redirectURL={"/login"}
            component={props => 
              <Book 
                router={props} 
                user={user} 
                handleLogin = {this.handleLogin}
                handleLogout = {this.handleLogout}
                authService = {this.authService}
                appointmentService = {this.appointmentService}
              />}
          />
          <ProtectedRoute
            path="/campaigns"
            user={this.state.user ? this.state.user : null}
            loggedIn={this.state.loggedIn}
            allowedRoles={['Admin']}
            accessLevel={[level[2]]}
            redirectURL={"/login"}
            component={props => 
              <CampaignManager 
                router={props} 
                user={user} 
                handleLogin = {this.handleLogin}
                handleLogout = {this.handleLogout}
                authService = {this.authService}
                appointmentService = {this.appointmentService}
                campaignService = {this.campaignService}
              />}
          />
          <Route
            path="/:linkid"
            render={ ({match, history}) => {
             this.authService
              .linkLogin({linkid: match.params.linkid, secret: "test"})
              .then(result => this.handleLogin(result.data, true, "/appointments") )
              .catch( err => {console.log("nice try ;)"); history.push("/")})

              return (<h1>Test</h1>)
            }
            }
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
