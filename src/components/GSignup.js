import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

const GSignup = props => {
  const [state, setState] = useState({ name: "", surname: "", phone: "" });

  const handleChange = ({ name, value }) => {
    setState({ ...state, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("http://localhost:3010/api/auth/signup-guest", state, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        withCredentials: true // <= that's what changed
      })
      .then(result => {
        console.log(result);
        props.handleLogin(result.data, true, "/appointments");
      })
      .catch(err => console.error("there was an error posting your info", err));
  };

  return (
    <div className="home-container">
      <h1 className="main title">Bienvenido!</h1>

      <form className="signup-guest" onSubmit={e => handleSubmit(e)}>
        <label htmlFor="name">nombre</label>
        <input
          name="name"
          type="text"
          onChange={e => handleChange(e.target)}
          value={state.name}
        />
        <br />

        <label htmlFor="surname">apellido</label>
        <input
          name="surname"
          type="text"
          onChange={e => handleChange(e.target)}
          value={state.surname}
        />
        <br />

        <label htmlFor="phone">teléfono</label>
        <input
          name="phone"
          type="text"
          onChange={e => handleChange(e.target)}
          value={state.phone}
        />
        <br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};
export default withRouter(GSignup);
