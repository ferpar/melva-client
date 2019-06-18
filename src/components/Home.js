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
      <div className="form-wrapper">
        <h1 className="main title">Bienvenido!</h1>
        <Form className="login-signup-guest" >
          <div className="field-wrapper name">
            <label htmlFor="name">nombre</label>
            <Field
              name="name"
              type="text"
            />
            { touched.name && errors.name && <p>{ errors.name }</p> }
          </div>
        
          <div className="field-wrapper surname">
            <label htmlFor="surname">apellido</label>
            <Field
              name="surname"
              type="text"
            />
            { touched.surname && errors.surname && <p>{ errors.surname }</p> }
          </div>
          <div className="field-wrapper phone">
            <label htmlFor="phone">teléfono</label>
            <Field
              name="phone"
              type="number"
            />
            { touched.phone && errors.phone && <p>{ errors.phone }</p> } 
          </div>
        
          <div className="enter-platform">
            <button disabled={isSubmitting} type="submit">Entrar</button>
          </div>
        </Form>
      </div>
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
