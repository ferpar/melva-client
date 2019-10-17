import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Spinner from "./spinners/Ripple.js";
import { slide as Menu } from "react-burger-menu";

const Dashboard = props => {
  const [isLoading, setIsLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen)
  }
  const closeMenu = () => {
    setMenuOpen(false)
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
            <br/>
            <br/>
            <br/>
            <h1>testing...</h1>
          </div>
        )
      }
    </>
    
  )
};

export default Dashboard;
