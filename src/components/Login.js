import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const BaseForm = ({
  values,
  errors,
  touched,
  isSubmitting,
  handleLogin,
  authService
}) => (
  <div className="home-container">
    <div className="form-wrapper">
      <h1 className="main title">¡Bienvenido!</h1>
      <Form className="login-signup-guest">
        <div className="field-wrapper name">
          <label htmlFor="username">nombre de usuario</label>
          <Field name="username" type="text" id="username" />
          {touched.username && errors.username && (
            <p className="error-msg">{errors.username}</p>
          )}
        </div>

        <div className="field-wrapper surname">
          <label htmlFor="password">contraseña</label>
          <Field name="password" type="password" id="password" />
          {touched.password && errors.password && (
            <p className="error-msg">{errors.password}</p>
          )}
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

const LoginForm = withFormik({
  mapPropsToValues({ user }) {
    return {
      username: "",
      password: ""
    };
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required("introduzca un nombre de usuario"),
    password: Yup.string().required("debe introducir una contraseña")
  }),
  handleSubmit(values, { props, setSubmitting }) {

    props.authService
      .userLogin(values)
      .then(result => {
        props.handleLogin(result.data, true, "/appointments-book");
      })
      .catch(err =>
        console.error("there was an error posting your login info", err)
      );
    setSubmitting(false);
  }
})(BaseForm);

export default withRouter(LoginForm);
