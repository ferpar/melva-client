import React from "react";
import "./EmployeesForm.css";

import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";


const BaseForm = ({
  values,
  errors,
  touched,
  isSubmitting,
  handleIsFormOpen,
  handleEmployeeToEdit
}) => (
  <div className="employees-form-container">
      <Form className="employees-form">
    
          <div className="employees-field-wrapper emp-username">
            <label htmlFor="username">nombre de usuario</label>
            <Field name="username" type="text" />
            {touched.username && errors.username && (
              <p className="emp-error-msg">{errors.username}</p>  
            )}
          </div>

          <div className="employees-field-wrapper emp-password">
            <label htmlFor="password">contraseña</label>
            <Field name="password" type="password"/>
            {touched.password && errors.password && (
              <p className="emp-error-msg">{errors.password}</p>
            )}
          </div>

          <div className="employees-field-wrapper emp-password">
            <label htmlFor="passwordConfirmation">repetir contraseña</label>
            <Field name="passwordConfirmation" type="password"/>
            {touched.passwordConfirmation && values.passwordConfirmation != values.password && (
              <p className="emp-error-msg">por favor, repita la contraseña</p>
            )}
          </div>

          <div className="emp-buttons-wrapper">
            <button
              className="emp-cancel-button"
              onClick={async () => {
                await handleIsFormOpen();
                await handleEmployeeToEdit(""); 
              }}
              type="button"
            >
            Cancelar
            </button>

            { (values.password === values.passwordConfirmation && values.password && values.username) ?
              <button 
                className="emp-edit-button" 
                disabled={isSubmitting} 
                type="submit"
              >
                Añadir
              </button>
            : (
              <button 
                className="emp-edit-button" 
                disabled
                type="submit"
              >
                Añadir
              </button>
            ) }

          </div>

      </Form>
  </div>
)

const EmployeesForm = withFormik({
  mapPropsToValues({employees, employeeToEdit}) {
    if (employeeToEdit) {
      const myEmployee = employees.find( employee => employee._id === employeeToEdit)

      const { 
        username,
        password,
      } = myEmployee
      const passwordConfirmation = ""

      return {
        username,
        password,
        passwordConfirmation
      }

    } else {

      return {
        username: "",
        password: "",
        passwordConfirmation: ""
      }

    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required("introduzca nombre de ususario"),
    password: Yup.string().length(6, "mínimo 6 caracteres").required("introduzca contraseña"),
    passwordConfirmation: Yup.string()
  }),
  async handleSubmit(values, {props, setSubmitting}) {
    const newUser = {
      ...values, 
      franchise: props.franchise._id, //adding franchise
    }
    delete newUser.passwordConfirmation; //to avoid sending it to the BE
    console.log(newUser)

    const savedUser = await props.authService.signup(newUser)
    .catch(err => console.error("[Handler] Error saving new User", err))
    console.log(savedUser.data)

  }
})(BaseForm);

export default EmployeesForm;

