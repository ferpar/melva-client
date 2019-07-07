import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'


const BaseHome = ({ values, errors, touched, isSubmitting, handleLogin, authService }) => (
  <div className="home-container">
    <div className="form-wrapper">
      <h1 className="main title">Bienvenido!</h1>
      <Form className="login-signup-guest">
        <div className="field-wrapper name">
          <label htmlFor="name">nombre</label>
          <Field name="name" type="text" />
          {touched.name && errors.name && <p>{errors.name}</p>}
        </div>

        <div className="field-wrapper surname">
          <label htmlFor="surname">apellido</label>
          <Field name="surname" type="text" />
          {touched.surname && errors.surname && <p>{errors.surname}</p>}
        </div>
        <div className="field-wrapper phone">
          <label htmlFor="phone">teléfono</label>
          <Field name="phone" render={({field, form:{touched, errors, setFieldValue}, ...props}) => (
            <PhoneInput name="phone" country="ES" {...field} {...props} onBlur={(e)=>{}} onChange={(value)=>{setFieldValue("phone", value)}} />
          )} />
          {touched.phone && errors.phone && <p>{errors.phone}</p>}
        </div>

        <div className="enter-platform">
          <button disabled={isSubmitting} type="submit">
            Entrar
          </button>
        </div>
      </Form>
    </div>
  </div>
);

const Home = withFormik({
  mapPropsToValues() {
    return {
      name: "",
      surname: "",
      phone: ""
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("please enter a name"),
    surname: Yup.string(),
    phone: Yup.string()
      .min(4, "at least 4 digits long")
      .required("please enter a phone number")
  }),
  handleSubmit(values, { props, setSubmitting }) {
    props.authService
      .entrance(values)
      .then(result => {
        console.log(result);
        props.handleLogin(result.data, true, "/appointments");
      })
      .catch(err => console.error("there was an error posting your login info", err));
    setSubmitting(false);
  }
})(BaseHome);

export default withRouter(Home);
