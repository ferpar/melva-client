import React, {useState} from "react";
import "./DayHeader.css";

const DayHeader = props => {

  return (
    <div className="day-header">
      { props.isEditingRanges &&
        <input 
          onChange={(e) => {props.handleChecked(e, props.day)
          }}
          type="checkbox"
          checked = {props.checked}
        />
      }
      
      <p>{props.initial}</p>
    </div>
  )
}

export default DayHeader
