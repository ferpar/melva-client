import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {slide as Menu} from "react-burger-menu";
import Spinner from "./spinners/Ripple.js";

import RecipientList from "./Campaigns/RecipientList.js";
import SideMenu from "./Campaigns/SideMenu.js";
import CampaignMessage from "./Campaigns/CampaignMessage.js" ;

import Modali, { useModali } from "modali";
import * as inner from "./Campaigns/Modali/inner.js";

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

  // == Main Form & SideMenu ==
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

  // SubForm state
  const [recipients, setRecipients] = useState([])
  const [customer, setCustomer] = useState({userId: {name: "", surname: "", phone: ""}})
  const [removeSwitch, setRemoveSwitch] = useState(false)
  const [multiSelect, setMultiSelect] = useState(false)
  const [selectArray, setSelectArray] = useState([])
  // ==
  
  const [bufferedSaveState, setBufferedSaveState] = useState(null)
  const [campaignChanged, setCampaignChanged] = useState(false)
  const [saveBufferFlag, setSaveBufferFlag] = useState(false)
  const [checkCampaignFlag, setCheckCampaignFlag] = useState(false)

  const [newCampaign, setNewCampaign] = useState(false)

  const handleNewCampaign = () => {
    setNewCampaign(!newCampaign)
  }

  const handleSetLocation = e => {
    const selectedLocationId = e.target.value
    setLocation(selectedLocationId)
    setFilteredCampaigns(campaigns.filter( campaign => {
      return campaign.location === selectedLocationId
    }))
  }

  const handleMsgChange = e => {
    setMessage(e.target.value);
    setCheckCampaignFlag(true)
  }

  const handleClickGSM = e => {
    e.preventDefault();
    setShowGSM(prevState => !prevState);
  }

  const handleGreetingChange = e => {
    setGreeting(e.target.checked)
    setCheckCampaignFlag(true)
  }

  const handleLinkChange = e => {
    setCustomLink(e.target.checked)
    setCheckCampaignFlag(true)
  }

  const handleIsActive = e => {
    setIsActive(!e.target.checked) 
    setCheckCampaignFlag(true)
  }

  const handleSetTitle = e => {
    setTitle(e.target.value)
    setCheckCampaignFlag(true)
  }

  const handleSetShortDescription = e => {
    setShortDescription(e.target.value)
    setCheckCampaignFlag(true)
  }

  const clearSelection = (recipientsToClear) => {
    const clearedRecipients = recipientsToClear.map( recipient => {
      recipient.selected = false;
      return recipient
    }) 
    return clearedRecipients
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
          await setRecipients(clearSelection(tempRecipients))
        })
        .then( () => setIsSending(false))
        .catch( err => {
          //setIsSending(false)
          console.error('error sending the messages', err)
        })
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
    setSaveBufferFlag(true)
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
    setSaveBufferFlag(true)
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

  const saveBufferState = () => {
    setBufferedSaveState(
      {
        title, message, shortDescription, isActive, greeting, customLink 
      }
    )
    setSaveBufferFlag(false)
    setCampaignChanged(false)
  }

  const campaignChecker = () => {
    if (bufferedSaveState) {
      let change = false
      const actualState = {
        title, message, shortDescription, isActive, greeting, customLink
      }
      for (let subprop in bufferedSaveState) {
        console.log(subprop)
        console.log(bufferedSaveState[subprop])
        console.log(actualState[subprop])
        if (bufferedSaveState[subprop] != actualState[subprop]){
          change = true
        }
      }
      console.log("campaignChanged: " + change)
      setCampaignChanged(change)
     } else {
       console.log("no buffered State")
       setCampaignChanged(false)
     }
    setCheckCampaignFlag(false)
  }

  // ====

  // == SubForm ==

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
          toggleConfirmModal();
          await launchCampaign()
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

  useEffect(() => {
    if (saveBufferFlag) saveBufferState()
  }, [saveBufferFlag]
  )

  useEffect(() => {
    if (checkCampaignFlag) campaignChecker()
  }, [checkCampaignFlag])

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
        <inner.confirmModal 
          recipients = {recipients}
          message = {message}
          greeting = {greeting}
          customLink = {customLink}
          translateToGSM = {translateToGSM}
        />
      </Modali.Modal>
      <Modali.Modal {...deleteModal}>
        <inner.deleteModal
          title = {title}
        />
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
          <CampaignMessage 
            message = {message}
            handleMsgChange = {handleMsgChange}
            greeting = {greeting}
            handleGreetingChange = {handleGreetingChange}
            customLink = {customLink}
            handleLinkChange = {handleLinkChange}
            showGSM = {showGSM}
            handleClickGSM = {handleClickGSM}
            translateToGSM = {translateToGSM}
            handleSubmit = {handleSubmit}
          />
          <SideMenu 
            locations = {locations} 
            location = {location} 
            handleSetLocation = {handleSetLocation} 
            title = {title} 
            message = {message}
            handleSetTitle = {handleSetTitle}
            shortDescription = {shortDescription} 
            handleSetShortDescription = {handleSetShortDescription}
            isActive = {isActive} 
            handleIsActive = {handleIsActive} 
            isSaving = {isSaving} 
            handleSaveCampaign = {handleSaveCampaign} 
            handleLoadCampaign = {handleLoadCampaign} 
            filteredCampaigns = {filteredCampaigns} 
            handleDelete = {handleDelete} 
            campaignChanged = {campaignChanged}
            newCampaign = {newCampaign}
            setNewCampaign = {setNewCampaign}
            handleNewCampaign = {handleNewCampaign}
          />
          <RecipientList 
            handleCustomerChange = {handleCustomerChange} 
            customer = {customer} 
            setCustomer = {setCustomer}
            handleAddCustomer = {handleAddCustomer}
            recipients = {recipients}
            handleCSVImport = {handleCSVImport}
            handleRefresh = {handleRefresh}
            removeSwitch = {removeSwitch}
            setRemoveSwitch = {setRemoveSwitch}
            handleSelectCustomer = {handleSelectCustomer}
            multiSelect = {multiSelect}
            setMultiSelect = {setMultiSelect}
            handleMultiSelect = {handleMultiSelect}
            filter = {filter}
            setFilter = {setFilter}
            handleRemoveCustomer = {handleRemoveCustomer}
          />
        </div>
      }
    </>
  )
}

export default CampaignManager
