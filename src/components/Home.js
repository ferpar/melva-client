import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {slide as Menu} from "react-burger-menu";

import capitalize from "../helpers/capitalize.js";

const BaseHome = ({
  values,
  errors,
  touched,
  isSubmitting,
  handleLogin,
  handleLogout,
  authService
}) => {
  
  const [menuOpen, setMenuOpen] = useState(false)

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }
  
  return (
   <> 
    <Menu 
      isOpen={menuOpen}
      onStateChange={(state) => handleStateChange(state)}
    >
        <Link onClick={() => closeMenu()} to="/login">Acceso Gestión</Link>
    </Menu>
    <div className="home-container">
      <div className="form-wrapper">
        <h1 className="main title">¡Bienvenido!</h1>
        <Form className="login-signup-guest">
          <div className="field-wrapper name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" id="name" />
            {touched.name && errors.name && (
              <p className="error-msg">{errors.name}</p>
            )}
          </div>

          <div className="field-wrapper surname">
            <label htmlFor="surname">apellido</label>
            <Field name="surname" type="text" id="surname" />
            {touched.surname && errors.surname && (
              <p className="error-msg">{errors.surname}</p>
            )}
          </div>
          <div className="field-wrapper phone">
            <label htmlFor="phone">teléfono</label>
            <Field
              name="phone"
              render={({
                field,
                form: { touched, errors, setFieldValue },
                ...props
              }) => (
                <PhoneInput
                  className="phone-input"
                  name="phone"
                  id="phone"
                  country="ES"
                  {...field}
                  {...props}
                  onBlur={e => {}}
                  onChange={value => {
                    setFieldValue("phone", value);
                  }}
                />
              )}
            />
            {touched.phone && errors.phone && (
              <p className="error-msg">{errors.phone}</p>
            )}
          </div>

          <div className="enter-platform">
            <button disabled type="submit">
              Entrar
            </button>
          </div>
        </Form>
      </div>
    </div>
  </>
)
};

//disabled={isSubmitting}

const Home = withFormik({
  mapPropsToValues({ user }) {
    return {
      name: "",
      surname: "",
      phone: ""
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("por favor, introduzca un nombre"),
    surname: Yup.string(),
    phone: Yup.string()
      .min(4, "al menos 4 dígitos")
      .required("por favor, introduzca un teléfono")
  }),
  handleSubmit(values, { props, setSubmitting }) {

    const processedValues = {...values}
    processedValues.name = capitalize(values.name)
    processedValues.surname = capitalize(values.surname)

    props.authService
      .entrance(processedValues)
      .then(result => {
        props.handleLogin(result.data, true, "/appointments");
      })
      .catch(err =>
        console.error("there was an error posting your login info", err)
      );
    setSubmitting(false);
  }
})(BaseHome);

export default withRouter(Home);
