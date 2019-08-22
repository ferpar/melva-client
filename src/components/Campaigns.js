import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import translateToGSM from "../helpers/translateToGSM.js";

const CampaignManager = props => {

  // == Main Form ==
  const [message, setMessage] = useState("")
  const [showGSM, setShowGSM] = useState(false)
  const [greeting, setGreeting] = useState(false)

  const handleMsgChange = e => {
    setMessage(e.target.value);
  }

  const handleClickGSM = e => {
    e.preventDefault();
    setShowGSM(prevState => !prevState);
  }

  const handleGreetingChange = e => {
    setGreeting(e.target.checked)
  }

  const handleSubmit = e => {
    e.preventDefault();
    console.log(recipients)
    console.log(message)
    console.log(greeting)

    const postData = { msgbody: message, recipients, addGreeting: greeting }

    console.log(postData)

    props.appointmentService
      .sendCampaign(postData)
        .then( results => console.log(results.data))
        .catch( err => console.error('error sending the messages', err))
  }

  // ====

  // == SubForm ==
  const [recipients, setRecipients] = useState([])
  const [customer, setCustomer] = useState({name: "", surname: "", phone: ""})

  const handleAddCustomer = e => {
    e.preventDefault();
    setRecipients(prevRecipients => [...prevRecipients, customer])
  }

  const handleRemoveCustomer = (e, i) => {
    e.preventDefault();
    setRecipients([...recipients.slice(0, i), ...recipients.slice(i+1)])
  }

  const handleCustomerChange = e => {
    const { name } = e.target
    let { value } = e.target
    if(name==="name"){value = value.slice(0,20)}
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
        <div className="campaigns-list">
          <h1>Campañas</h1>
          <form>
            <div className="textarea-container">
              <textarea onChange={e => handleMsgChange(e)} placeholder="Introduzca contenido del SMS..." value={message}/>
              <div className="greeting-checkbox">
                <input type="checkbox" id="greeting" name="greeting" checked={greeting} onChange={e => handleGreetingChange(e)}/>
                <label htmlFor="greeting">Saludo personalizado</label>
              </div>
              <p>{ greeting ? message.length + 27 : message.length} caracteres</p>
              <div className="errors"></div>
              { showGSM && <textarea readOnly value={greeting ? translateToGSM("Hola (NOMBRE), " + message): translateToGSM(message)}/> }
              <div className="campaign-buttons">
                <button className="submit" onClick={e => handleSubmit(e)} type="submit">Enviar mensajes</button>
                <button className="expand" onClick={e => handleClickGSM(e)}>{ showGSM ? "Ocultar" : "Vista Previa"} </button>
              </div>
            </div>
          </form>

          
        </div>
        <div className="campaigns-list">
          <div className="list-container">
            <label htmlFor="name">nombre</label>
            <input className="add-name" name="name" onChange={e => handleCustomerChange(e)} id="name" placeholder=" max. 20 caracteres" type="text" value={customer.name}/>
            <label htmlFor="surname">apellidos</label>
            <input className="add-surname" name="surname" onChange={e => handleCustomerChange(e)} id="surname" type="text" value={customer.surname}/>
            <label htmlFor="phone">teléfono</label>
            <input className="add-phone" name="phone" onChange={e => handleCustomerChange(e)} id="phone" placeholder=" Ej.: +346xxxxxxxx" type="phone" value={customer.phone}/>
            <button onClick={e => handleAddCustomer(e)} >Añadir</button>
            <div className="customers-container">
              <ul className="customers-list">
                {recipients.map( (recipient,i) => (
                  <li key={i} className="customer-list-item">
                    <p>{recipient.name}</p>
                    <p>{recipient.surname}</p>
                    <p>{recipient.phone}</p>
                    <button onClick={e => handleRemoveCustomer(e, i)}>-</button>
                  </li>
                ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CampaignManager
