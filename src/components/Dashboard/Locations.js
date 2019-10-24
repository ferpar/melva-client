import React, { useState, useEffect } from "react";
import "./Locations.css"

import LocationsForm from "./Locations/LocationsForm.js";

const Locations = props => {

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [locations, setLocations] = useState(props.franchise.locations)

  const handleIsFormOpen = () => {
    setIsFormOpen(!isFormOpen)
  }

  const handleAddLocation = location => {
    setLocations([...locations, location])
  }
  
  return (
   <div className="locations-container">
     <div className="locations-wrapper">
       <h1 className="locations-title">Clinicas</h1>
         {locations ? (
         locations.map( (location, ind) => (
          <p key={ind} >{location.name}</p>
         )) 
         ) : (<p>No Locations added yet</p>)}
       <hr className="locations-separator"/>
      
       { isFormOpen ? (
       <LocationsForm
         handleIsFormOpen={handleIsFormOpen}  
         franchiseService={props.franchiseService}
         handleAddLocation={handleAddLocation}
       /> 
       ) : (
       <button 
         className="locations-button" 
         onClick={() => setIsFormOpen(true)}
       >
       Añadir
       </button>
       )}
     </div>
   </div>
  )
}

export default Locations
