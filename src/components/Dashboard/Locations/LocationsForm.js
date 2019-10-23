import React from "react";
import "./LocationsForm.css";

import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

const BaseForm = ({
  values,
  errors,
  touched,
  isSubmitting,
}) => (
  <div className="locations-form-container">
      <Form className="locations-form">
    
          <div className="locations-field-wrapper loc-name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" placeholder="Ej: Clínicas Isidro" />
            {touched.name && errors.name && (
              <p className="loc-error-msg">{errors.name}</p>  
            )}
          </div>

          <div className="locations-field-wrapper loc-sms-name">
            <label htmlFor="smsName">nombre abreviado</label>
            <Field name="smsName" type="text" placeholder="Ej: Clin.Isidro"/>
            {touched.smsName && errors.smsName && (
              <p className="loc-error-msg">{errors.smsName}</p>
            )}
          </div>

          <div className="loc-buttons-wrapper">
            <button 
              className="loc-edit-button" 
              disabled={isSubmitting} 
              type="submit"
            >
              Guardar
            </button>
          </div>

      </Form>
  </div>
)

const LocationsForm = withFormik({
  mapPropsToValues({user}) {
    return {
      name: "",
      smsName: ""
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
    console.log("form under construction")
  //  const savedFranchise = await props.franchiseService.saveFranchise(values)
  //  .catch(err => console.error("[Handler] error saving Franchise data", err));
  //  console.log(savedFranchise)
  //  try {
  //    await props.handleLogin(savedFranchise.data.updatedUser, true, "/dashboard")
  //  } catch(err) { console.error("[Handler] error handling re-login", err);}
  //  setSubmitting(false);
  }
})(BaseForm);

export default LocationsForm;
