import React from "react";
import "./Locations.css"

import LocationsForm from "./Locations/LocationsForm.js";

const Locations = props => (
 <div className="locations-container">
   <div className="locations-wrapper">
     <h1 className="locations-title">Locations</h1>
       {props.locations ? (
       props.locations.map(location => (
        <p>{location.name}</p>
       )) 
       ) : (<p>No Locations added yet</p>)}
     <hr className="locations-separator"/>
     <LocationsForm/>
   </div>
 </div>
)

export default Locations
