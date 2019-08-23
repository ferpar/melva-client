import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import Spinner from "./spinners/Ripple.js";

import Modali, { useModali } from "modali";

import translateToGSM from "../helpers/translateToGSM.js";
import capitalize from "../helpers/capitalize.js";
import normalizePhone from "../helpers/normalizePhone.js";

import csv from "csvtojson";

const CampaignManager = props => {

  // == Main State ==
  const [isSending, setIsSending] = useState(false)


  // ====

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

  const launchCampaign = () => {

    setIsSending(true)

    const postData = { msgbody: message, recipients, addGreeting: greeting }

    props.appointmentService
      .sendCampaign(postData)
        .then( results => console.log(results.data))
        .then( () => setIsSending(false))
        .catch( err => console.error('error sending the messages', err))
  }

  const handleSubmit = e => {
    e.preventDefault();
    toggleConfirmModal();
  }

  // ====

  // == SubForm ==
  const [recipients, setRecipients] = useState([])
  const [customer, setCustomer] = useState({name: "", surname: "", phone: ""})

  const handleAddCustomer = e => {
    e.preventDefault();
    setRecipients(prevRecipients => [customer, ...prevRecipients])
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

  const handleCSVImport = async e => {
    const csvContent= await e.target.files[0].text()
    csv({
      delimiter:[";", ",", " ", "|"],
      headers:["surname", "name", "phone"]
    })
      .fromString(csvContent)
      .then(async jsonObj => {
        const normalizedJsonObj = await jsonObj.map( recipient => ({ 
            name: capitalize(recipient.name), 
            surname: capitalize(recipient.surname), 
            phone: normalizePhone(recipient.phone)
        }))
        setRecipients( prevRecipients => [...prevRecipients, ...normalizedJsonObj] )
      })

  }

  // ====

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
          await launchCampaign()
          toggleConfirmModal();
        }}
      />
    ],
    title: "Confirmar Envío"
  });
  // =====
  
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
      <Modali.Modal {...confirmModal}>
        <div className="modal-text">
          <p>
            Confirme el envío de {recipients.length} mensajes con el siguiente mensaje:
          </p>
          <p>
            {"<<"}{greeting ? translateToGSM("Hola (NOMBRE), " + message): translateToGSM(message)}{">>"}
          </p>
        </div>
      </Modali.Modal>
      {
      isSending 
        ?
        <div className="campaigns-main">
          <Spinner innerMessage={"Envíando " + recipients.length + " mensajes. \n Esto tomará un segundo por mensaje..."}/>
        </div>
        :
        <div className="campaigns-main">
          <div className="campaigns-message">
            <h1>Campañas</h1>
            <form>
              <div className="textarea-container">
                <textarea className="main-textarea" onChange={e => handleMsgChange(e)} placeholder="Introduzca contenido del SMS..." value={message}/>

                <div className="info-options">
                  <div className="greeting-checkbox">
                    <input type="checkbox" id="greeting" name="greeting" checked={greeting} onChange={e => handleGreetingChange(e)}/>
                    <label htmlFor="greeting">Saludo personalizado</label>
                  </div>
                  <p className="character-counter">{ greeting ? message.length + 27 : message.length}/160 caracteres</p>
                  <div className="errors"></div>
                </div>
                { showGSM && <textarea className="translated-textarea"readOnly value={greeting ? translateToGSM("Hola (NOMBRE), " + message): translateToGSM(message)}/> }
                <div className="campaign-buttons">
                  <button className="expand cp-button" onClick={e => handleClickGSM(e)}>{ showGSM ? "Ocultar" : "Vista Previa"} </button>
                  <button className="submit cs-button" onClick={e => handleSubmit(e)} type="submit">Enviar mensajes</button>
                </div>
              </div>
            </form>

            
          </div>
          <div className="recipients-list">
            <div className="list-container">
              <form className="add-recipients-form">
              
                <div className="input-array">
                  <div className="input-line">
                    <label htmlFor="name">nombre</label>
                    <input className="add-name" name="name" onChange={e => handleCustomerChange(e)} id="name" placeholder=" max. 20 caracteres" type="text" value={customer.name}/>
                  </div>
                  <div className="input-line">
                    <label htmlFor="surname">apellidos</label>
                    <input className="add-surname" name="surname" onChange={e => handleCustomerChange(e)} id="surname" type="text" value={customer.surname}/>
                  </div>
                  <div className="input-line">
                    <label htmlFor="phone">teléfono</label>
                    <input className="add-phone" name="phone" onChange={e => handleCustomerChange(e)} id="phone" placeholder=" Ej.: +346xxxxxxxx" type="phone" value={customer.phone}/>
                  </div>
                  <button className="cp-button" onClick={e => handleAddCustomer(e)} >Añadir</button>
                </div>
                <div className="import-container">
                  <label className="csv-import-button" htmlFor="csv-import">Importar desde .csv</label>
                  <input accept=".csv" id="csv-import" name="csv-import" type="file" onChange={e => handleCSVImport(e)}/>
                </div>
              </form>
              <div className="customers-container">
                <ul className="customers-list">
                  {recipients.map( (recipient,i) => (
                    <li key={i} className="customer-list-item">
                      <div className="customer-fields">
                        <p>{recipient.name}</p>
                        <p>{recipient.surname}</p>
                        <p>{recipient.phone}</p>
                      </div>
                      <button className="remove-customer" onClick={e => handleRemoveCustomer(e, i)}>-</button>
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default CampaignManager
