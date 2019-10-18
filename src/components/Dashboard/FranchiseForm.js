import React from "react";
import "./FranchiseForm.css";

import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

const BaseForm = ({
  values,
  errors,
  touched,
  isSubmitting
}) => (
  <div className="franchise-form-container">
    <div className="franchise-form-wrapper">
      <h1 className="franchise-title">Datos de la franquicia</h1>
      <Form className="franchise-form">
    
          <div className="franchise-field-wrapper fra-name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" />
            {touched.name && errors.name && (
              <p className="fra-error-msg">{errors.name}</p>  
            )}
          </div>

          <div className="franchise-field-wrapper fra-sms-name">
            <label htmlFor="sms">nombre abreviado</label>
            <Field name="sms" type="text" />
            {touched.sms && errors.sms && (
              <p className="fra-error-msg">{errors.sms}</p>
            )}
          </div>

          <div className="fra-buttons-wrapper">
            {console.log(errors)}
            {console.log(touched)}
            <button
              className="cancel-button"
 //             onClick={() => setEditMode(false)}
              type="button"
            >
              Cancelar
            </button>
            <button className="fra-edit-button" disabled={isSubmitting} type="submit">
              Guardar
            </button>
          </div>

      </Form>
    </div>
  </div>
)

const FranchiseForm = withFormik({
  mapPropsToValues() {
    return {
      name: "",
      sms: ""
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("por favor, introduzca nombre de la franquicia"),
    "sms": Yup.string()
      .min(3, "mínimo 3 caracteres")
      .max(11, "máximo 11 caracteres")
      .required("Este nombre encabeza los SMS/mensajes a pacientes")
  }),
  handleSubmit(values, {props, setSubmitting}) {
    console.log(values);
    setSubmitting(false);
  }
})(BaseForm);

export default FranchiseForm;
