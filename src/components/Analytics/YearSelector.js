import React from "react";
import "./YearSelector.css"

const YearSelector = ({selectedYears, handleSetSelectedYears, availableYears}) => {
  return (
    <div className="year-select-container">
      <div className="year-select-wrapper">

          <div className="year-select-divider">
            <label htmlFor="year-select">Desde</label>
            <select onChange={e => handleSetSelectedYears(e, "start")} id="year-select" name="year-select">
              <option 
                value={selectedYears ? selectedYears.start : null}
              >
                {selectedYears ? selectedYears.start : "---"}
              </option>
              {availableYears
                .filter(year => {
                  return selectedYears ?
                    year <= selectedYears.end
                  :
                    year
                })
                .map( (year, ind) => (
                <option key={ind} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="year-select-divider">
            <label htmlFor="year-select">Hasta</label>
            <select onChange={e => handleSetSelectedYears(e, "end")} id="year-select" name="year-select">
              <option 
                value={selectedYears ? selectedYears.end : null}
              >
                {selectedYears ? selectedYears.end : "---"}
              </option>
              {availableYears
                .filter(year => {
                  return selectedYears ?
                    year >= parseInt(selectedYears.start)
                  :
                    year
                })
                .map( (year, ind) => (
                <option key={ind} value={year}>{year}</option>
              ))}
            </select>
          </div>

      </div>
    </div>
  )
}

export default YearSelector
