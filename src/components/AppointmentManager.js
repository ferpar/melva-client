import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import "./AppointmentManager/Appointmentmanager.css";

import { slide as Menu } from "react-burger-menu";

import { toast } from "react-toastify";
toast.configure();

import Modali, { useModali } from "modali";

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
  const [removeSwitch, setRemoveSwitch] = useState(false)
  const [appointmentInfo, setAppointmentInfo] = useState({})
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
  
  //Modali Hooks
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
          console.log("removed Appointment")
          handleForceRemoveSingleAppointment({
            appointmentId: appointmentInfo.appointmentId,
                campaignId: appointmentInfo.campaignId,
                patientId: appointmentInfo.patientId})
          toggleConfirmModal();
        }}
      />
    ],
    title: "Borrar Cita"
  })

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

  const handleRemoveSingleAppointment = async (event) => {

    const {appointmentId, campaignId, patientId, patient} = event
    let forceRemoveOption = false

    setAppointmentInfo ({
      appointmentId, campaignId, patientId, patient
    }) //saving info for the case of force removing

    if (patientId) {
      toggleConfirmModal()  
    } else {
      const removedAppointment = await props.appointmentService.remove(
        {
          appointmentsToRemove : [
            {appointmentId, campaignId, patientId}
          ],
            forceRemove: forceRemoveOption
        }
      )
    }
    await handleAppointments()
  }

  const handleForceRemoveSingleAppointment = async (appointmentInfo) => {
    const {appointmentId, campaignId, patientId} = appointmentInfo;
    let forceRemoveOption = true

    const removedAppointment = await props.appointmentService.remove(
      {
        appointmentsToRemove: [
          {appointmentId, campaignId, patientId}
        ],
        forceRemove: forceRemoveOption
      }
    )
    await handleAppointments()
  }

  const handleAppointments = async () => {
    if (campaign) {
      const appointments = await props.appointmentService.getCampaignAppointments({campaign})
      const eventsToLoad = appointments.data.map( (appointment,ind) => {
        const {time, duration, customer, _id} = appointment
        const { title } = appointment.campaign
        return {
          start: new Date(moment.tz(time, "Europe/Madrid")),
          end: new Date(moment.tz(time, "Europe/Madrid").add(duration, 'm')),
          title: title,
          customer: customer ? customer.name : null,
          removeActive: removeSwitch,
          handleRemoveAppointment: () => handleRemoveSingleAppointment(
            {
              patientId: customer ? customer._id : null,
              appointmentId: _id, 
              campaignId: appointment.campaign._id,
              patient: customer ? customer : null,
            }
          )
        }
      })
      setEvents(eventsToLoad)
    } else {
      console.log("no campaign selected")
    }
  }

  const handleRemoveSwitch = () => {
    setRemoveSwitch(!removeSwitch)
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
  }, [campaign, removeSwitch])
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
            removeSwitch={removeSwitch}
            handleRemoveSwitch={handleRemoveSwitch}
          />
        </div>
        <div className="my-calendar">
          <MyCalendar
            campaign={campaign}
            events={events}
          />
        </div>
      </div>
      <Modali.Modal {...confirmModal}>
        <div className="modal-text">
          <p>
            La cita está reservada por: 
          </p>
          <br/>
          <p>
            <strong>{ (Object.keys(appointmentInfo).length) > 0 && ( appointmentInfo.patinet && appointmentInfo.patient.name + " " +  appointmentInfo.patient.surname)}</strong>
            <br/>
            teléfono: <strong>{(Object.keys(appointmentInfo).length > 0) && appointmentInfo.patient && appointmentInfo.patient.phone}</strong>
          </p>
          <br/>
          <p>
            Desea aún así eliminarla ?
          </p>
        </div>
      </Modali.Modal>
    </>
  );
};

export default AppointmentManager;
