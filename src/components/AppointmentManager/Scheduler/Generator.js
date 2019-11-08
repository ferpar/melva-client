import React, { useState, useReducer, useEffect } from "react";
import "./Generator/Generator.css";

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
    console.log(index)
    switch (action.type) {
      case 'add':
      //  state[index].ranges.push(action.range)
      //  state[index].ranges.sort((a,b) => a.start - b.start)
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
        return state
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

  const removeRange = (day, ind) => {

  }

  useEffect( () => {
    console.log(schedule)
  } , [schedule])

  return (
    <div className="generator-container">
      <button onClick={ handleEditingRanges }
      > 
      { isEditingRanges ?
        ("Cancelar") :
        ("Editar Horario") 
      }
      </button>
      { isEditingRanges && 
        <>
          <Flatpickr
            options={{ 
              locale: Spanish,
              noCalendar:true,
              enableTime:true,
              dateFormat:"H:i",
              defaultDate:"08:00"
            }}
            className="appointments-flatpickr"
            placeholder="pulse aquí..."
            onChange={e => setMinRange(e[0].toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}))}
          />
          <Flatpickr
            options={{ 
              locale: Spanish,
              noCalendar:true,
              enableTime:true,
              dateFormat:"H:i",
              defaultDate:"12:00"
            }}
            className="appointments-flatpickr"
            placeholder="y aquí..."
            onChange={e => setMaxRange(e[0].toLocaleTimeString("es-ES", {hour: "2-digit", minute: "2-digit"}))}
          />
          <button
            onClick={() => handleAddRange(rangeMin, rangeMax)}
          >
            Añadir Horas
          </button>
        </>
      }
      <div className="generator-wrapper">
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
            />
          </div>
        )) 
      }
      </div>
      {
        isEditingRanges && (
         <button
          onClick={() => console.log(schedule)}
          >
            Generar Citas
         </button>
        )
      }
    </div>
  )
}


export default Generator
