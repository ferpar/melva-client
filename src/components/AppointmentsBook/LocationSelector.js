import React, { useState } from "react";
import "./LocationSelector.css";

const LocationSelector = props => {

  const { selectedLocation, selectedCampaign } = props

  return (
    <div className="main-select-container">

      <div className="locsel-container">
        {props.locations.map( (location, ind) => (
          <div 
            key={ind} 
            className= {
              location._id === selectedLocation 
                ? "location-tag selected-tag" 
                : "location-tag"
            }
            onClick={() => {
              props.handleSelectLocation(location._id)
            }}
          >
            <p>{location.name}</p>
          </div>
        ))}
      </div>

      <div className="campsel-container">
        {props.selectedLocation ? ( 
          <>
          <div 
            className={ 
              props.selectedCampaign === "" 
                ? "campaign-tag selected-tag" 
                : "campaign-tag"
            }
            onClick={() => props.handleSelectCampaign("")}
          >
            <p>todas</p>
          </div>
          {props.campaigns
            .filter(campaign => 
              campaign.location === props.selectedLocation
            )
            .map( (campaign,ind) => (
              <div 
            className= {
              campaign._id === selectedCampaign 
                ? "campaign-tag selected-tag" 
                : "campaign-tag"
            }
                key={ind}
                onClick={() => {
                  props.handleSelectCampaign(campaign._id)
                }}
              >
                <p>{campaign.title}</p>
              </div>  
              )
            )}</>
        ) : (
          <p>...</p>
        )}
      </div>
    </div>
  )
}

export default LocationSelector
