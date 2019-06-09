import React from 'react'
import {hot} from 'react-hot-loader'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_green.css'

class App extends React.Component {
  state = {
    count: 0,
    date: null
  }

  dateChangeHandler = e => {
    this.setState({...this.state, date: e[0]}, () => console.log(this.state))
  }

  componentDidUpdate() {
    
  }

  render() {
    const {count} = this.state;
    return (
      <div>
      <h1>Hello World!! - from the dev server</h1>
      <h2 className={count > 10 ? 'warning' : null}>
        Count: {count}
      </h2>
      <button onClick={() => this.setState(state => ({count: state.count + 1}))}>+</button>
      <button onClick={() => this.setState(state => ({count: state.count - 1}))}>-</button>
      <div>
        <h2>choose a Date</h2>
        <Flatpickr onChange={(e) => this.dateChangeHandler(e)} />
        <h2>
          {this.state.date && this.state.date.toDateString()} 
        </h2>
      </div>
      </div>
    )
  }
}

export default hot(module)(App)
