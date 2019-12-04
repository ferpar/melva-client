import React, {useState} from "react";
import "./DayHeader.css";

const DayHeader = props => {

  return (
    <>
      { props.isEditingRanges ?
        (
        <div className="day-header">
            <input 
              onChange={() => props.handleChecked( props.day)
              }
              type="checkbox"
              checked = {props.checked}
            />
          <p
            onClick={() => props.handleChecked( props.day)}
          >
            {props.initial}
          </p>
          
        </div>
        ) : (
        <div className="day-header">
          <p>
            {props.initial}
          </p>

          </div>
        )
      }
    </>
  )
}

export default DayHeader
