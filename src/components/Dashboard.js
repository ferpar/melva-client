import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard/Dashboard.css";

import Spinner from "./spinners/Ripple.js";
import { slide as Menu } from "react-burger-menu";

import FranchiseForm from "./Dashboard/FranchiseForm.js";
import IntroMsg from "./Dashboard/IntroMsg.js";
import FranchiseInfo from "./Dashboard/FranchiseInfo.js";
import Locations from "./Dashboard/Locations.js";
import CampaignsList from "./Dashboard/CampaignsList.js";
import Employees from "./Dashboard/Employees.js";

const Dashboard = props => {
  const { franchise } = props.user
  const [isLoading, setIsLoading] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen)
  }
  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleIsConfiguring = () => {
    setIsConfiguring(!isConfiguring)
  }
  
  const handleIsEditing = () => {
    setIsEditing(!isEditing)
  }

  useEffect( () => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <Menu 
        isOpen={menuOpen}
        onStateChange={(state) => handleStateChange(state)}
      >
          <Link onClick={() => closeMenu()} to="/appointments-book">Citas Pendientes</Link>
          <Link onClick={() => closeMenu()} to="/appointments-manager">Gestor de Citas</Link>
          <Link onClick={() => closeMenu()} to="/campaigns">Gestor de Campañas</Link>
          <Link onClick={() => closeMenu()} to="/analytics">Plataforma de Pacientes</Link>
          <button onClick={ async () => {
            await props.handleLogout() //this is important to avoid race between handleLogout and closeMenu
            closeMenu()}
          }>Desconectar</button>
      </Menu>

      { isLoading ? 
        (
          <div className="franchise-container">
            <Spinner />
          </div>
        ) : (<>{ franchise ? (
            <div className="franchise-container">
            { isEditing ? (
              <FranchiseForm
                user={props.user}
                handleLogin={props.handleLogin}
                franchiseService={props.franchiseService}
                handleIsEditing={handleIsEditing}
                handleIsConfiguring={handleIsConfiguring}
              />
            ) : (
              <>
              <div className="franchise-info">
                <FranchiseInfo
                  franchise={franchise}
                  handleIsEditing={handleIsEditing}
                />
              </div>
              <div className="locations">
                <Locations
                  franchise={franchise}
                  franchiseService={props.franchiseService}
                /> 
              </div>
              <div className="campaigns-list">
                <CampaignsList
                  franchise={franchise}
                />
              </div>
              <div className="employees">
                <Employees
                  franchise={franchise}
                  authService={props.authService}
                />
              </div>
              </>
            )
            }
            </div>
          ) : ( 
            <div className="franchise-container">
            { isConfiguring ? 
              <FranchiseForm
                user = {props.user}
                handleLogin = {props.handleLogin}
                franchiseService = {props.franchiseService}
                handleIsEditing={handleIsEditing}
                handleIsConfiguring={handleIsConfiguring}
              />
              : (
                <IntroMsg handleIsConfiguring={handleIsConfiguring}/>
              )}
            </div>
          )
          }</>)
      }
    </>
    
  )
};

export default Dashboard;
