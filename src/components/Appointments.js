import React from 'react'
import axios from 'axios'
import {hot} from 'react-hot-loader'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_green.css'

import twoDigits from '../helpers/twodigit.js'

class Appointment extends React.Component {
  state = {
    date: null,
    appointments: []
  }

  dateChangeHandler = e => {
    this.setState({...this.state, date: e[0]}, () => console.log(this.state))
  }

  printLoggedIn = () => {
    axios.get('http://192.168.1.51:3010/api/auth/loggedin', {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/json',
        },
      withCredentials: true // <= that's what changed
    })
    .then(result => console.log(result.data))
    .catch( err => console.log('there was an error fetching the data ' + err))
  }

  componentDidUpdate( prevProps,prevState) {
    const {date} = this.state;
    const year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();
    const dateStr = `${year}-${month}-${day}`
    if (prevState.date === null || prevState.date.toISOString()!==this.state.date.toISOString())
    {
        axios.get('http://192.168.1.51:3010/api/appointments/get/' + dateStr)
        .then( result => this.setState({appointments: result.data}, () => {console.log(result); console.log(this.state) }) )
        .catch( err => console.error('Error during appointment retrieval', err))
    }
  }

  render() {
    const {date, appointments} = this.state;
    return (
      <div>
        <h2>choose a Date</h2>
        <Flatpickr onChange={(e) => this.dateChangeHandler(e)} />
        <h2>
          {date && date.toDateString()} 
        </h2>
        <div className="appointments-grid">
          {appointments && 
            appointments
            .map((appointment) => ({
              date: new Date(appointment.time),
              availability: (appointment.customer===null),
              id: appointment._id
            }))
            .map(({date, availability, id},index) => (
              <button 
                className="appointment-item"
                idx={id}
                key={index}
                onClick={this.printLoggedIn}
              >
              {date.getHours()}{':'}{twoDigits(date.getMinutes())}
              </button>
            ))
          }
        </div>
      </div>
    )
  }
}

export default hot(module)(Appointment)
