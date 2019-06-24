import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const Login = props => {
  const [state, setState] = useState({ username: "", password: "" });

  const handleChange = ({ name, value }) => {
    setState({ ...state, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.authService
      .userLogin(state)
      .then(result => {
        console.log(result);
        props.handleLogin(result.data, true, "/appointments");
      })
      //    .then( props.history.push('/appointments'))
      .catch(err => console.error("there was an error posting your info", err));
  };

  return (
    <div className="home-container">
      <h1 className="main titile">Log in as a user</h1>

      <form className="signup-guest" onSubmit={e => handleSubmit(e)}>
        <label htmlFor="username">username</label>
        <input
          name="username"
          type="text"
          onChange={e => handleChange(e.target)}
          value={state.username}
        />
        <br />

        <label htmlFor="password">password</label>
        <input
          name="password"
          type="text"
          onChange={e => handleChange(e.target)}
          value={state.password}
        />
        <br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};
export default withRouter(Login);
