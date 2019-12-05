import React from "react";
import logo_rull from "../../assets/logo_rull.png";
import Flatpickr from "react-flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/themes/material_green.css";
import moment from "moment-timezone";


const DatePickr = ({date, availableDates, dateChangeHandler, appointments }) => (
        <div className="top-container">
            <div className="appointments-title">
              <img className="top-logo" src={logo_rull} alt="logo"/>
              <h2>Nueva Cita</h2>
              { !date && <p> Seleccionar fecha: </p>}
            </div>
            <Flatpickr
              options={{ 
                dateFormat: 'd-m-Y',
                disableMobile: true,
                locale: Spanish,
                minDate: new Date( new Date().setDate( new Date().getDate() + 1)),
                altInput: true,
                altFormat: "F j, Y",
                enable: availableDates.length > 0 
                  ? [ ...availableDates.map( dateStr => new Date(moment.tz(dateStr,"Europe/Madrid").format())) ]
                  : ["2018-4-01"]
              }}
              className="appointments-flatpickr"
              placeholder="pulse aquí..."
              onChange={e => dateChangeHandler(e)}
            />
            <h2 className="appointments-date">
            {date &&
              date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            {(appointments.length > 0 && date) ? 
                <p>Por favor, seleccione una hora</p>
            :   date && <p>No hay citas previstas para este día, por favor, escoja otro</p>
            }
            </h2>
        </div>
)

export default DatePickr
