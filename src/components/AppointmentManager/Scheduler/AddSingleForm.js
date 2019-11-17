import React, { useState } from "react";
import "./AddSingleForm.css";

import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/themes/material_green.css";

const AddSingleForm = props => {

  const [duration, setDuration] = useState("")
  const [dateTime, setDateTime] = useState("")

  const dateChangeHandler = e => {
    setDateTime(e[0]);
  };

  const handleSubmit = async () => {
    const appointments = [];
    appointments.push(
      {
        time: new Date(dateTime).toISOString(), 
        duration,
        location: props.location,
        campaign: props.campaign,
        franchise: props.franchise._id
      }
    )
    try {
      if (props.campaign) {
      const sentAppointments = await props.appointmentService.create(appointments)
      await props.handleAppointments()
        const { createdAppointments } = sentAppointments.data
        createdAppointments.forEach( appointment => {
          props.notifyCreate(appointment)
        })
      } else {
      console.log("must select a campaign first")
      }
    } catch(err) {
      console.error("[Handler] Error creating appointments", err)
    }
  }

  return (
    <div className="add-single-form-container">
      <div className="add-single-form">
        <div className="add-single-datetime">
          <label htmlFor="flatpickr">Fecha y hora</label>
          <Flatpickr
              options={{ 
                dateFormat: 'd-m-Y',
                disableMobile: true,
                enableTime: true,
                locale: Spanish,
                minDate: new Date( new Date().setDate( new Date().getDate() + 1)),
                altInput: true,
                altFormat: "F j, Y, H:i",
              }}
              className="add-single-flatpickr"
              placeholder="pulse aquí..."
              onChange={e => dateChangeHandler(e)}
          />
        </div>
        <div className="add-single-duration">
          <label htmlFor="duration">duración</label>
          <div className="add-single-input-wrapper">
            <input 
              className="add-single-duration-input"
              type="text" 
              id="duration" 
              name="duration"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
            <p>minutos</p>
          </div>
        </div>
        <div className="add-single-buttons-wrapper">
          <button className="add-single-cancel-button" 
            onClick={props.handleSetAddSingle}
          >
            Cancelar
          </button>
          <button 
            className="add-single-button"
            onClick={handleSubmit}
          >
            Añadir
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default AddSingleForm
