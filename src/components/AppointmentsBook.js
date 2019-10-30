import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./AppointmentsBook/AppointmentsBook.css";

import Spinner from "./spinners/Ripple.js";
import twoDigits from "../helpers/twodigit.js";
import groupByDate from "../helpers/groupByDate.js";

import {slide as Menu} from "react-burger-menu";

import BookingList from "./AppointmentsBook/BookingList.js";

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
          <Link onClick={() => closeMenu()} to="/appointments-manager">Gestor de Citas</Link>
          <Link onClick={() => closeMenu()} to="/campaigns">Gestor de Campañas</Link>
          <Link onClick={() => closeMenu()} to="/dashboard">Panel de Control</Link>
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
        <BookingList
          groupedAppointments = { groupedAppointments }
        />
      </div>
      )}
    </>
  )
}

export default AppointmentsBook
