import React from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import Appointments from './Appointments'
import Home from './Home'
import Login from './Login'
import GLogin from './GLogin'

const App = () => (
    
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/appointments' component={Appointments} />
      <Route path='/login-guest' component={GLogin} />
      <Route path='/login' component={Login} />
    </Switch>
)

export default App
