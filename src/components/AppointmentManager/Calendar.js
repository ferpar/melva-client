import React, { useState, useEffect } from "react";
import "./Calendar.css";

import { Calendar, momentLocalizer } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";      
import moment from "moment-timezone"

const localizer = momentLocalizer(moment)      
      
const MyCalendar = props => {

  const initialEvents = [
      {
        start: new Date(),
        end: new Date(moment().add(1, "days")),
        title: "Some title"
      }
    ]

  const [events, useEvents] = useState(initialEvents)

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <h1>Calendar</h1>
        <Calendar
          culture={"es"}
          localizer={localizer}
          events={props.events}
          startAccessor="start"
          endAccessor="end"
          style={{height: 500}}
        />
      </div>
    </div>
  )
}

export default MyCalendar
