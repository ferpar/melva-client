import React, { useState, useEffect } from "react";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

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
        onClick={() => {
          bookDate(bookInfo.id, bookInfo.available);
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
        onClick={() => {
          bookDate(bookInfo.id, bookInfo.available);
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
    if (date !== null) {
      const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      const dateStr = `${year}-${month}-${day}`;
      props.appointmentService
        .get(dateStr)
        .then(result => setAppointments(result.data))
        .catch(err => console.error("Error during appointment retrieval", err));
    }
  }, [date]);

  useEffect(() => { //LOAD USER APPOINTMENTS ON MOUNT
      props.appointmentService
        .getByUser(props.user._id)
        .then((result) => setUserAppointments([...result.data]))
  }, [])

  //RETURN (render)
  return (
    <div className="appointments-main">
      {console.log(userAppointments)}
      <div className="user-appointments-container">
        <h2 className="user-appointments-title" >Citas reservadas</h2>
        {userAppointments
          .map(appointment => ({
            duration: appointment.duration,
            date: new Date(appointment.time),
            id: appointment._id,
            bookedFor: appointment.customer
          }))
          .map(({date, duration, id, bookedFor}, index) => {
          return (
            <div key={index} className="user-appointment">
              <p>
              {date &&
                date.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
            </p>
              <p>duración: {duration}</p>
            </div>
          )
        }
        )}
      </div>
      <div className="top-container">
        <h2 className="appointments-title">Seleccione una fecha</h2>
        <Flatpickr
          className="appointments-flatpickr"
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
        </h2>
      </div>
      <div className="appointments-grid">
        {appointments &&
          appointments
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
