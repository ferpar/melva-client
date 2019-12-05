import React from "react";
import twoDigits from "../../helpers/twodigit.js";

const AppointmentGrid = ({appointments, user, setBookInfo, toggleConfirmModal, toggleCancelModal, toggleUnavailableModal, date}) => (
          <div className="appointments-grid">
            {appointments
            .map(appointment => ({
              date: new Date(appointment.time),
              available: appointment.customer === null,
              id: appointment._id,
              bookedFor: appointment.customer
            }))            
              .sort((a,b) => a.date.getMinutes()- b.date.getMinutes())
              .sort((a,b) => a.date.getHours()-b.date.getHours())
            .map(({ date, available, id, bookedFor }, index) => (
              <button
                className={
                  (user._id === bookedFor || !bookedFor ) ? (
                  available ? "appointment-item available" : "appointment-item"
                  ) : "appointment-item unavailable"
                }
                idx={id}
                key={index}
                onClick={() => {
                  if (available || user._id === bookedFor) {
                    if (available) {
                      setBookInfo({
                        id,
                        available,
                        hour:
                          date.getHours() + ":" + twoDigits(date.getMinutes()),
                        date
                      });
                      toggleConfirmModal();
                    } else {
                      setBookInfo({
                        id,
                        available,
                        hour:
                          date.getHours() + ":" + twoDigits(date.getMinutes()),
                        date
                      });
                      toggleCancelModal();
                    }
                  } else {
                    setBookInfo({
                      id,
                      available,
                      hour:
                        date.getHours() + ":" + twoDigits(date.getMinutes()),
                      date
                    });
                    toggleUnavailableModal();
                  }
                }}
              >
                {date.getHours()}
                {":"}
                {twoDigits(date.getMinutes())}
              </button>
            ))}
          </div>
)

export default AppointmentGrid
