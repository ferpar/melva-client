import React from "react";
import "./DayList.css";

const DayList = props => (
  <div className="ranges-container">
  <hr className="daylist-separator" />
  { props.ranges.map( (range, ind) => (
      <p key={ind}>{range.start}{" - "}{range.end}</p>
    ))  
  }
  </div>
)

export default DayList
