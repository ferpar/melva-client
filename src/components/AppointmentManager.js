import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AppointmentManager/Appointmentmanager.css";

import { slide as Menu } from "react-burger-menu";

import CampaignSelect from "./AppointmentManager/CampaignSelect.js";
import Scheduler from "./AppointmentManager/Scheduler.js";
import Calendar from "./AppointmentManager/Calendar.js";

const AppointmentManager = props => {

  const franchise = props.user.franchise;
  const { campaigns } = props.user.franchise;

  const [location, setLocation] = useState("")
  const [campaign, setCampaign] = useState("")
  const [filteredCampaigns, setFilteredCampaigns] = useState([])

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

  //---Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };
  //-------

  return (
    <>
      <Menu isOpen={menuOpen} onStateChange={state => handleStateChange(state)}>
        <Link onClick={() => closeMenu()} to="/appointments-book">
          Citas Pendientes
        </Link>
        <Link onClick={() => closeMenu()} to="/campaigns">
          Gestor de campañas
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
        <CampaignSelect 
          franchise={franchise}
          filteredCampaigns={filteredCampaigns}
          handleSetLocation={handleSetLocation}
          handleSetCampaign={handleSetCampaign}
        />
        <Scheduler
          location={location}
          campaign={campaign}
          appointmentService={props.appointmentService}
        />
        <Calendar/>
      </div>
    </>
  );
};

export default AppointmentManager;
