import React from "react";
import "./IntervalSelector.css"

const IntervalSelector = ({timeInterval, handleSetTimeInterval}) => {
  return (
    <div className="interval-select-container">
      <div className="interval-select-wrapper">

          <label htmlFor="interval-select">Intervalo</label>
          <select onChange={e => handleSetTimeInterval(e)} id="interval-select" name="interval-select">
            <option value="yearly">seleccionar intervalo</option>
            {[
              {
                name: "anual",
                value: "yearly"
              }, 
              {
                name: "trimestral",
                value: "quarterly"
              }, 
              {
                name: "mensual",
                value: "monthly"
              }
            ].map( (interval, ind) => (
              <option key={ind} value={interval.value}>{interval.name}</option>
            ))}
          </select>


      </div>
    </div>
  )
}

export default IntervalSelector
