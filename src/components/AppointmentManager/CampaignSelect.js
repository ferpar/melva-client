import React from "react";
import "./CampaignSelect.css"

const CampaignSelect = props => {
  const locations = props.franchise.locations
  return (
    <div className="cselect-container">
      <div className="cselect-wrapper">

          <label htmlFor="location-select">clínica</label>
          <select onChange={e => props.handleSetLocation(e)} id="location-select" name="location-select">
            <option value="">seleccionar clínica</option>
            {locations.map( (location, ind) => (
              <option key={ind} value={location._id}>{location.name}</option>
            ))}
          </select>

          <label htmlFor="campaign-select">cargar campaña</label>
          <select onChange={e => props.handleSetCampaign(e)} id="campaign-select" name="campaign-select">
            <option value="">seleccionar campaña</option>
            {props.filteredCampaigns.map( (campaign, ind) => (
              <option key={ind} value={campaign._id}>{campaign.title}</option> 
            ))}
          </select>

      </div>
    </div>
  )
}

export default CampaignSelect
