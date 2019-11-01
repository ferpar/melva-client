import React from "react";
import "./FranchiseForm.css";

import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

const BaseForm = ({
  values,
  errors,
  touched,
  isSubmitting,
  handleIsEditing,
  handleIsConfiguring
}) => (
  <div className="franchise-form-container">
    <div className="franchise-form-wrapper">
      <h1 className="franchise-title">Datos de la franquicia</h1>
      <Form className="franchise-form">
    
          <div className="franchise-field-wrapper fra-name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" placeholder="Ej: Clínicas Isidro" />
            {touched.name && errors.name && (
              <p className="fra-error-msg">{errors.name}</p>  
            )}
          </div>

          <div className="franchise-field-wrapper fra-sms-name">
            <label htmlFor="smsName">nombre abreviado</label>
            <Field name="smsName" type="text" placeholder="Ej: Clin.Isidro"/>
            {touched.smsName && errors.smsName && (
              <p className="fra-error-msg">{errors.smsName}</p>
            )}
          </div>

          <div className="fra-buttons-wrapper">
            <button
              className="fra-cancel-button"
              onClick={async () => {await handleIsEditing(); await handleIsConfiguring()}}
              type="button"
            >
            Cancelar
            </button>
            <button 
              className="fra-edit-button" 
              disabled={isSubmitting} 
              type="submit"
            >
              Guardar
            </button>
          </div>

      </Form>
    </div>
  </div>
)

const FranchiseForm = withFormik({
  mapPropsToValues({user}) {
    if (user.franchise) {
    return {
      name: user.franchise.name,
      smsName: user.franchise.smsName
    };
    } else {
    return {
      name: "",
      smsName: ""
    }
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("por favor, introduzca nombre de la franquicia"),
    "smsName": Yup.string()
      .min(3, "mínimo 3 caracteres")
      .max(11, "máximo 11 caracteres")
      .required("Este nombre encabeza los SMS/mensajes a pacientes") //if possible: improve this explanation
  }),
  async handleSubmit(values, {props, setSubmitting}) {
    const savedFranchise = await props.franchiseService.saveFranchise(values)
    .catch(err => console.error("[Handler] error saving Franchise data", err));
    console.log(savedFranchise)
    try {
      await props.handleLogin(savedFranchise.data.updatedUser, true, "/dashboard")
    } catch(err) { console.error("[Handler] error handling re-login", err);}
    setSubmitting(false);
  }
})(BaseForm);

export default FranchiseForm;
