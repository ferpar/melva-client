import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

//All this is for the form component---------------------------------
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import smartInput from "react-phone-number-input/smart-input";

import {slide as Menu} from "react-burger-menu";

import Modali, { useModali } from "modali";

const BaseHome = ({
  values,
  errors,
  touched,
  isSubmitting,
  handleLogin,
  authService,
  setEditMode
}) => { 

  return (
  <>  
    <div className="home-container">
      <div className="form-wrapper">
        <h1 className="main title">Editar perfil</h1>
        <Form className="login-signup-guest">
          <div className="field-wrapper name">
            <label htmlFor="name">nombre</label>
            <Field name="name" type="text" />
            {touched.name && errors.name && (
              <p className="error-msg">{errors.name}</p>
            )}
          </div>

          <div className="field-wrapper surname">
            <label htmlFor="surname">apellido</label>
            <Field name="surname" type="text" />
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
                  disabled
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

          <div className="edit-save-wrapper">
            <button
              className="cancel-button"
              onClick={() => setEditMode(false)}
              type="button"
            >
              Cancelar
            </button>
            <button className="edit-button" disabled={isSubmitting} type="submit">
              Guardar
            </button>
          </div>
        </Form>
      </div>
    </div>
  </>
  );
}

const Home = withFormik({
  mapPropsToValues({ user }) {
    return {
      name: user.name,
      surname: user.surname,
      phone: user.phone
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
    props.authService
      .userEdit(values)
      .then(result => {
        props.handleLogin(result.data, true, "/profile");
      })
      .catch(err =>
        console.error("there was an error posting your login info", err)
      );
    setSubmitting(false);
  }
})(BaseHome);
//----------------------------------------------------------

//From here on: the Profile Component

const Profile = ({ user, handleLogin, handleLogout, authService, campaignService}) => {
  const initialInfo = {};
  const [userInfo, setUserInfo] = useState(initialInfo);
  const [editMode, setEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)

  const [confirmRemoveModal, toggleConfirmRemoveModal] = useModali({
    animated: true,
    overlayClose: false,
    keyboardClose: false,
    closeButton: false,
    buttons: [
      <Modali.Button
        label="Volver"
        isStyleCancel
        onClick={ () => {
          toggleConfirmRemoveModal()
        }
        }
      />,
      <Modali.Button
        label="Borrar"
        isStyleDefault
        onClick={async () => {
          await campaignService.removeUser({id: user._id, blacklist: true})
          await handleLogout()   
        }}
      />
    ],
    title: "Borrado de cuenta"
  })

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  useEffect(() => {}, [userInfo]);

  return (
   <> 
    <Menu 
      isOpen={menuOpen}
      onStateChange={(state) => handleStateChange(state)}
    >
        <Link onClick={() => closeMenu()} to="/appointments">Citas</Link>
        <Link onClick={() => closeMenu()} to="/profile">Perfil de Usuario</Link>
        <button onClick={ async () => {
          await handleLogout() //this is important to avoid race between handleLogout and closeMenu
          closeMenu()}
        }>Desconectar</button>
    </Menu>
    <Modali.Modal {...confirmRemoveModal}>
      <div className="modal-text">
        <p>
          {"Si confirma esta acción se borrarán sus datos de usuario y no se le enviarán más mensajes."}
        </p>
      </div>
    </Modali.Modal>
    {editMode ? (
    <div>
      {" "}
      <Home
        handleLogin={handleLogin}
        authService={authService}
        user={user}
        setEditMode={setEditMode}
      />
    </div>
  ) : (
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
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Editar
            </button>
          </div>
        </div>
      </div>
      <div className="profile-second-container">
        <div className="profile-wrapper">
          <button 
            className="consent-button"
            onClick = { async () => { 
              toggleConfirmRemoveModal()
            }
            } >
            Borrar Cuenta
          </button>
        </div>
      </div>
    </div>
  )}
</>
);
};

export default Profile;
