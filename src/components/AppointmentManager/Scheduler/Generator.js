import React, { useReducer } from "react";
import "./Generator/Generator.css";

import DayHeader from "./Generator/DayHeader/DayHeader.js"
import DayList from "./Generator/DayList/DayList.js"

const Generator = props => { 

  const initialState = [
    { day: 1, initial: "L", ranges: [{start:"8", end:"10"}] },
    { day: 2, initial: "M", ranges: [] },
    { day: 3, initial: "X", ranges: [] },
    { day: 4, initial: "J", ranges: [] },
    { day: 5, initial: "V", ranges: [] },
    { day: 6, initial: "S", ranges: [] },
    { day: 0, initial: "D", ranges: [] }
  ]
  const [schedule, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'add':
        state[action.day].ranges.push(action.range)
        return state
      default:
        return state
    }
  }, initialState)

  return (
    <div className="generator-container">
    { schedule.map( (day, ind) => (
        <div 
          className="generator-slug"
          key={ind}
        >
          <DayHeader 
            className = "dayhead"
            initial = { day.initial }
          />
          <DayList
            className = "daylist"
            ranges = {day.ranges}
          />
        </div>
      )) 
    }
    </div>
  )
}


export default Generator
