import React from "react";
import "./YearSelector.css";

const LookupYearSelector = ({ lookupYear, handleSetLookupYear, availableYears }) => {
  return (
    <div className="year-select-container">
      <div className="year-select-wrapper">

          <div className="year-select-divider">
            <label htmlFor="year-select">Año</label>
            <select onChange={e => handleSetLookupYear(e)} id="year-select" name="year-select">
              <option 
                value={lookupYear ? lookupYear : null}
              >
                {lookupYear ? lookupYear: "---"}
              </option>
              {availableYears
                .map( (year, ind) => (
                <option key={ind} value={year}>{year}</option>
              ))}
            </select>
          </div>

      </div>
    </div>
  )
}

export default LookupYearSelector
