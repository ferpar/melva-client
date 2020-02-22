import React from "react";
import "./IntervalSelector.css"

const IntervalSelector = ({timeInterval, handleSetTimeInterval}) => {
  const values = [
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
  ]
  return (
    <div className="interval-select-container">
      <div className="interval-select-wrapper">

          <label htmlFor="interval-select">Intervalo</label>
          <select onChange={e => handleSetTimeInterval(e)} id="interval-select" name="interval-select">
            <option 
              value={timeInterval ? timeInterval : "yearly"}
            >
              {timeInterval ? values.find(elem => elem.value === timeInterval).name : "seleccionar intervalo"}
            </option>
            {values.map( (interval, ind) => (
              <option key={ind} value={interval.value}>{interval.name}</option>
            ))}
          </select>


      </div>
    </div>
  )
}

export default IntervalSelector
