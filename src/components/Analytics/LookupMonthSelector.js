import React from "react";
import "./YearSelector.css";

const LookupMonthSelector = ({ lookupMonth, handleSetLookupMonth, availableMonths }) => {
  return (
    <div className="year-select-container">
      <div className="year-select-wrapper">

          <div className="year-select-divider">
            <label htmlFor="year-select">Mes</label>
            <select onChange={e => handleSetLookupMonth(e)} id="year-select" name="year-select">
              <option 
                value={lookupMonth ? lookupMonth : null}
              >
                {lookupMonth ? lookupMonth: "---"}
              </option>
              { availableMonths && availableMonths
                .map( (year, ind) => (
                <option key={ind} value={year}>{year}</option>
              ))}
            </select>
          </div>

      </div>
    </div>
  )
}

export default LookupMonthSelector
