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

  return (
    <div className="add-single-form-container">
      <h1 className="add-single-title">Add Single Component</h1>
      <div className="add-single-form">
        <Flatpickr
            options={{ 
              dateFormat: 'd-m-Y',
              disableMobile: true,
              locale: Spanish,
              minDate: new Date( new Date().setDate( new Date().getDate() + 1)),
              altInput: true,
              altFormat: "F j, Y",
              disable: [
                function(date) {
                  return (date.getDay() === 0 || date.getDay() === 1 || date.getDay() === 6);
                }
              ]
            }}
            className="add-single-flatpickr"
            placeholder="pulse aquí..."
            onChange={e => dateChangeHandler(e)}
        />
        <label htlmfor="duration"></label>
        <div className="add-single-duration">
          <input 
            type="text" 
            id="duration" 
            name="duration"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
          <p>minutes</p>
        </div>
      </div>
      
      <div className="add-single-buttons-wrapper">
        <button className="add-single-cancel-button" onClick={props.handleSetAddSingle}>Cancelar</button>
        <button className="add-single-button" >Añadir</button>
      </div>
    </div>
  )
}

export default AddSingleForm
