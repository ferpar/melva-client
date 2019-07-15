import React, { useState, useEffect } from 'react';
import axios from 'axios';


//All this is for the form component---------------------------------
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const BaseHome = ({ values, errors, touched, isSubmitting, handleLogin, authServicei, setEditMode }) => (
  <div className="home-container">
    <div className="form-wrapper">
      <h1 className="main title">Editar perfil</h1>
      <Form className="login-signup-guest">
        <div className="field-wrapper name">
          <label htmlFor="name">nombre</label>
          <Field name="name" type="text" />
          {touched.name && errors.name && <p className="error-msg">{errors.name}</p>}
        </div>

        <div className="field-wrapper surname">
          <label htmlFor="surname">apellido</label>
          <Field name="surname" type="text" />
          {touched.surname && errors.surname && <p className="error-msg">{errors.surname}</p>}
        </div>
        <div className="field-wrapper phone">
          <label htmlFor="phone">teléfono</label>
          <Field name="phone" render={({field, form:{touched, errors, setFieldValue}, ...props}) => (
            <PhoneInput name="phone" country="ES" {...field} {...props} onBlur={(e)=>{}} onChange={(value)=>{setFieldValue("phone", value)}} />
          )} />
          {touched.phone && errors.phone && <p className="error-msg">{errors.phone}</p>}
        </div>

        <div className="edit-save-wrapper">
          <button className="cancel-button" onClick={()=>setEditMode(false)} type="button">Cancelar</button>
          <button className="edit-button" disabled={isSubmitting} type="submit">
            Guardar 
          </button>
        </div>
      </Form>
    </div>
  </div>
);

const Home = withFormik({
  mapPropsToValues({user}) {
    return {
      name: user.name,
      surname: user.surname,
      phone: user.phone
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
      .userEdit(values)
      .then(result => {
        console.log(result);
        props.handleLogin(result.data, true, "/profile");
      })
      .catch(err => console.error("there was an error posting your login info", err));
    setSubmitting(false);
  }
})(BaseHome);
//----------------------------------------------------------

//From here on: the Profile Component

const Profile = ({
  user,
  handleLogin,
  authService
}) => {

  const initialInfo = {}
  const [userInfo, setUserInfo] = useState(initialInfo);
  const [editMode, setEditMode] = useState(false);


  useEffect(()=>{
  },
  [userInfo]
  )

  return editMode
    ? ( 
      <div> {console.log(user)}
        <Home 
          handleLogin={handleLogin}
          authService={authService} 
          user={user}
          setEditMode={setEditMode}
        />
      </div> )
    : (
    <div>
      <div className="profile-container">
        <div className="profile-wrapper">
          <div className="profile-header">
            <h1>MI PERFIL</h1>
          </div>
          <p>nombre: {user.name}</p>
          <p>apellidos: {user.surname}</p>
          <p>teléfono: {user.phone}</p>
          <div className="edit-btn-wrapper">
            <button className="edit-button" onClick={ () => setEditMode(true)}>Editar</button>
          </div>
        </div>
      </div>
    </div>
  )


}

export default Profile;
