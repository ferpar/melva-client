import React, { useState, useEffect } from "react";
import "./Locations.css"

import LocationsForm from "./Locations/LocationsForm.js";

const Locations = props => {

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [locations, setLocations] = useState(props.franchise.locations)
  const [locationToEdit, setLocationToEdit] = useState("")

  const handleIsFormOpen = () => {
    setIsFormOpen(!isFormOpen)
  }

  const handleAddLocation = savedLocation => {
    setLocations([...locations, savedLocation])
  }

  const handleLocationToEdit = locationId => {
    setLocationToEdit(locationId)
    handleIsFormOpen()
  }

  const handleUpdateLocation = updatedLocation => {
    console.log(updatedLocation)
    const position = locations.findIndex( location => location._id === updatedLocation._id )
    console.log(position)

    setLocations([...locations.slice(0, position), updatedLocation, ...locations.slice(position+1)])
    
  }
  
  return (
   <div className="locations-container">
     <div className="locations-wrapper">
       <h1 className="locations-title">Clinicas</h1>
         {locations ? (
         locations.map( (location, ind) => (
           <div 
            className="locations-slug"
            key={ind}
           >
            <p >{location.name}</p>
            <button
              className="locations-button"
              onClick={() => handleLocationToEdit(location._id)} 
            >
              Editar
            </button> 
           </div>
         )) 
         ) : (<p>No Locations added yet</p>)}
       <hr className="locations-separator"/>
      
       { isFormOpen ? (
       <LocationsForm
         handleIsFormOpen={handleIsFormOpen}  
         franchiseService={props.franchiseService}
         handleAddLocation={handleAddLocation}
         locations={locations}
         locationToEdit={locationToEdit}
         handleLocationToEdit={handleLocationToEdit}
         handleUpdateLocation={handleUpdateLocation}
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
