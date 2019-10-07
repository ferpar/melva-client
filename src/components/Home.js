import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import {slide as Menu} from "react-burger-menu";

import logo_rull from "../assets/logo_rull.png";

const Home = ({
  handleLogin,
  handleLogout,
  authService
}) => {
  
  const [menuOpen, setMenuOpen] = useState(false)

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }
  
  return (
   <> 
    <Menu 
      isOpen={menuOpen}
      onStateChange={(state) => handleStateChange(state)}
    >
        <Link onClick={() => closeMenu()} to="/login">Acceso Gestión</Link>
    </Menu>
    <div className="home-wrapper">
      <div className="home-container">
        <div className="form-wrapper">
          <img className="top-logo" src={logo_rull} alt="logo"/>
          <h1 className="main title">¡Gracias por su visita!</h1>
        </div>
      </div>
    </div>
  </>
)
};


export default withRouter(Home);
