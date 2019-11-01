import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./AppointmentsBook/AppointmentsBook.css";

import Spinner from "./spinners/Ripple.js";
import twoDigits from "../helpers/twodigit.js";
import groupByDate from "../helpers/groupByDate.js";

import {slide as Menu} from "react-burger-menu";

import BookingList from "./AppointmentsBook/BookingList.js";
import LocationSelector from "./AppointmentsBook/LocationSelector.js";

const AppointmentsBook = props => {
  const [appointments, setAppointments] = useState([])
  const [groupedAppointments, setGroupedAppointments] = useState({})
  const [ isLoading, setIsLoading ] = useState(true)

  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState("")

  const handleSelectLocation = locationId => {
    console.log(locationId)
    setSelectedLocation(locationId)

    const filteredAppointments = 
      locationId 
      ? appointments.filter( appointment => appointment.location === locationId)
      : appointments

    console.log("handleSelectLocation")
    setGroupedAppointments(groupByDate([...filteredAppointments]))
  }

  const handleSelectCampaign = campaignId => {
    console.log(campaignId)
    setSelectedCampaign(campaignId)

    const filteredAppointments = 
      campaignId
      ? appointments
          .filter( appointment => appointment.location === selectedLocation)
          .filter( appointment => appointment.campaign === campaignId)
      : appointments
          .filter( appointment => appointment.location === selectedLocation)

    console.log("handleSelectCampaign")
    console.log(filteredAppointments)
    setGroupedAppointments(groupByDate([...filteredAppointments]))
  }


  //---Menu
  const [menuOpen, setMenuOpen] = useState(false)

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }
  //-------

  useEffect(() => {
    let isSubscribed = true;
   props.appointmentService
    .getBooked()
    .then(async result => {
         if (isSubscribed) {
           await setAppointments([...result.data])
       //    if (result.data) {
       //     //filtering here to show all appointments of the first location by default
       //      const filteredAppointments = 
       //       result.data
       //        .filter(appointment => appointment.location === props.user.franchise.locations[0]._id)
       //     setGroupedAppointments(groupByDate([...filteredAppointments]))
       //    }
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
        <LocationSelector 
          locations={props.user.franchise.locations}
          handleSelectLocation={handleSelectLocation}
          handleSelectCampaign={handleSelectCampaign}
          campaigns={props.user.franchise.campaigns}
          selectedLocation={selectedLocation}
        />
        <BookingList
          groupedAppointments = { groupedAppointments }
        />
      </div>
      )}
    </>
  )
}

export default AppointmentsBook
