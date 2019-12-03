import React from "react";
import "./BookingList.css";

const BookingList = props => {

  return (
    
        <div className="book-list">
          <h1>Citas pendientes</h1> 
          { Object.keys(props.groupedAppointments).length > 0
              ? (
          <div className="booking-grid">
            { Object.keys(props.groupedAppointments)
              .sort((a,b) => {
                const dateA = a.split(' ')[1].split('/');
                const dateB = b.split(' ')[1].split('/');
                return (  new Date(dateA[2], dateA[1], dateA[0]).getTime()  - new Date(dateB[2], dateB[1], dateB[0]).getTime())})
              .map( (day, index) => (

              <div key={index}>
              <h2 className="book-list-day">{day}</h2>
                {
                props.groupedAppointments[day]
                .map(appointment => ({
                date: new Date(appointment.time),
                available: appointment.customer === null,
                id: appointment._id,
                bookedFor: appointment.customer,
                updated: new Date(appointment.updated_at),
                campaignId: appointment.campaign
                })
                )
                .sort((a,b) => a.date.getMinutes()- b.date.getMinutes())
                .sort( (a,b) => a.date.getHours() - b.date.getHours())
                .map(({ date, available, id, bookedFor, updated, campaignId }, index) => (
                  <div className="appointment-info" key={index}>
                    {!props.selectedCampaign && //showing campaign of each when "all" is selected
                        (<p> 
                          { props.campaigns
                            .find( campaign => 
                              campaign._id === campaignId).title }
                          </p>)
                    }
                    <p>{bookedFor.name + " " + bookedFor.surname}</p>
                    <p>hora:  {date.toLocaleTimeString("es-Es", 
                      {
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )} </p>
                    {(new Date() - updated <= 3600*1000*12)
                      && <span className="ball"></span>}
                    {(new Date() - updated <= 3600*1000*12) 
                      && <p>Hace {parseInt((new Date() - updated) / 1000 / 3600)} horas</p>}
                  </div>
                ))
                }
              </div>
            ))
            
            }
          </div>
            ) : (
              <div className="no-appointments">

                { props.selectedLocation 
                  ? <p> No hay citas pendientes </p>
                  : <p> Por favor, seleccione una clínica </p> 
                }
                
              </div>
            )
          }
        </div>
  )

}

export default BookingList;
