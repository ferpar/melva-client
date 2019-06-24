import React from "react";
import axios from "axios";
import { hot } from "react-hot-loader";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

import { toast } from "react-toastify";
toast.configure();

import twoDigits from "../helpers/twodigit.js";

class Appointment extends React.Component {
  state = {
    date: null,
    appointments: []
  };

  dateChangeHandler = e => {
    this.setState({ ...this.state, date: e[0] }, () => console.log(this.state));
  };

  printLoggedIn = () => {
    axios
      .get("http://192.168.1.51:3010/api/auth/loggedin", {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        withCredentials: true // <= that's what changed
      })
      .then(result => console.log(result.data))
      .catch(err => console.log("there was an error fetching the data " + err));
  };

  printDate = id => {
    console.log(id);
    console.log(this.props.user);
    axios
      .get("http://192.168.1.51:3010/api/appointments/get-single/" + id, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        withCredentials: true // <= that's what changed
      })
      .then(result => console.log(result.data))
      .catch(err => console.log("there was an error fetching the data " + err));
  };

  bookDate = (id, available) => {
    const userId = available ? this.props.user._id : null;
    const postData = { id, userId };
    const slotIndex = this.state.appointments.findIndex(
      appointment => appointment._id === id
    );
    axios
      .post("http://192.168.1.51:3010/api/appointments/book/", postData, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json"
        },
        withCredentials: true // <= that's what changed
      })
      .then(result => {
        console.log(result.data);
        const newAppointments = [...this.state.appointments];
        newAppointments[slotIndex].customer = userId;
        this.setState({ appointments: newAppointments }, () => {
          console.log(available);
          this.notify(slotIndex, available);
        });
      })
      .catch(err => console.log("there was an error fetching the data ", +err));
  };

  notify = (slotIndex, available) =>
    toast(
      available
        ? "🦄 wow so ez! booked appointment @" +
            new Date(this.state.appointments[slotIndex].time).getHours() +
            ":" +
            twoDigits(
              new Date(this.state.appointments[slotIndex].time).getMinutes()
            )
        : "❎ booking canceled"
    );

  componentDidUpdate(prevProps, prevState) {
    const { date } = this.state;
    const year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    const dateStr = `${year}-${month}-${day}`;
    if (
      prevState.date === null ||
      prevState.date.toISOString() !== this.state.date.toISOString()
    ) {
      axios
        .get("http://192.168.1.51:3010/api/appointments/get/" + dateStr)
        .then(result =>
          this.setState({ appointments: result.data }, () => {
            console.log(result);
            console.log(this.state);
          })
        )
        .catch(err => console.error("Error during appointment retrieval", err));
    }
  }

  render() {
    const { date, appointments } = this.state;
    console.log(appointments);
    return (
      <div className="appointments-main">
        <div className="top-container">
          <h2>choose a Date</h2>
          <Flatpickr onChange={e => this.dateChangeHandler(e)} />
          <h2>{date && date.toDateString()}</h2>
        </div>
        <div className="appointments-grid">
          {appointments &&
            appointments
              .map(appointment => ({
                date: new Date(appointment.time),
                available: appointment.customer === null,
                id: appointment._id
              }))
              .map(({ date, available, id }, index) => (
                <button
                  className={
                    available
                      ? "appointment-item available"
                      : "appointment-item"
                  }
                  idx={id}
                  key={index}
                  onClick={() => this.bookDate(id, available)}
                >
                  {date.getHours()}
                  {":"}
                  {twoDigits(date.getMinutes())}
                </button>
              ))}
        </div>
      </div>
    );
  }
}

export default hot(module)(Appointment);
