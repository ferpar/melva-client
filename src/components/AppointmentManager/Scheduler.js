import React, { useState } from "react";
import "./Scheduler.css";

import Switch from "react-ios-switch";
import AddSingleForm from "./Scheduler/AddSingleForm.js";
import Generator from "./Scheduler/Generator.js";

const Scheduler = props => {
  const [addSingle, setAddSingle] = useState(false)
  const [generator, setGenerator] = useState(false)

  const handleSetAddSingle = () => {
    setAddSingle(!addSingle)
  }

  const handleSetGenerator = () => {
    setGenerator(!generator)
  }

  return (
    <div className="scheduler-container">
      <div className="scheduler-wrapper">
        { props.campaign ? (
          <>
          {(!addSingle && !generator) &&
            <div className="scheduler-controls"> 
              <button 
                onClick={handleSetAddSingle}
                className="scheduler-button"
              > 
                Nueva cita 
              </button>
              <button 
                onClick={handleSetGenerator}
                className="scheduler-button"
              > 
                Generar Horario 
              </button>
              <div className="remove-switch">
                <Switch 
                  className="switch-control"
                  checked={props.removeSwitch}
                  onChange={props.handleRemoveSwitch}
                  onColor="#dc3545"
                />
                {props.removeSwitch ? <p>Borrado activado</p> : <p>Borrado desactivado</p> }
              </div>
              <button
                onClick={props.toggleConfirmCleanUpModal}
                className="scheduler-cancel-button"
               >
                 Borrar Citas Disponibles
              </button>
            </ div>
          }
          {addSingle && (
          <AddSingleForm
            handleSetAddSingle={handleSetAddSingle}
            appointmentService={props.appointmentService}
            location={props.location}
            campaign={props.campaign}
            franchise={props.franchise}
            handleAppointments={props.handleAppointments}
            notifyCreate={props.notifyCreate}
          />
          )}
          { generator && (
            <Generator 
              appointmentService={props.appointmentService}
              location={props.location}
              campaign={props.campaign}
              franchise={props.franchise}
              handleGenerator={handleSetGenerator}
              handleAppointments={props.handleAppointments}
            />
          )}
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
