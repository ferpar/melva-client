import React, { useState } from "react";
import "./Scheduler.css";

import Switch from "react-ios-switch";
import AddSingleForm from "./Scheduler/AddSingleForm.js";

const Scheduler = props => {
  const [addSingle, setAddSingle] = useState(false)

  const handleSetAddSingle = () => {
    setAddSingle(!addSingle)
  }

  return (
    <div className="scheduler-container">
      <div className="scheduler-wrapper">
        <h1>Scheduler</h1>
        { props.campaign ? (
          <>
          {addSingle ? (
          <AddSingleForm
            handleSetAddSingle={handleSetAddSingle}
            appointmentService={props.appointmentService}
            location={props.location}
            campaign={props.campaign}
            franchise={props.franchise}
            handleAppointments={props.handleAppointments}
            notifyCreate={props.notifyCreate}
          />
        ) : (
          <button onClick={handleSetAddSingle}> Nueva cita </button>
        )}
          <div className="remove-switch">
            <Switch 
              className="switch-control"
              checked={props.removeSwitch}
              onChange={props.handleRemoveSwitch}
              onColor="#dc3545"
            />
            {props.removeSwitch ? <p>Borrado activado</p> : <p>Borrado desactivado</p> }
          </div>
          </>
        ) : (
          <p>Seleccione clínica y campaña</p>
        )
        }
      </div>
    </div>
  )
}

export default Scheduler
