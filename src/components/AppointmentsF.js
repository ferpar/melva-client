import React, { useState, useEffect } from "react";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/themes/material_green.css";

import Spinner from "./spinners/Ripple.js";

import { toast } from "react-toastify";
toast.configure();

import Modali, { useModali } from "modali";

import twoDigits from "../helpers/twodigit.js";

const Appointment = props => {

  //INITIAL VALUES
  const initialDate = null,
    initialAppointments = [];

  //STATE HOOKS ----
  const [date, setDate] = useState(initialDate);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [bookInfo, setBookInfo] = useState({ id: null, available: false });
  const [userAppointments, setUserAppointments] = useState([]);
  const [firstRender, setFirstRender] = useState(true)

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

  // CUSTOM METHODS
  const dateChangeHandler = e => {
    setDate(e[0]);
  };

  const bookDate = (id, available) => {
    const userId = props.user._id;
    const postData = { id, userId, available };
    const slotIndex = appointments.findIndex(
      appointment => appointment._id === id
    );
    props.appointmentService
      .book(postData)
      .then(result => { //Updating selected day's Appointments State
        const newAppointments = [...appointments];
        newAppointments[slotIndex].customer = available ? userId : null;
        setAppointments(newAppointments);
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
        ? "🦄 Cita reservada para las " +
            new Date(appointments[slotIndex].time).getHours() +
            ":" +
            twoDigits(new Date(appointments[slotIndex].time).getMinutes())
        : "❎ cita cancelada"
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
      props.appointmentService
        .get(dateStr)
        .then(result => setAppointments(result.data))
        .catch(err => console.error("Error during appointment retrieval", err));
      }
    }
    return () => isSubscribed = false;
  }, [date]);

  useEffect(() => { //LOAD USER APPOINTMENTS ON MOUNT
    let isSubscribed = true;
      props.appointmentService
        .getByUser(props.user._id)
        .then((result) => {
          if (isSubscribed) {
            setUserAppointments([...result.data])
          }
        })
    return () => isSubscribed = false;
  }, [])
  

  //RETURN (render)
  return (
    <div className="appointments-main">
    { (userAppointments
        .filter(appointment => //filtering old dates 
          new Date(appointment.time).getTime() > new Date().getTime()) 
        .length > 0) &&
      <div className="user-appointments-container">
        <h2 className="user-appointments-title" >Citas reservadas</h2>
        {userAppointments
          .filter(appointment => //filtering old dates
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
                  <p>
                  {date &&
                    date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }).split(",")[1]}
                  </p>
                  <p>
                  {date &&
                    date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }).split(",")[0]}
                  {' '} 
                  {date &&
                    date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit"
                    }) 
                  }
                  </p>
                  <p>duración: {duration} min</p>
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
                  Cancelar
                </button>
              </div>
            )
          }
          )}
        </div>
    }
    {
      (userAppointments
        .filter(appointment => //filtering old dates 
          new Date(appointment.time).getTime() > new Date().getTime()) 
        .length <= 0) &&
        <div className="top-container">
            <div className="appointments-title">
              <h2>Nueva Cita</h2>
              { !date && <p> Seleccionar fecha: </p>}
            </div>
            <Flatpickr
          options={{ 
            dateFormat: 'd-m-Y',
            locale: Spanish,
            minDate: 'today',
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
                <p>Por favor, seleccione una cita</p>
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
            }))
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
            : date && <Spinner />
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
    </div>
  );
};

export default Appointment;
