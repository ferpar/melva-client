import React, { useState } from "react";
import "./Scheduler.css";

import AddSingleForm from "./Scheduler/AddSingleForm.js";

const Scheduler = props => {
  const [addSingle, setAddSingle] = useState(false)

  const handleSetAddSingle = () => {
    setAddSingle(!addSingle)
  }

  return (
    <div className="scheduler-container">
      <div className="scheduler-wrapper">
        <h1>Scheduler</h1>
        { addSingle ? (
          <AddSingleForm
            handleSetAddSingle={handleSetAddSingle}
            appointmentService={props.appointmentService}
          />
        ) : (
          <button onClick={handleSetAddSingle}> Nueva cita </button>
        )
        }
      </div>
    </div>
  )
}

export default Scheduler
