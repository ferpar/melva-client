import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Spinner from "./spinners/Ripple.js";
import { slide as Menu } from "react-burger-menu";

import FranchiseForm from "./Dashboard/FranchiseForm.js";

const Dashboard = props => {
  const { franchise } = props.user
  const [isLoading, setIsLoading] = useState(true);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen)
  }
  const closeMenu = () => {
    setMenuOpen(false)
  }
  
  useEffect( () => {
    console.log(props.user)
    setIsLoading(false)
  }, [])

  return (
    <>
      <Menu 
        isOpen={menuOpen}
        onStateChange={(state) => handleStateChange(state)}
      >
          <Link onClick={() => closeMenu()} to="/appointments-book">Citas Pendientes</Link>
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
        ) : (<>{ franchise ? (
            <div className="appointments-book-main">
              <h1>testing...</h1>
            </div>
          ) : ( 
            <div className="franchise-config">
            { isConfiguring ? 
              <FranchiseForm/>
              : (
                <>
              <p>Empezemos por introducir los datos de tu franquicia</p>
              <button onClick={() => setIsConfiguring(true)}>comenzar</button>
                </>
              )}
            </div>
          )
          }</>)
      }
    </>
    
  )
};

export default Dashboard;
