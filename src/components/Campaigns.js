import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import translateToGSM from "../helpers/translateToGSM.js";

const CampaignManager = props => {

  // == Main Form ==
  const [message, setMessage] = useState("")
  const [showGSM, setShowGSM] = useState(false)

  const handleMsgChange = e => {
    setMessage(e.target.value);
  }

  const handleClickGSM = e => {
    e.preventDefault();
    setShowGSM(prevState => !prevState);
  }

  const handleSubmit = e => {
    e.preventDefault();
    console.log(recipients)
    console.log(message)
  }

  // ====

  // == SubForm ==
  const [recipients, setRecipients] = useState([])
  const [customer, setCustomer] = useState({name: "", surname: "", phone: ""})

  const handleAddUser = e => {
    e.preventDefault();
    setRecipients(prevRecipients => [...prevRecipients, customer])
  }

  const handleUserChange = e => {
    console.log(e.target)
    console.log(e.target.value)
    console.log(e.target.name)
    const {name, value} = e.target
    setCustomer(prevCustomer => ({...prevCustomer, [name] : value}))
  }

  // ====

  // == Menu state and logic ==
  const [menuOpen, setMenuOpen] = useState(false)

  const handleStateChange = (state) => {
    setMenuOpen(state.isOpen)  
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  // =====

  return (
   
    <>
      <Menu 
        isOpen={menuOpen}
        onStateChange={(state) => handleStateChange(state)}
      >
          <Link onClick={() => closeMenu()} to="/appointments-book">Citas Pendientes</Link>
          <button onClick={ async () => {
            await props.handleLogout() //this is important to avoid race between handleLogout and closeMenu
            closeMenu()}
          }>
          Desconectar
          </button>
      </Menu>
      <div className="appointments-book-main">
        <div className="book-list">
          <h1>Campañas</h1>
          <form>
            <div className="textarea-container">
              <textarea onChange={e => handleMsgChange(e)} placeholder="Introduzca contenido del SMS..." value={message}/>
              <div className="errors"></div>
              { showGSM && <textarea readOnly value={translateToGSM(message)}/> }
              <div className="campaign-buttons">
                <button className="submit" onClick={e => handleSubmit(e)} type="submit">Enviar mensajes</button>
                <button className="expand" onClick={e => handleClickGSM(e)}>{ showGSM ? "Ocultar" : "Vista Previa"} </button>
              </div>
            </div>
            <div className="list-container">
              <label htmlFor="name">nombre</label>
              <input className="add-name" name="name" onChange={e => handleUserChange(e)} id="name" type="text" value={customer.name}/>
              <label htmlFor="surname">apellidos</label>
              <input className="add-surname" name="surname" onChange={e => handleUserChange(e)} id="surname" type="text" value={customer.surname}/>
              <label htmlFor="phone">teléfono</label>
              <input className="add-phone" name="phone" onChange={e => handleUserChange(e)} id="phone" type="phone" value={customer.phone}/>
              <button onClick={e => handleAddUser(e)} >Añadir</button>
              <div className="customers-container">
                <ul className="customers-list">
                  {recipients.map( (recipient,i) => (
                    <li key={i} className="customer-list-item">
                      <p>{recipient.name}</p>
                      <p>{recipient.surname}</p>
                      <p>{recipient.phone}</p>
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </form>

          
        </div>
      </div>
    </>
  )
}

export default CampaignManager
