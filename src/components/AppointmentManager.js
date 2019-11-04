import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import "./AppointmentManager/Appointmentmanager.css";

import { slide as Menu } from "react-burger-menu";

import { toast } from "react-toastify";
toast.configure();

import CampaignSelect from "./AppointmentManager/CampaignSelect.js";
import Scheduler from "./AppointmentManager/Scheduler.js";
import MyCalendar from "./AppointmentManager/Calendar.js";

const AppointmentManager = props => {

  const franchise = props.user.franchise;
  const { campaigns } = props.user.franchise;

  //----local State
  const [location, setLocation] = useState("")
  const [campaign, setCampaign] = useState("")
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [events, setEvents] = useState([])
  //--------------
  
  // TOASTIFY METHOD
  const notifyCreate = (appointment) => {
    const notifyDateTime = new Date(appointment.time)
    toast(
         "✔️  Cita Creada para el " 
          + notifyDateTime.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
          + ", a las:" 
          + notifyDateTime.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
    )};
  //--------------
  
  //----Handlers
  const handleSetLocation = e => {
    const selectedLocation = e.target.value
    setLocation(selectedLocation)
    setFilteredCampaigns(campaigns.filter( campaign => {
      return campaign.location === selectedLocation
    }))
  }

  const handleSetCampaign = e => {
    const selectedCampaign = e.target.value
    setCampaign(selectedCampaign)
  }

  const handleAppointments = async () => {
    if (campaign) {
      console.log(campaign)
      const appointments = await props.appointmentService.getCampaignAppointments({campaign})
      console.log(appointments.data)
      const eventsToLoad = appointments.data.map( (appointment,ind) => {
        const {time, duration} = appointment
        const { title } = appointment.campaign
        return {
          start: new Date(moment.tz(time, "Europe/Madrid")),
          end: new Date(moment.tz(time, "Europe/Madrid").add(duration, 'm')),
          title: title
        }
      })
      console.log(eventsToLoad)
      setEvents(eventsToLoad)
    } else {
      console.log("no campaign selected")
    }
  }
  //------------

  //---Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };
  //-------
  
  //---LifeCycle
  useEffect( () => {
    async function fetchAppointments() {
        return await handleAppointments()
    }
    let isSubscribed = true;
    if (isSubscribed) {
      fetchAppointments();
    }
    return () => isSubscribed = false;
  }, [campaign])
  //------------

  return (
    <>
      <Menu isOpen={menuOpen} onStateChange={state => handleStateChange(state)}>
        <Link onClick={() => closeMenu()} to="/appointments-book">
          Citas Pendientes
        </Link>
        <Link onClick={() => closeMenu()} to="/campaigns">
          Gestor de Campañas
        </Link>
        <Link onClick={() => closeMenu()} to="/dashboard">
          Panel de Control
        </Link>
        <button
          onClick={async () => {
            await props.handleLogout(); //this is important to avoid race between handleLogout and closeMenu
            closeMenu();
          }}
        >
          Desconectar
        </button>
      </Menu>

      <div className="manager-container">
        <div className="campaign-select">
          <CampaignSelect 
            franchise={franchise}
            filteredCampaigns={filteredCampaigns}
            handleSetLocation={handleSetLocation}
            handleSetCampaign={handleSetCampaign}
          />
        </div>
        <div className="scheduler">
          <Scheduler
            location={location}
            campaign={campaign}
            franchise={franchise}
            appointmentService={props.appointmentService}
            handleAppointments={handleAppointments}
            notifyCreate={notifyCreate}
          />
        </div>
        <div className="my-calendar">
          <MyCalendar
            campaign={campaign}
            events={events}
          />
        </div>
      </div>
    </>
  );
};

export default AppointmentManager;
