import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import Spinner from "./spinners/Ripple.js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import Modali, { useModali } from "modali";

import { toast } from "react-toastify";
toast.configure();

import translateToGSM from "../helpers/translateToGSM.js";
import capitalize from "../helpers/capitalize.js";
import normalizePhone from "../helpers/normalizePhone.js";

import csv from "csvtojson";

const CampaignManager = props => {

  // == Main State ==
  const [isSending, setIsSending] = useState(false)

  // ====

  // == Main Form ==
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [showGSM, setShowGSM] = useState(false)
  const [greeting, setGreeting] = useState(false)
  const [customLink, setCustomLink] = useState(false)

  const [campaigns, setCampaigns] = useState([])

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

  const handleLinkChange = e => {
    setCustomLink(e.target.checked)
  }

  const launchCampaign = async () => {

    setIsSending(true)

    const postData = { msgbody: message, recipients: recipients.filter(recipient => (recipient.selected && recipient.smsStatus==="not-sent")), addGreeting: greeting, addLink: customLink}

    await props.appointmentService
      .sendCampaign(postData)
        .then( async results => {
          const smsArray = results.data;
          let tempRecipients = recipients;
          for (let i = 0; i<smsArray.length; i++) {
            const j = await recipients.findIndex( recipient => recipient.userId.phone === smsArray[i].entity.to)
            tempRecipients = await [...tempRecipients.slice(0,j), {...tempRecipients[j], smsId: smsArray[i].entity.id, smsStatus: smsArray[i].entity.status}, ...tempRecipients.slice(j+1)]
          }
          await setRecipients(tempRecipients)
        })
        .then( () => setIsSending(false))
        .catch( err => console.error('error sending the messages', err))
  }

  const handleSubmit = e => {
    e.preventDefault();
    toggleConfirmModal();
  }

    //Campaign buttons
  
  const saveCampaign = () => {
    
    const postData = { title, message, recipients, customGreeting: greeting }

    props.campaignService
      .save(postData)
        .then( results => setCampaigns( prevCampaigns => [...prevCampaigns, results.data]))
        .catch( err => console.error("error saving campaign", err))
  }

  const handleSaveCampaign = async e => {
    e.preventDefault()
    await saveCampaign()
    notify(title)
  }

  const loadCampaign = async (loadTitle) => {
    await props.campaignService
      .getByTitle(loadTitle)
        .then(async result => {
          const {title, message, customGreeting, campaignUsers} = result.data;

          await setTitle(title)
          await setMessage(message)
          await setGreeting(customGreeting)
          await setRecipients(campaignUsers)
        })
  }

  const handleLoadCampaign = e => {
    console.log(e.target.value)
    loadCampaign(e.target.value)
  }

  const deleteCampaign = async () => {
    const id = await campaigns.find(elem => elem.title===title)._id;
    await props.campaignService
      .remove({id})
        .then( async () => {
          await setTitle("")
          await setMessage("")
          await setGreeting(false)
          await setRecipients([])
        })
  }

  const handleDelete = e => {
     e.preventDefault()
     toggleDeleteModal()
  }

  // ====

  // == SubForm ==
  const [recipients, setRecipients] = useState([])
  const [customer, setCustomer] = useState({userId: {name: "", surname: "", phone: ""}})

  const handleAddCustomer = e => {
    e.preventDefault();
    setRecipients(prevRecipients => [customer, ...prevRecipients])
  }

  const remCampaignUser = id => {
    props.campaignService
      .removeCampaignUser({id})
        .then(result => console.log(result.data))
      
  }

  const handleRemoveCustomer = (e, i) => {
    e.preventDefault();
    setRecipients([...recipients.slice(0, i), ...recipients.slice(i+1)])
    remCampaignUser(recipients[i]._id)
  }

  const handleSelectCustomer = async i => {
     
    await setRecipients(prevRecipients => {
      const selected = prevRecipients[i].selected ? false : true  
      return [...prevRecipients.slice(0,i), {...prevRecipients[i], selected},...prevRecipients.slice(i+1)]
    })
  }

  const handleCustomerChange = e => {
    const { name } = e.target
    let { value } = e.target
    if(name==="name"){value = value.slice(0,20)}
    setCustomer(prevCustomer => ({...prevCustomer, userId:{ ...prevCustomer.userId, [name] : value}}))
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
          userId: {
            name: capitalize(recipient.name), 
            surname: capitalize(recipient.surname), 
            phone: normalizePhone(recipient.phone)
          }
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


  const [deleteModal, toggleDeleteModal] = useModali({
    animated: true,
    centered: true,
    buttons: [
      <Modali.Button
        label="Volver"
        isStyleCancel
        onClick={() => toggleDeleteModal()}
      />,
      <Modali.Button
        label="Borrar"
        isStyleDefault
        onClick={async () => {
          const removedTitle = title;
          await deleteCampaign()
          await toggleDeleteModal()
          notifyDelete(removedTitle)
        }}
      />
    ],
    title: "Confirmar Borrado"
  });
  // =====
  

  // == TOASTIFY METHOD ==
  const notify = (notifyTitle) =>
    toast(
         "✔️  Campaña guardada con nombre " + notifyTitle
    );
  const notifyDelete = (notifyTitle) => 
    toast("❎ Campaña " + notifyTitle + " borrada.")
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
  
  // == LifeCycle Hooks ==
  
  useEffect(() => {
    let isSubscribed = true;
      if (isSubscribed) {
        props.campaignService
          .load()
          .then(results => {
            console.log(results.data)
            setCampaigns(results.data)
          })
      }
    return () => isSubscribed = false;
  }, [])

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
            Confirme el envío de {recipients.filter(recipient => (recipient.selected && recipient.smsStatus==="not-sent")).length} mensajes con el siguiente mensaje:
          </p>
          <p>
            {"<<"}{greeting ? translateToGSM("Hola (NOMBRE), " + message): translateToGSM(message)}{">>"}
          </p>
        </div>
      </Modali.Modal>
      <Modali.Modal {...deleteModal}>
        <div className="modal-text">
          <p>
            Confirme el BORRADO PERMANENTE de la siguiente campaña:
          </p>
          <p>
            {"<<"}{title}{">>"}
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
                    <input type="checkbox" id="link" name="link" checked={customLink} onChange={e => handleLinkChange(e)}/>
                    <label htmlFor="link">Enlace personalizado</label>
                  </div>
                  <p className="character-counter">{ greeting ? message.length + 27 : message.length}/160 caracteres</p>
                  <div className="errors"></div>
                </div>
                { showGSM && <textarea className="translated-textarea"readOnly value={greeting ? translateToGSM("Hola (NOMBRE), " + message): translateToGSM(message)}/> }
                <div className="campaign-buttons">
                  <button className="expand cp-button" onClick={e => handleClickGSM(e)}>{ showGSM ? "Ocultar" : "Vista Previa"} </button>
                  <button className="submit cs-button" onClick={e => handleSubmit(e)} type="submit">Enviar mensajes</button>
                  <label htmlFor="title">nombre de campaña</label>
                  <input name="title" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                  <button className="save cp-button" onClick={e => handleSaveCampaign(e)}>Guardar Campaña</button>
                  <label htmlFor="campaign-select">cargar campaña</label>
                  <select onChange={e => handleLoadCampaign(e)} id="campaign-select" name="campaign-select">
                    <option value="">seleccionar campaña</option>
                    {campaigns.map( (campaign, ind) => (
                      <option key={ind} value={campaign.id}>{campaign.title}</option>
                    ))}
                  </select>
                  <button className="delete cs-button" onClick={e => handleDelete(e)} >Borrar Campaña</button>
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
                    
                    <PhoneInput
                      className="add-phone"
                      name="phone"
                      id="phone"
                      country="ES"
                      onChange={value => { 
                        setCustomer(prevCustomer => ({...prevCustomer, userId: { ...prevCustomer.userId, phone : value}}))
                        }
                      }
                      placeholder="tel. 6xx xx xx xx"
                      value={customer.phone}
                    />

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
                    <li key={i} className={recipient.selected ? "customer-list-item selected" : "customer-list-item"}>
                      <div onClick={() => handleSelectCustomer(i)} className="customer-fields">
                        <p>{recipient.userId.name}</p>
                        <p>{recipient.userId.surname}</p>
                        <p>
                            {recipient.userId.phone}  {" "} 
                            {recipient.smsStatus === "not-sent" ?
                                <span style={{color: "grey"}}>N</span> : 
                                (recipient.smsStatus === "enqueued" ? 
                                  <span style={{color: "blue"}}>E</span> :
                                  (recipient.smsStatus === "delivered" ?
                                    <span style={{color: "green"}}>D</span> :
                                   <span style={{color: "red"}}>-</span>))}
                        </p>
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
