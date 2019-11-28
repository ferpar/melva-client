import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import Spinner from "./spinners/Ripple.js";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Switch from "react-ios-switch";

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
  const [isSaving, setIsSaving] = useState(false)
  const [filter, setFilter] = useState("all")

  // ====

  // == Main Form ==
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] =useState("")
  const [message, setMessage] = useState("")
  const [showGSM, setShowGSM] = useState(false)
  const [greeting, setGreeting] = useState(false)
  const [customLink, setCustomLink] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const [selectedCampaignId, setSelectedCampaignId] = useState("")

  const [locations, setLocations] = 
    props.user.franchise 
    ? useState(props.user.franchise.locations) 
    : useState([])

  const [location, setLocation] = useState("")

  const handleSetLocation = e => {
    const selectedLocationId = e.target.value
    setLocation(selectedLocationId)
    setFilteredCampaigns(campaigns.filter( campaign => {
      return campaign.location === selectedLocationId
    }))
  }

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

  const handleIsActive = e => {
    setIsActive(!e.target.checked) 
  }

  const launchCampaign = async () => {

    setIsSending(true)

    const postData = { 
      msgbody: message, 
      recipients: recipients
                  .filter(recipient => 
                    (recipient.selected && ( recipient.smsStatus==="not-sent" || recipient.smsStatus===null))
                  ), 
      addGreeting: greeting, 
      addLink: customLink,
      smsName: props.user.franchise.smsName
    }

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
  
  const loadCampaigns = () => {

        props.campaignService
          .load()
          .then(results => {
            setCampaigns(results.data)
          })
  }

  const saveCampaign = async ( newRecipients) => {
    
    const postData = { title, message, shortDescription, recipients, customGreeting: greeting, customLink, location, isActive }
    if (newRecipients) postData.recipients = newRecipients;

    await props.campaignService
      .save(postData)
        .then( results => setCampaigns( prevCampaigns => [...prevCampaigns, results.data]))
        .catch( err => console.error("error saving campaign", err))

    await refreshCampaigns()
  }

  const handleSaveCampaign = async e => {
    e.preventDefault()
    setIsSaving(true)
    if (title) {
    await saveCampaign()
    await notify(title)
    setIsSaving(false)
    }
  }

  const loadCampaign = async (campaignId) => {
    if (campaignId) { 
      await props.campaignService
        .getById(campaignId)
          .then(async result => {
            const {title, message, shortDescription = "", customGreeting, customLink, campaignUsers, isActive = true} = result.data;

            await setTitle(title)
            await setMessage(message)
            await setShortDescription(shortDescription)
            await setIsActive(isActive)
            await setGreeting(customGreeting)
            await setCustomLink(customLink)
            await setRecipients(campaignUsers)
          })
    } 
  }

  const handleLoadCampaign = async e => {
    const campaignId = e.target.value;

    if (campaignId) {
      await loadCampaign(campaignId)
    }
    setSelectedCampaignId(campaignId)
  }

  const deleteCampaign = async () => {
    const id = await campaigns.find(elem => elem.title===title)._id;
    await props.campaignService
      .remove({id})
        .then( async () => {
          await setTitle("")
          await setShortDescription("")
          await setMessage("")
          await setGreeting(false)
          await setRecipients([])
        })
    await loadCampaigns()
  }

  const handleDelete = e => {
     e.preventDefault()
     toggleDeleteModal()
  }

  const refreshCampaigns = async () => {
    await loadCampaigns()
    await loadCampaign(selectedCampaignId)
  }

  const handleRefresh = async () => {
    await refreshCampaigns()
  }

  // ====

  // == SubForm ==
  const [recipients, setRecipients] = useState([])
  const [customer, setCustomer] = useState({userId: {name: "", surname: "", phone: ""}})
  const [removeSwitch, setRemoveSwitch] = useState(false)
  const [multiSelect, setMultiSelect] = useState(false)
  const [selectArray, setSelectArray] = useState([])

  const handleAddCustomer = async e => {
    e.preventDefault();
    const newRecipients = [customer, ...recipients];
    await setRecipients(prevRecipients => [customer, ...prevRecipients])
    await saveCampaign(newRecipients)
  }

  const remCampaignUser = id => {
    props.campaignService
      .removeCampaignUser({id})
  }

  const handleRemoveCustomer = async (e, i) => {
    e.preventDefault();
    await setRecipients([...recipients.slice(0, i), ...recipients.slice(i+1)])
    await remCampaignUser(recipients[i]._id)
  }

  const handleSelectCustomer = async id => {
    const i = recipients.findIndex(recipient => recipient._id === id)
    await setRecipients(prevRecipients => {
      const selected = prevRecipients[i].selected ? false : true  
      return [...prevRecipients.slice(0,i), {...prevRecipients[i], selected},...prevRecipients.slice(i+1)]
    })
  }

  const handleMultiSelect = async id => {
    if (multiSelect) {
      let iterableRecipients = recipients.filter(recipient => {
                  switch (filter) {
                    case "all":
                      return recipient;
                    case "not-sent":
                      return recipient.smsStatus==="not-sent";
                    case "enqueued":
                      return recipient.smsStatus==="enqueued";
                    case "delivered":
                      return recipient.smsStatus==="delivered";
                    case "failed":
                      return recipient.smsStatus==="failed";
                    case "clicked":
                      return recipient.linkClicked;
                    case "booked":
                      return recipient.appointmentBooked;
                    default:
                      return recipient;
                  }
            })
      if (selectArray.length !=1) {
        handleSelectCustomer(id) 
        setSelectArray([id]) 
      } else if (selectArray.length === 1) {
        const start = iterableRecipients.findIndex(recipient => recipient._id === selectArray[0])
        const end = iterableRecipients.findIndex(recipient => recipient._id === id)
        for (let i=start+1; i<=end; i++) {
            handleSelectCustomer(iterableRecipients[i]._id)
        }
        setSelectArray([...selectArray, id])
      }
    }
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
        const newRecipients = [...recipients, ...normalizedJsonObj]
        await setRecipients( prevRecipients => [...prevRecipients, ...normalizedJsonObj] )
        await saveCampaign(newRecipients)
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
        loadCampaigns();
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
          <Link onClick={() => closeMenu()} to="/appointments-manager">Gestor de Citas</Link>
          <Link onClick={() => closeMenu()} to="/dashboard">Panel de Control</Link>
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
            Confirme el envío de {recipients.filter(recipient => (recipient.selected && (recipient.smsStatus==="not-sent" || recipient.smsStatus===null))).length} mensajes con el siguiente mensaje:
          </p>
          <p>
            {"<<"}{greeting ? ( customLink ? translateToGSM("Hola (NOMBRE), " + message + " https://dentt.info/xxxxxxxxx") 
              : translateToGSM("Hola (NOMBRE), " + message) ) : 
                ( customLink ? translateToGSM(message + " https://dentt.info/xxxxxxxxx") : translateToGSM(message) )}{">>"}
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
          <Spinner 
            innerMessage={
              "Envíando " + 
              recipients.filter(recipient => (
                recipient.selected && (recipient.smsStatus==="not-sent" || recipient.smsStatus===null))).length + 
                " mensajes. \n Esto tomará un segundo por mensaje..."
            }
          />
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
                  <p className="character-counter">{ greeting ? 
                    (customLink ? message.length + 27 + 29 : message.length + 27) :
                    (customLink ? message.length + 29: message.length)}
                    /160 caracteres
                  </p>
                  <div className="errors"></div>
                </div>
                { 
                  showGSM && 
                  <textarea 
                    className="translated-textarea" 
                    readOnly 
                    value={greeting ? 
                      ( customLink ? 
                          translateToGSM("Hola (NOMBRE), " + 
                          message + " https://dentt.info/xxxxxxxxx") : 
                        translateToGSM("Hola (NOMBRE), " + message))
                      : ( customLink ? translateToGSM(message + 
                        " https://dentt.info/xxxxxxxxx") : 
                        translateToGSM(message) )}/> }
                <div className="campaign-buttons">
                  <button className="expand cp-button" onClick={e => handleClickGSM(e)}>{ showGSM ? "Ocultar" : "Vista Previa"} </button>
                  <button className="submit cs-button" onClick={e => handleSubmit(e)} type="submit">Enviar mensajes</button>
                </div>
              </div>
            </form>
          </div>
          <div className="campaign-management">
              <label htmlFor="location-select">clínica</label>
              <select onChange={e => handleSetLocation(e)} id="location-select" name="location-select">
                <option value="">seleccionar clínica</option>
                {locations.map( (location, ind) => (
                  <option key={ind} value={location._id}>{location.name}</option>
                ))}
              </select>
              <hr className="camp-management-separator"/>
              { location ? (
                <>
                  <div className="campaign-name">
                    <label htmlFor="title">nombre de campaña</label>
                    <input name="title" id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                  </div>
                <div className="campaign-description">
                    <label htmlFor="short-description">nombre público</label>
                    <input name="short-description" id="short-description" type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}/>
                </div>
                <div className="campaign-status">
                    <input type="checkbox" id="isactive" name="isactive" checked={!isActive} onChange={e => handleIsActive(e)}/>
                    <label htmlFor="isactive">Campaña terminada</label>
                </div>
                  <button disabled={isSaving} className="save cp-button" onClick={e => handleSaveCampaign(e)}>{isSaving ? "Guardando..." : "Guardar Campaña"}</button>
                  <hr/>
                  <label htmlFor="campaign-select">cargar campaña</label>
                  <select onChange={e => handleLoadCampaign(e)} id="campaign-select" name="campaign-select">
                    <option value="">seleccionar campaña</option>
                    {filteredCampaigns.map( (campaign, ind) => (
                      <option key={ind} value={campaign._id}>{campaign.title}</option> //its picking the title as value instead of the id because it should be _id !!
                    ))}
                  </select>
                  <hr/>
                  <button className="delete cs-button" onClick={e => handleDelete(e)} >Borrar Campaña</button>
                </>
              ) : (
                <>
                  <p> Elige una clínica para continuar </p> 
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                </>
              )
              }
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
                  <p>
                    List size: {recipients.length}, 
                    Sent: { recipients.filter( recipient => (recipient.smsStatus === "enqueued" || recipient.smsStatus === "delivered")).length},
                    Enqueued: {recipients.filter( recipient => recipient.smsStatus === "enqueued" ).length},
                    Delivered: {recipients.filter( recipient => recipient.smsStatus === "delivered").length}, 
                    Failed: {recipients.filter( recipient => recipient.smsStatus === "failed").length}, 
                    Clicked on: {recipients.filter( recipient => recipient.linkClicked).length},
                    Booked: {recipients.filter( recipient => recipient.appointmentBooked).length}
                  </p>
                </div>
                <div className="import-container">
                  <label className="csv-import-button" htmlFor="csv-import">Importar desde .csv</label>
                  <input accept=".csv" id="csv-import" name="csv-import" type="file" onChange={e => handleCSVImport(e)}/>
                </div>
              </form>
              <div className="customers-container"> 
                <div className="customers-controls">
                    <button onClick={() => handleRefresh()} >Recargar</button>
                    <div className="remove-switch">
                      <Switch 
                        className = "switch-control"
                        checked = {removeSwitch}
                        onChange={checked => setRemoveSwitch(!removeSwitch)}
                        onColor = "#dc3545"
                      />
                      { removeSwitch ? <p> Borrado activado </p> : <p> Borrado inactivo </p>}
                    </div>
                    <div className="multiselect-switch">
                      <Switch 
                        className = "multiselect-switch-control"
                        checked = {multiSelect}
                        onChange={checked => setMultiSelect(!multiSelect)}
                        onColor = "#dc3545"
                      />
                      { multiSelect ? <p> Selección simple </p> : <p> Selección múltiple </p>}
                    </div>
                </div>
                <div><p>filter by:</p>
                  <button onClick={() => setFilter("all")}>all</button>
                  <button onClick={() => setFilter("not-sent")}>not-sent</button>
                  <button onClick={() => setFilter("enqueued")}>enqueued</button>
                  <button onClick={() => setFilter("delivered")}>delivered</button>
                  <button onClick={() => setFilter("failed")}>failed</button>
                  <button onClick={() => setFilter("clicked")}>clicked on</button>
                  <button onClick={() => setFilter("booked")}>Appointment Booked</button>
                </div>
                <ul className="customers-list">
                  {recipients
                    .filter(recipient => {
                      switch (filter) {
                        case "all":
                          return recipient;
                        case "not-sent":
                          return recipient.smsStatus==="not-sent";
                        case "enqueued":
                          return recipient.smsStatus==="enqueued";
                        case "delivered":
                          return recipient.smsStatus==="delivered";
                        case "failed":
                          return recipient.smsStatus==="failed";
                        case "clicked":
                          return recipient.linkClicked;
                        case "booked":
                          return recipient.appointmentBooked;
                        default:
                          return recipient;
                      }
                    })
                    .map( (recipient,i) => (
                    <li 
                      key={i} 
                      className = {
                        recipient.selected ? (
                          (new Date() - new Date(recipient.updated_at) <= 3600*1000*12) 
                            ? "customer-list-item selected new-customer" : "customer-list-item selected") : (
                           (new Date() - new Date(recipient.updated_at) <= 3600*1000*12) ?  "customer-list-item new-customer" : "customer-list-item")}>
                      <div 
                        onClick={multiSelect ? () => handleMultiSelect(recipient._id) : () => handleSelectCustomer(recipient._id)} 
                        className="customer-fields">
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
                                    (recipient.smsStatus === "failed" ?
                                    <span style={{color: "red"}}>F</span> :
                                   <span style={{color: "red"}}>-</span>)))}
                            {" "}
                            {recipient.linkClicked && <span style={{color: "orange"}}>C</span>}
                            {" "}
                            {recipient.appointmentBooked && <span style={{color: "red"}}>B!</span>}
                            {" "}
                            {(new Date() - new Date(recipient.updated_at) <= 3600*1000*12)
                              && <span className="ball"></span>}
                            {(recipient.userId.phone[3] != "6" || recipient.userId.phone.length != 12) && (<span className="ball" style={{"backgroundColor": "red"}}></span>)}
                                
                        </p>
                      </div>
                      <button 
                        className="remove-customer" 
                        disabled={!removeSwitch}
                        onClick={e => handleRemoveCustomer(e, i)}
                      >
                          -
                      </button>
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
