import React, { useState } from "react";
import "./Locations.css"

import LocationsForm from "./Locations/LocationsForm.js";

const Locations = props => {

  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleIsFormOpen = () => {
    setIsFormOpen(!isFormOpen)
  }
  
  return (
   <div className="locations-container">
     <div className="locations-wrapper">
       <h1 className="locations-title">Clinicas</h1>
         {props.locations ? (
         props.locations.map(location => (
          <p>{location.name}</p>
         )) 
         ) : (<p>No Locations added yet</p>)}
       <hr className="locations-separator"/>
      
       { isFormOpen ? (
       <LocationsForm
         handleIsFormOpen={handleIsFormOpen}  
         franchiseService={props.franchiseService}
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
