import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from "./spinners/Ripple.js";
import twoDigits from "../helpers/twodigit.js";
import groupByDate from "../helpers/groupByDate.js";

import {slide as Menu} from "react-burger-menu";

const AppointmentsBook = props => {
  const [appointments, setAppointments] = useState([])
  const [groupedAppointments, setGroupedAppointments] = useState({})
  const [ isLoading, setIsLoading ] = useState(true)

  const [menuOpen, setMenuOpen] = useState(false)

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

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

  return (
   
    <>
      <Menu 
        isOpen={menuOpen}
        onStateChange={(state) => handleStateChange(state)}
      >
          {console.log(appointments)}{ console.log(groupedAppointments)}
          <Link onClick={() => closeMenu()} to="/campaigns">Gestor de campañas</Link>
          <button onClick={ async () => {
            await props.handleLogout() //this is important to avoid race between handleLogout and closeMenu
            closeMenu()}
          }>Desconectar</button>
      </Menu>
      { isLoading ? 
      (
      <div className="appointments-book-main">
        <Spinner />
      </div>
      ) : (
      <div className="appointments-book-main">
        <div className="book-list">
          <h1>Citas pendientes</h1>
            <div className="booking-grid">
          { Object.keys(groupedAppointments).map( (day, index) => (

            <div key={index}>
            <h2 className="book-list-day">{day}</h2>
              {
              groupedAppointments[day]
              .map(appointment => ({
              date: new Date(appointment.time),
              available: appointment.customer === null,
              id: appointment._id,
              bookedFor: appointment.customer,
              updated: new Date(appointment.updated_at)
              })
              )
              .sort( (a,b) => a.date.getHours() - b.date.getHours())
              .map(({ date, available, id, bookedFor, updated }, index) => (
                <div className="appointment-info" key={index}>
                  <p>{bookedFor.name + " " + bookedFor.surname}</p>
                  <p>hora:  {date.toLocaleTimeString("es-Es", 
                    {
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )} </p>
                  {(new Date() - updated <= 3600*1000*12)
                    && <span className="ball"></span>}
                  {(new Date() - updated <= 3600*1000*12) 
                    && <p>Hace {parseInt((new Date() - updated) / 1000 / 3600)} horas</p>}
                </div>
              ))
              
              }
            </div>

          ))
          
          }
        </div>
        </div>
      </div>
      )}
    </>
  )
}

export default AppointmentsBook
