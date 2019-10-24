import React from "react";
import "./LocationsForm.css";

import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import smartInput from "react-phone-number-input/smart-input";

const BaseForm = ({
  values,
  errors,
  touched,
  isSubmitting,
  handleIsFormOpen
}) => (
  <div className="locations-form-container">
      <Form className="locations-form">
    
          <div className="locations-field-wrapper loc-name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" placeholder="Ej: Sevilla-1" />
            {touched.name && errors.name && (
              <p className="loc-error-msg">{errors.name}</p>  
            )}
          </div>

          <div className="locations-field-wrapper loc-address">
            <label htmlFor="address">dirección</label>
            <Field name="address" type="text" placeholder="Ej: Av. San Fco Javier 4"/>
            {touched.address && errors.address && (
              <p className="loc-error-msg">{errors.address}</p>
            )}
          </div>

          <div className="field-wrapper loc-phone">
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
                  country="ES"
                  inputComponent={smartInput} //using smart input to prevent the caret from moving to the end
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

          <div className="locations-field-wrapper loc-email">
            <label htmlFor="email">email</label>
            <Field name="email" type="text" placeholder="Ej: sevilla1@clinica.es"/>
            {touched.email && errors.email && (
              <p className="loc-error-msg">{errors.email}</p>
            )}
          </div>

          <div className="locations-field-wrapper loc-url">
            <label htmlFor="url">dirección web</label>
            <Field name="url" type="text" placeholder="Ej: www.clinica.es"/>
            {touched.url && errors.url && (
              <p className="loc-error-msg">{errors.url}</p>
            )}
          </div>

          <div className="loc-buttons-wrapper">
            <button
              className="loc-cancel-button"
              onClick={async () => {await handleIsFormOpen();}}
              type="button"
            >
            Cancelar
            </button>
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
      address: "",
      phone: "",
      email: "",
      url: ""
    }
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("introduzca el nombre de la clínica"),
    address: Yup.string().required("introduzca dirección de la clínica"),
    phone: Yup.string(),
    email: Yup.string(),
    url: Yup.string()
  }),
  async handleSubmit(values, {props, setSubmitting}) {
    console.log(values)
    console.log(props.franchiseService)
  //  const savedFranchise = await props.franchiseService.saveFranchise(values)
  //  .catch(err => console.error("[Handler] error saving Franchise data", err));
  //  console.log(savedFranchise)
  //  try {
  //    await props.handleLogin(savedFranchise.data.updatedUser, true, "/dashboard")
  //  } catch(err) { console.error("[Handler] error handling re-login", err);}
    setSubmitting(false);
  }
})(BaseForm);

export default LocationsForm;
