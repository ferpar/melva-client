import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';

const BaseHome = ({
  values, 
  errors,
  touched,
  isSubmitting,
  handleLogin
}) => (
    <div className="home-container">
      <h1 className="main title">Bienvenido!</h1>
      <Form className="login-signup-guest" >
        { touched.name && errors.name && <p>{ errors.name }</p> }
        <label htmlFor="name">nombre</label>
        <Field
          name="name"
          type="text"
        />
        <br />

        <label htmlFor="surname">apellido</label>
        <Field
          name="surname"
          type="text"
        />
        <br />
        { touched.phone && errors.phone && <p>{ errors.phone }</p> } 
        <label htmlFor="phone">teléfono</label>
        <Field
          name="phone"
          type="text"
        />
        <br />

        <button disabled={isSubmitting} type="submit">Entrar</button>
      </Form>
    </div>
  )

const Home = withFormik({
  mapPropsToValues(){
    return{
      name: '',
      surname: 'b',
      phone: ''
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required('must enter a name'),
    surname: Yup.string(),
    phone: Yup.string().min(4,'must be at least 4 digits long').required('must enter a phone')
  }),
  handleSubmit(values, {props, setSubmitting }) {
    console.log(values)
    axios
      .post("http://localhost:3010/api/auth/login-signup-guest", values, {
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
    setSubmitting(false)
  }
})(BaseHome)

export default withRouter(Home);
