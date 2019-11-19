import React from "react";
import "./DayList.css";

const DayList = props => (
  <div className="ranges-container">
  <hr className="daylist-separator" />
  { props.ranges.map( (range, ind) => (
    <div className="daylist-range" key={ind}>
      <p>{range.start}{" - "}{range.end}</p>
      <button
        onClick={() => props.handleRemoveRange(props.day, ind)}
      >-</button>
    </div>
    ))  
  }
  </div>
)

export default DayList
