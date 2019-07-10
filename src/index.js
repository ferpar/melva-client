// --- for ie 11 support (replacing old @babel/polyfill)
import "core-js/stable";
import "regenerator-runtime/runtime";
// ---
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './components/App'
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'

ReactDOM.render(
  <Router>
   <App/>
  </Router>
  , document.getElementById('app'))
