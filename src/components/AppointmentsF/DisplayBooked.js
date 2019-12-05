import React from "react";
import twoDigits from "../../helpers/twodigit.js";

const DisplayBooked = ({userAppointments, activeCampaign, expandContact, setExpandContact, setBookInfo, toggleCancelModal, handleLogout}) => (
      <div className="user-appointments-container">
        <h1 className="user-appointments-title" >¡Enhorabuena!</h1>
        {userAppointments
          .filter(appointment => //only count appointments of the selected / active campaign
          appointment.campaign === activeCampaign)
          .filter(appointment => //filtering overdue appointments
            new Date(appointment.time).getTime() > new Date().getTime()) 
          .map(appointment => ({
            available: false,
            duration: appointment.duration,
            date: new Date(appointment.time),
            id: appointment._id,
            bookedFor: appointment.customer,
            location: appointment.location
          }))
          .map(({available, date, duration, id, bookedFor, location}, index) => {
            return (
              <div key={index} className="user-appointment">
                <div className="appointment-details">
                  <h2>Cita Reservada</h2>
                  <p>
                  {"Para el "}
                  {date &&
                    date.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <p>
                  {"A las "}
                  {date &&
                    date.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit"
                    }) 
                  }
                  </p>
                  <p>En Clínica Rull - Sevilla</p>
                  <p>Duración: {duration} min</p>
                  <p className="expand-contact" onClick={()=>setExpandContact(!expandContact)}>datos de contacto {expandContact ? "\u25b2" : "\u25bc"}</p>
                  {  
                      expandContact && 
                    <div className="contact-details">
                      <p className="address">{location.address}</p>
                      <p className="address">{location.zipcode} - {location.city}</p>
                      { location.phone && <a href={location.phone}>{"\uD83D\uDCDE"} {location.phone}</a> }
                      { location.email && <a href={`mailto:${location.email}`}>{"\uD83D\uDCEC"} {location.email}</a>} 
                      { location.url && <a href={`http:\/\/${location.url}`}>{"\uD83C\uDF0D"} {location.url}</a> }
                    </div>
                  }
                </div>
                <button
                  onClick = { 
                      () => { 
                            setBookInfo({
                              id,
                              available,
                              hour:
                                date.getHours() + ":" + twoDigits(date.getMinutes()),
                              date
                            });
                            toggleCancelModal();
                      }
                    }
                  className="cancel-user-appointment"
                >
                  Cancelar Cita
                </button>
              </div>
            )
          }
        )}

          <button 
            className="exit-button" 
            onClick={handleLogout}
          >
            Terminar y Salir
          </button>
      </div>
)

export default DisplayBooked
