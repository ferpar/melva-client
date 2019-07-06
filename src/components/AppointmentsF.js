import React, { useState, useEffect } from "react";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

import { toast } from "react-toastify";
toast.configure();

import Modali, { useModali } from 'modali';

import twoDigits from "../helpers/twodigit.js";

const Appointment = (props) => {

  const initialDate = null, initialAppointments = [];
  const [date , setDate] = useState(initialDate);
  const [appointments, setAppointments] = useState(initialAppointments);
  
  const [firstModal, toggleFirstModal] = useModali({
    animated: true,
    centered: true
  });
  const [bookInfo, setBookInfo] = useState({id: null, available: false});

  const dateChangeHandler = e => {
   setDate( e[0] );
  }

  
  const bookDate = (id, available) => {
    const userId = available ? props.user._id : null;
    const postData = { id, userId };
    const slotIndex = appointments.findIndex(
      appointment => appointment._id === id
    );
    props.appointmentService
      .book(postData)
      .then(result => {
        const newAppointments = [...appointments];
        newAppointments[slotIndex].customer = userId;
        setAppointments( newAppointments );
      })
      .then(() => {
          notify(slotIndex, available);
        })
      .catch(err => console.log("there was an error fetching the data ", +err));
  };

  
  const notify = (slotIndex, available) =>
    toast(
      available
        ? "🦄 wow so ez! booked appointment @" +
            new Date(appointments[slotIndex].time).getHours() +
            ":" +
            twoDigits(
              new Date(appointments[slotIndex].time).getMinutes()
            )
        : "❎ booking canceled"
    );

  useEffect(()=>{
    if (date !== null) {
    const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    const dateStr = `${year}-${month}-${day}`;
      props.appointmentService
        .get(dateStr)
        .then(result =>
          setAppointments(result.data)
        )
        .catch(err => console.error("Error during appointment retrieval", err));
    }
  },
  [date]
  )

    return (
      <div className="appointments-main">
        <div className="top-container">
          <h2>choose a Date</h2>
          <Flatpickr onChange={e => dateChangeHandler(e)} />
          <h2>{date && date.toDateString()}</h2>
        </div>
        <div className="appointments-grid">
          {appointments &&
            appointments
              .map(appointment => ({
                date: new Date(appointment.time),
                available: appointment.customer === null,
                id: appointment._id
              }))
              .map(({ date, available, id }, index) => (
                <button
                  className={
                    available
                      ? "appointment-item available"
                      : "appointment-item"
                  }
                  idx={id}
                  key={index}
                  onClick={() => {
                    setBookInfo({id, available})
                    toggleFirstModal()
                    }
                  }
                >
                  {date.getHours()}
                  {":"}
                  {twoDigits(date.getMinutes())}
                </button>
              ))}
        </div>
            <Modali.Modal {...firstModal}>
              <p>{bookInfo.available ? "Please confirm your booking" : "Confirm cancelation" }</p>
              <button onClick={() =>{
                  bookDate(bookInfo.id, bookInfo.available)
                  toggleFirstModal()
              }}> 
                Confirm
              </button>
            </Modali.Modal>
      </div>
    );
}

export default Appointment;
