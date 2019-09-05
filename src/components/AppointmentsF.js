import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/themes/material_green.css";

import {slide as Menu} from "react-burger-menu";
import Spinner from "./spinners/Ripple.js";

import { toast } from "react-toastify";
toast.configure();

import Modali, { useModali } from "modali";

import twoDigits from "../helpers/twodigit.js";

import logo_rull from "../assets/logo_rull.png";

const Appointment = props => {

  //INITIAL VALUES
  const initialDate = null,
    initialAppointments = [];

  //STATE HOOKS ----
  const [date, setDate] = useState(initialDate);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [bookInfo, setBookInfo] = useState({ id: null, available: false });
  const [userAppointments, setUserAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandContact, setExpandContact] = useState(false);

  //Modali Hooks (for modals)
  const [confirmModal, toggleConfirmModal] = useModali({
    animated: true,
    centered: true,
    buttons: [
      <Modali.Button
        label="Volver"
        isStyleCancel
        onClick={() => toggleConfirmModal()}
      />,
      <Modali.Button
        label="Confirmar"
        isStyleDefault
        onClick={async () => {
          await bookDate(bookInfo.id, bookInfo.available);
          toggleConfirmModal();
        }}
      />
    ],
    title: "Reservar Cita"
  });
  const [cancelModal, toggleCancelModal] = useModali({
    animated: true,
    centered: true,
    buttons: [
      <Modali.Button
        label="Volver"
        isStyleCancel
        onClick={() => toggleCancelModal()}
      />,
      <Modali.Button
        label="Confirmar"
        isStyleDefault
        onClick={async () => {
          await bookDate(bookInfo.id, bookInfo.available);
          toggleCancelModal();
        }}
      />
    ],
    title: "Cancelar Cita"
  });
  const [unavailableModal, toggleUnavailableModal] = useModali({
    animated: true,
    centered: true,
    title: "No disponible",
    buttons: [
      <Modali.Button
        label="Entendido"
        isStyleDefault
        onClick={() => {
          toggleUnavailableModal();
        }}
      />
    ]
  });
  const [consentModal, toggleConsentModal] = useModali({
    animated: true,
    centered: false,
    buttons: [
      <Modali.Button
        label="No, Gracias"
        isStyleCancel
        onClick={ async () => {
          await props.campaignService.removeUser({id: props.user._id})
          await props.handleLogout()
        }
        }
      />,
      <Modali.Button
        label="De acuerdo"
        isStyleDefault
        onClick={async () => {
          await props.authService.consent({_id: props.user._id, consent: true})
          toggleConsentModal();
        }}
      />
    ],
    title: "Antes de entrar..."
  })

  // CUSTOM METHODS
  const dateChangeHandler = e => {
    setDate(e[0]);
  };

    // for the menu
  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const bookDate = (id, available) => {
    const userId = props.user._id;
    const activeCampaign = props.user.activeCampaign
    const postData = { id, userId, available, activeCampaign };
    const slotIndex = appointments.findIndex(
      appointment => appointment._id === id
    );
    props.appointmentService
      .book(postData)
      .then(result => { //Updating selected day's Appointments State
        if (date) {
        const newAppointments = [...appointments];
        newAppointments[slotIndex].customer = available ? userId : null;
        setAppointments(newAppointments);
        }
      })
      .then(() => { //Updating user's Appointments State
        props.appointmentService
          .getByUser(props.user._id)
          .then((result) => setUserAppointments([...result.data]))
      })
      .then(() => { //Launching toastify notification
        notify(slotIndex, available);
      })
      .catch(err =>
        console.error("there was an error fetching the data ", err)
      );
  };

  // TOASTIFY METHOD
  const notify = (slotIndex, available) =>
    toast(
      available
        ? "✔️  Cita reservada para las " +
            new Date(appointments[slotIndex].time).getHours() +
            ":" +
            twoDigits(new Date(appointments[slotIndex].time).getMinutes())
        : "❎ Cita cancelada"
    );

  // EFFECT HOOK(S)
  useEffect(() => {  //ON DATE CHANGE
    let isSubscribed = true;
    if (date !== null) {
      const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      const dateStr = `${year}-${month}-${day}`;
      if (isSubscribed) {
      setIsLoading(true)
      props.appointmentService
        .get(dateStr)
        .then(result => setAppointments(result.data))
        .then(() => setIsLoading(false))
        .catch(err => {
          console.error("Error during appointment retrieval", err);
          setIsLoading(false);
        });
      }
    }
    return () => isSubscribed = false;
  }, [date]);

  useEffect( () => { //LOAD USER APPOINTMENTS ON MOUNT and consent MODAL
    let isSubscribed = true;
      if (isSubscribed) {
        props.appointmentService
          .getByUser(props.user._id)
          .then((result) => {
              setUserAppointments([...result.data])
          })
        .then(() => {
          if (props.user.consent === null){
          toggleConsentModal()
          } else if (props.user.consent === false) {
            props.handleLogout()
          }
        })
      }
    return () => isSubscribed = false;
  }, [])
  

  //RETURN (render)
  return (
   <> 
    <Menu 
      isOpen={menuOpen}
      onStateChange={(state) => handleStateChange(state)}
    >
        <Link onClick={() => closeMenu()} to="/appointments">Citas</Link>
        <Link onClick={() => closeMenu()} to="/profile">Perfil de Usuario</Link>
        <button onClick={ async () => {
          await props.handleLogout() //this is important to avoid race between handleLogout and closeMenu
          closeMenu()}
        }>Desconectar</button>
    </Menu>
    <div className="appointments-main">
    { (userAppointments
        .filter(appointment => //filtering overdue appointments 
          new Date(appointment.time).getTime() > new Date().getTime()) 
        .length > 0) &&
      <div className="user-appointments-container">
        <h1 className="user-appointments-title" >¡Enhorabuena!</h1>
        {userAppointments
          .filter(appointment => //filtering overdue appointments
            new Date(appointment.time).getTime() > new Date().getTime()) 
          .map(appointment => ({
            available: false,
            duration: appointment.duration,
            date: new Date(appointment.time),
            id: appointment._id,
            bookedFor: appointment.customer
          }))
          .map(({available, date, duration, id, bookedFor}, index) => {
            return (
              <div key={index} className="user-appointment">
                <div className="appointment-details">
                  <h2>Cita Reservada</h2>
                  <p>
                  {"Para el "}
                  {date &&
                    date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <p>
                  {"A las "}
                  {date &&
                    date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit"
                    }) 
                  }
                  </p>
                  <p>En Clínica Rull - Sevilla</p>
                  <p>Duración: {duration} min</p>
                  <p className="expand-contact" onClick={()=>setExpandContact(!expandContact)}>datos de contacto {expandContact ? "\u25b2" : "\u25bc"}</p>
                  {  
                      expandContact && 
                    <div className="contact-details">
                      <p className="address">Av. San Francisco Javier, 13 (local)</p>
                      <p className="address">41005 - Sevilla</p>
                      <a href="tel:+34954530070">{"\uD83D\uDCDE"} 954 530 070</a>
                      <a href="mailto:sevilla@clinicatull.com">{"\uD83D\uDCEC"} sevilla@clinicarull.com</a>
                    </div>
                  }
                </div>
                <button
                  onClick = { 
                      () => { 
                            setBookInfo({
                              id,
                              available,
                              hour:
                                date.getHours() + ":" + twoDigits(date.getMinutes()),
                              date
                            });
                            toggleCancelModal();
                      }
                    }
                  className="cancel-user-appointment"
                >
                  Cancelar Cita
                </button>
              </div>
            )
          }
        )}

          <button 
            className="exit-button" 
            onClick={props.handleLogout}
          >
            Terminar y Salir
          </button>
        </div>
    }
    {
      (userAppointments
        .filter(appointment => //filtering overdue appointments 
          new Date(appointment.time).getTime() > new Date().getTime()) 
        .length <= 0) &&
        <div className="top-container">
            <div className="appointments-title">
              <img className="top-logo" src={logo_rull} alt="logo"/>
              <h2>Nueva Cita</h2>
              { !date && <p> Seleccionar fecha: </p>}
            </div>
            <Flatpickr
          options={{ 
            dateFormat: 'd-m-Y',
            disableMobile: true,
            locale: Spanish,
            minDate: 'today',
            altInput: true,
            altFormat: "F j, Y"
          }}
          className="appointments-flatpickr"
          placeholder="pulse aquí..."
          onChange={e => dateChangeHandler(e)}
            />
            <h2 className="appointments-date">
            {date &&
              date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            {(appointments.length > 0 && date) ? 
                <p>Por favor, seleccione una hora</p>
            :   date && <p>No hay citas previstas para este día, por favor, escoja otro</p>
            }
            </h2>
        </div>
    }
        { (appointments.length > 0) ?
          (userAppointments
        .filter(appointment => //filtering old dates 
          new Date(appointment.time).getTime() > new Date().getTime()) 
        .length <= 0) &&
          <div className="appointments-grid">
            {appointments
            .map(appointment => ({
              date: new Date(appointment.time),
              available: appointment.customer === null,
              id: appointment._id,
              bookedFor: appointment.customer
            })).sort((a,b) => a.date.getHours()-b.date.getHours())
            .map(({ date, available, id, bookedFor }, index) => (
              <button
                className={
                  (props.user._id === bookedFor || !bookedFor ) ? (
                  available ? "appointment-item available" : "appointment-item"
                  ) : "appointment-item unavailable"
                }
                idx={id}
                key={index}
                onClick={() => {
                  if (available || props.user._id === bookedFor) {
                    if (available) {
                      setBookInfo({
                        id,
                        available,
                        hour:
                          date.getHours() + ":" + twoDigits(date.getMinutes()),
                        date
                      });
                      toggleConfirmModal();
                    } else {
                      setBookInfo({
                        id,
                        available,
                        hour:
                          date.getHours() + ":" + twoDigits(date.getMinutes()),
                        date
                      });
                      toggleCancelModal();
                    }
                  } else {
                    setBookInfo({
                      id,
                      available,
                      hour:
                        date.getHours() + ":" + twoDigits(date.getMinutes()),
                      date
                    });
                    toggleUnavailableModal();
                  }
                }}
              >
                {date.getHours()}
                {":"}
                {twoDigits(date.getMinutes())}
              </button>
            ))}
          </div>
            : isLoading && <Spinner />
        }
      <Modali.Modal {...confirmModal}>
        <div className="modal-text">
          <p>
            Desea reservar cita para el{" "}
            {bookInfo.date &&
              bookInfo.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
            a las {bookInfo.hour && bookInfo.hour}?
          </p>
        </div>
      </Modali.Modal>
      <Modali.Modal {...cancelModal}>
        <div className="modal-text">
          <p>
            Desea cancelar su cita prevista para el{" "}
            {bookInfo.date &&
              bookInfo.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
            a las {bookInfo.hour && bookInfo.hour}?
          </p>
        </div>
      </Modali.Modal>
      <Modali.Modal {...unavailableModal}>
        <div className="modal-text">
          <p>
            La cita para el{" "}
            {bookInfo.date &&
              bookInfo.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
            a las {bookInfo.hour && bookInfo.hour} no está disponible.
          </p>
        </div>
      </Modali.Modal>
      <Modali.Modal {...consentModal}>
        <div className="modal-text">
          <p>
          Bienvenido {props.user.name}!
          </p>
          <br/>
          <p>
            {"Como paciente de la \"Clínica Rull\" queremos mejorar tu experiencia con nosotros ofreciéndote servicios de cita online, recordatorios e información que sea de tu interés."}
          </p>
          <br/>
          <p>
            {"Puedes modificar/borrar tus datos en la sección <Mi Perfil>. Por favor, marca la opcion deseada a continuación:"}
          </p>
        </div>
      </Modali.Modal>
    </div>
  </>
  );
};

export default Appointment;
