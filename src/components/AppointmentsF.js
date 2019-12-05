import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import Spinner from "./spinners/Ripple.js";
import CampaignSelector from "./AppointmentsF/CampaignSelector.js";
import DisplayBooked from "./AppointmentsF/DisplayBooked.js";
import DatePickr from "./AppointmentsF/DatePickr.js";
import AppointmentGrid from "./AppointmentsF/AppointmentGrid.js";

import { toast } from "react-toastify";
toast.configure();

import Modali, { useModali } from "modali";
import * as inner from "./AppointmentsF/Modali/inner.js";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandContact, setExpandContact] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [activeCampaign, setActiveCampaign] = useState(props.user.activeCampaign)
  const [availableCampaigns, setAvailableCampaigns] = 
    useState(props.user.campaignUsers
      .filter( campaignUser => campaignUser.smsStatus != "not-sent")
      .map( 
      campaignUser => campaignUser.campaignId ))
  const [isSelectorOpen, setIsSelectorOpen] = useState(true)

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
    overlayClose: false,
    keyboardClose: false,
    closeButton: false,
    buttons: [
      <Modali.Button
        label="No, Gracias"
        isStyleCancel
        onClick={ async () => {
          await toggleConsentModal();
          await toggleConfirmRemoveModal();
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
  const [confirmRemoveModal, toggleConfirmRemoveModal] = useModali({
    animated: true,
    overlayClose: false,
    keyboardClose: false,
    closeButton: false,
    buttons: [
      <Modali.Button
        label="Volver"
        isStyleCancel
        onClick={ async () => {
          toggleConfirmRemoveModal();
          toggleConsentModal();
        }
        }
      />,
      <Modali.Button
        label="Borrar"
        isStyleDefault
        onClick={async () => {
          await props.campaignService.removeUser({id: props.user._id, blacklist: true})
          await props.handleLogout()   
        }}
      />
    ],
    title: "La privacidad es un derecho"
  })

  // CUSTOM METHODS
  const dateChangeHandler = e => {
    setDate(e[0]);
  };

  const changeActiveCampaignHandler = campaignId => {
    setActiveCampaign(campaignId)
  }

  const handleIsSelectorOpen = () => {
    setIsSelectorOpen(!isSelectorOpen)
  }

    // for the menu
  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const bookDate = (id, available) => {
    const userId = props.user._id;
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
  useEffect(() => {  //ON DATE CHANGE loads available appointments
    let isSubscribed = true;
    if (date !== null) {
      const year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
      const dateStr = `${year}-${month}-${day}`;
      if (isSubscribed) {
      setIsLoading(true)
      props.appointmentService
        .getByDate({dateStr, activeCampaign})
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

  useEffect( () => { //LOAD USER APPOINTMENTS ON MOUNT/CAMPAIGN_CHANGE and consent MODAL
    let isSubscribed = true;
      if (isSubscribed) {
        const loadup = async () => {
          await props.appointmentService
            .getByUser(props.user._id)
            .then((result) => {
                setUserAppointments([...result.data])
            })
          .then(() => {
            setIsMounted(true)
            if (props.user.consent === null){
            toggleConsentModal()
            } else if (props.user.consent === false) {
              props.handleLogout()
            }
          })

          const newAvailableDates = await props.appointmentService
            .getDates({activeCampaign})
          setAvailableDates([...newAvailableDates.data.dates]) 

          setAppointments([]) //emptying to prevent confusion on campaign switch
          setDate(null)       //resetting date as well

        }
        loadup();
      }
    return () => isSubscribed = false;
  }, [activeCampaign])
  

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
    { isMounted ?
      (
        <div className="appointments-main">
          { (
            availableCampaigns
              .filter( campaign => campaign.isActive )
              .length > 1
            ) 
            &&
              <CampaignSelector
                availableCampaigns={availableCampaigns}
                activeCampaign={activeCampaign}
                changeActiveCampaignHandler={changeActiveCampaignHandler}
                handleIsSelectorOpen={handleIsSelectorOpen}
                isSelectorOpen={isSelectorOpen}
              />
          }
          { ( 
              (!isSelectorOpen || 
              availableCampaigns
                .filter(campaign => campaign.isActive)
                .length <= 1) 
              && 
              userAppointments
                .filter(appointment => //only count appointments of the selected / active campaign
                  appointment.campaign === activeCampaign)
                .filter(appointment => //filtering overdue appointments 
                  new Date(appointment.time).getTime() > new Date().getTime()) 
                .length > 0
              ) 
              &&
              <DisplayBooked 
                userAppointments={userAppointments}
                activeCampaign={activeCampaign}
                expandContact={expandContact}
                setExpandContact={setExpandContact}
                setBookInfo={setBookInfo}
                toggleCancelModal={toggleCancelModal}
                handleLogout={props.handleLogout}
              />
          }
          {
            ( 
              (!isSelectorOpen || 
              availableCampaigns
                .filter(campaign => campaign.isActive)
                .length <= 1) 
              && 
              userAppointments
              .filter(appointment => //only count appointments of the selected / active campaign
                appointment.campaign === activeCampaign)
              .filter(appointment => //filtering overdue appointments 
                new Date(appointment.time).getTime() > new Date().getTime()) 
              .length <= 0
            ) 
              &&
              <DatePickr 
                date = {date}
                availableDates={availableDates}
                dateChangeHandler={dateChangeHandler}
                appointments={appointments}
              />
          }
          { (appointments.length > 0) ?
            (userAppointments
          .filter(appointment => //only count appointments of the selected / active campaign
            appointment.campaign === activeCampaign)
          .filter(appointment => //filtering overdue appointments
            new Date(appointment.time).getTime() > new Date().getTime()) 
          .length <= 0) &&
              <AppointmentGrid 
                appointments={appointments}
                user={props.user}
                setBookInfo={setBookInfo}
                toggleCancelModal={toggleCancelModal}
                toggleConfirmModal={toggleConfirmModal}
                toggleUnavailableModal={toggleUnavailableModal}
                date={date}
              />
              : isLoading && <Spinner />
          }
          <Modali.Modal {...confirmModal}>
            <inner.confirmModal bookInfo={bookInfo}/>
          </Modali.Modal>
          <Modali.Modal {...cancelModal}>
            <inner.cancelModal bookInfo={bookInfo}/>
          </Modali.Modal>
          <Modali.Modal {...unavailableModal}>
            <inner.unavailableModal bookInfo={bookInfo}/>
          </Modali.Modal>
          <Modali.Modal {...consentModal}>
            <inner.consentModal username={props.user.name}/>
          </Modali.Modal>
          <Modali.Modal {...confirmRemoveModal}>
            <inner.confirmRemoveModal/>
          </Modali.Modal>
        </div>
      ) : (
        <div className="appointments-main">
          <Spinner /> 
        </div>
      )
    }
  </>
  );
};

export default Appointment;
