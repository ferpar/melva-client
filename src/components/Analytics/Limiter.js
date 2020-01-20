import React from "react";
import "./Limiter.css"

const Limiter = ({dataPointLimit, handleSetDataPointLimit}) => {
  return (
    <div className="limiter-select-container">
      <div className="limiter-select-wrapper">
            <label htmlFor="limiter-input">Límite</label>
            <input 
              type="number" 
              id="limiter-input" 
              name="limiter-input"
              value={dataPointLimit}
              onChange={e => handleSetDataPointLimit(e)}
            />
      </div>
    </div>
  )
}

export default Limiter
