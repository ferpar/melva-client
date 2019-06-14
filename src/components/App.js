import React from 'react'
import axios from 'axios'
import {Switch, Route, Link, withRouter} from 'react-router-dom'
import Appointments from './Appointments'
import Home from './Home'
import Login from './Login'
import GLogin from './GLogin'
import ProtectedRoute from './ProtectedRoute'


class App extends React.Component { 
  state = {
    loggedIn: false,
    user: {}
  };

  handleLogin = (userObj, redirect = false, redirectURL) => {
    const {navstate = {} } = this.props.location;
    const { prevLocation } = navstate;

    this.setState({
    ...this.state, loggedIn: true, user: userObj
    },
    () => {
      redirect && 
      this.props.history.push( redirectURL || prevLocation || "/");
    });
  };

  handleLogout = () => {
    axios.get('http://192.168.1.51:3010/api/auth/logout', {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
        },
      withCredentials: true // <= that's what changed
    })
    .then(this.setState({...this.state, loggedIn:false}, () => this.props.history.push('/')));
  }

  componentDidMount() {
    axios.get('http://192.168.1.51:3010/api/auth/loggedin', {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
        },
      withCredentials: true // <= that's what changed
    })
    .then(result => {
      console.log(result)
      this.handleLogin(result.data, false) 
    });
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    const { navstate = {} } = this.props.location;
    const { error } = navstate;
    const {name, surname, username} = this.state.user;
    return (
      <div className="main">

      <div className="links">
        <Link to='/login'>Login</Link>
        <Link to='/login-guest'>Guest</Link>
        <Link to='/appointments'>Appointments</Link>
        <Link to='/'>Home</Link>
        <button onClick={this.handleLogout}>Log out</button>
      </div>
        {
          this.state.loggedIn &&
          <div>Logged in as {name || username}</div>
        }
        { error && <div>ERROR: {error}</div> }
        <Switch>
          <Route exact path='/' render={() => <Home handleLogin={this.handleLogin}/>} />
          <ProtectedRoute path='/appointments' loggedIn={this.state.loggedIn}  component={Appointments} />
          <Route path='/login-guest' render={() => <GLogin handleLogin={this.handleLogin}/>} />
          <Route path='/login' render={() => <Login handleLogin={this.handleLogin}/>} />
        </Switch>
      </div>
    )};

}

export default withRouter(App)
