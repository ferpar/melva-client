import React from "react";
import "./DayHeader.css";

const DayHeader = props => (
  <div className="day-header">
    <p>{props.initial}</p>
  </div>
)

export default DayHeader
