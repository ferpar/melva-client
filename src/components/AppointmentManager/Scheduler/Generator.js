import React, { useState, useReducer, useEffect } from "react";
import "./Generator/Generator.css";
import moment from "moment-timezone";

import DayHeader from "./Generator/DayHeader/DayHeader.js"
import DayList from "./Generator/DayList/DayList.js"

import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/themes/material_green.css";

const Generator = props => { 

  const [isEditingRanges, setEditingRanges] = useState(false)

  const handleEditingRanges = () => {
    setEditingRanges( !isEditingRanges )
  }

  const [rangeMin, setMinRange] = useState("08:00")
  const [rangeMax, setMaxRange] = useState("12:00")

  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)

  const [multiDuration, setMultiDuration] = useState("30")

  const handleDateChange = e => {
    setDateFrom(e[0]);
    setDateTo(e[1]);
  }

  const initialState = [
    { day: 1, checked: false, initial: "L", ranges: [] },
    { day: 2, checked: false, initial: "M", ranges: [] },
    { day: 3, checked: false, initial: "X", ranges: [] },
    { day: 4, checked: false, initial: "J", ranges: [] },
    { day: 5, checked: false, initial: "V", ranges: [] },
    { day: 6, checked: false, initial: "S", ranges: [] },
    { day: 0, checked: false, initial: "D", ranges: [] }
  ]
  const [schedule, dispatch] = useReducer((state, action) => {
    const index = state.findIndex( row => row.day === action.day)
    switch (action.type) {
      case 'add':
        return [
          ...state.slice(0, index),
          {
            ...state[index], 
            ranges: 
              [...state[index].ranges, action.range]
              .sort((a,b) => parseInt(
                  a.start.slice(0,2) + a.start.slice(3)
                ) - parseInt(
                  b.start.slice(0,2) + b.start.slice(3)
                )
              )
          },
          ...state.slice(index + 1)
        ]
      case 'remove':
        return [
          ...state.slice(0, index),
          {
            ...state[index],
            ranges:
              [
                ...state[index].ranges.slice(0, action.ind),
                ...state[index].ranges.slice(action.ind +1)
              ]
          },
          ...state.slice(index + 1)
        ]
      case 'checkbox':
        return [
          ...state.slice(0,index),
          {...state[index], checked: !state[index].checked},
          ...state.slice(index+1)]
      default:
        return state
    }
  }, initialState)

  const handleChecked = (e, day) => {
    dispatch({
      type: "checkbox", day: day
    })
  }

  const handleAddRange = (start, end) => {
    schedule.forEach ( day => {
      if (day.checked) {
        dispatch({
          type: "add",
          day: day.day,
          range: {
            start,
            end
          }
        })
      }
    })
  }

  const handleRemoveRange = (day, ind) => {
    dispatch({
      type:"remove",
      day,
      ind
    })
  }

  const toMinutes = (time) => {
    return parseInt(time.slice(0,2))*60 + parseInt(time.slice(3))
  }

  const toTimeCoords = (minutes) => {
    return {hours: parseInt(minutes/60), minutes: minutes%60}
  }

  const handleGenerateAppointments = async () => {

    const startsObject = {}
    schedule.forEach( weekDay => {
      startsObject[weekDay.day] = []
      weekDay.ranges.forEach( range => {
        const appointmentNumber = 
          (toMinutes(range.end) - toMinutes(range.start))/multiDuration
        for (let i=0; i<appointmentNumber; i++){
          startsObject[weekDay.day].push(toTimeCoords(toMinutes(range.start)+i*multiDuration))
        }
      })  
    })
    const days = moment(dateTo).diff(moment(dateFrom), 'days')
    const daysArray = []
    const appointmentsArray = []
    for(let i=0; i<=days; i++) {
      let momentDate = moment(dateFrom).add(i,'days')
      let dayAppointments = []
      startsObject[momentDate.day()].forEach(timepair => {
        dayAppointments.push(momentDate.hours(timepair.hours).minutes(timepair.minutes).format())
        appointmentsArray.push(
          {
            time: new Date(momentDate.hours(timepair.hours).minutes(timepair.minutes).format()),
            duration: multiDuration,
            location: props.location,
            campaign: props.campaign,
            franchise: props.franchise._id
          }
        )
      } )
      daysArray.push([momentDate.day(), dayAppointments])
    }
    console.log(daysArray)
    console.log(appointmentsArray)

    try {
      const sentAppointments = await props.appointmentService.create(appointmentsArray)
      await props.handleAppointments()
    } catch (err) {
      console.error("[Handler] Error creating appointments", err)
    }
  }

  return (
    <div className="generator-container">
      <div className="generator-intervals">
        { !isEditingRanges &&
        <button
          onClick={props.handleGenerator}
        >
        Volver
        </button>
        }
        <button onClick={ handleEditingRanges }
        > 
        { isEditingRanges ?
          ("Volver") :
          ("Definir Horario") 
        }
        </button>
        { isEditingRanges && 
          <div className="interval-picker">
            <p>De</p>
            <Flatpickr
              options={{ 
                locale: Spanish,
                noCalendar:true,
                enableTime:true,
                dateFormat:"H:i",
                defaultDate:"08:00"
              }}
              className="generator-flatpickr"
              placeholder="pulse aquí..."
              onChange={e => setMinRange(e[0].toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}))}
            />
            <p>a</p>
            <Flatpickr
              options={{ 
                locale: Spanish,
                noCalendar:true,
                enableTime:true,
                dateFormat:"H:i",
                defaultDate:"12:00"
              }}
              className="generator-flatpickr"
              placeholder="y aquí..."
              onChange={e => setMaxRange(e[0].toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}))}
            />
          { schedule
              .map( day => day.checked )
              .reduce( (ac, cu) => { 
                if (cu===true) {
                  ac=true
                }
                return ac
              }, false)
            ?
            (
              <button
              onClick={() => handleAddRange(rangeMin, rangeMax)}
            >
              Añadir Intervalo
            </button>
            )
            : (
             <p> Elige días </p>  
            )
          }
          </div>
        }
      </div>
      <div className="generator-schedule">

        { schedule.map( (day, ind) => (
            <div 
              className="generator-slug"
              key={ind}
            >
              <DayHeader 
                className = "dayhead"
                initial = {day.initial}
                day = {day.day}
                isEditingRanges = {isEditingRanges}
                handleChecked = {handleChecked}
                checked = {day.checked}
                schedule = {schedule}
              />
              <DayList
                className = "daylist"
                ranges = {day.ranges}
                day={day.day}
                handleRemoveRange={handleRemoveRange}
              />
            </div>
          )) 
        }
      </div>
      { schedule
          .map( day => day.ranges)
          .reduce( (ac,cu) => ac.concat(...cu), [])
          .length === 0
          ? (
            <div className="generator-headsup">
              <p> Añade Intervalos al Horario </p>
            </div>
          )
          : (
            <div className="generator-controls">
              <div className="add-multi-duration">
                <label 
                  id="multi-duration-label" 
                  htmlFor="multi-duration"
                >
                  Duración cita (min)
                </label>
                <input 
                  type="text"
                  id="multi-duration"
                  name="multi-duration"
                  value={multiDuration}
                  onChange={e=> setMultiDuration(e.target.value)}
                />
              </div>
              <div className="period-picker">
               <p>Periodo</p>
               <Flatpickr
                options={{ 
                  locale: Spanish,
                    mode: "range",
                    minDate: "today"
                }}
                className="range-flatpickr"
                placeholder="desde hasta..."
                onChange={ e => handleDateChange(e)}
                
              / >
              </div>
              { (dateTo && dateFrom) 
                ? (
              <button
               onClick={handleGenerateAppointments}
               >
                 Generar Citas
              </button>
                ) : (
                <p className="period-headsup">Elige un periodo</p>
                )
              }
              <button
               onClick={props.toggleConfirmCleanUpModal}
               >
                 Borrar Citas Disponibles
              </button>
            </div>
          )
      }
    </div>
  )
}


export default Generator
