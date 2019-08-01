import React, { useState, useEffect } from 'react';
import Spinner from "./spinners/Ripple.js";
import twoDigits from "../helpers/twodigit.js";
import groupByDate from "../helpers/groupByDate.js";

const AppointmentsBook = props => {
  const [appointments, setAppointments] = useState([])
  const [groupedAppointments, setGroupedAppointments] = useState({})
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    let isSubscribed = true;
   props.appointmentService
    .getBooked()
    .then(async result => {
         if (isSubscribed) {
          await setAppointments([...result.data])
          setGroupedAppointments(groupByDate([...result.data]))
         }
    })
    .then(() => setIsLoading(false))
    .catch(err => console.error("Error during appointment retrieval", err))
  }, [])

  return isLoading ? 
    (
    <div className="appointments-book-main">
      <Spinner />
    </div>
    ) : (
    <div className="appointments-book-main">
      <div className="book-list">
        <h1>Citas pendientes</h1>
        {appointments
          .map(appointment => ({
          date: new Date(appointment.time),
          available: appointment.customer === null,
          id: appointment._id,
          bookedFor: appointment.customer,
          })
          )
          .map(({ date, available, id, bookedFor }, index) => (
            <div className="appointment-info" key={index}>
            <p>fecha: <br/> {
                date.toLocaleDateString("es-Es",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }
                )}</p>
              <p> {date.toLocaleTimeString("es-Es", 
                {
                  hour: "2-digit",
                  minute: "2-digit"
                }
              )} </p>
              <p>cliente: <br/> {bookedFor.name + " " + bookedFor.surname}</p>
            </div>
          ))
        
        }
      </div>
    </div>
  )
}

export default AppointmentsBook
