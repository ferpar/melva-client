import React from "react";
import "./FranchiseForm.css";

import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

const BaseForm = () => (
  <div className="franchise-form-container">
    <div className="franchise-form-wrapper">
      <h1 className="franchise-title">Datos de la franquicia</h1>
      <Form className="franchise-form">
    
          <div className="franchise-field-wrapper fra-name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" />
          </div>

          <div className="franchise-field-wrapper fra-sms-name">
            <label htmlFor="sms-name">nombre abreviado</label>
            <Field name="sms-name" type="text" />
          </div>

          <div className="fra-buttons-wrapper">
            <button
              className="cancel-button"
 //             onClick={() => setEditMode(false)}
              type="button"
            >
              Cancelar
            </button>
            <button className="fra-edit-button" /*disabled={isSubmitting}*/ type="submit">
              Guardar
            </button>
          </div>

      </Form>
    </div>
  </div>
)

const FranchiseForm = withFormik({
})(BaseForm);

export default FranchiseForm;
