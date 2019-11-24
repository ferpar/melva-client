import React from "react";
import "./CampaignSelector.css";

const CampaignSelector = props => (
  <div className="campaign-selector-container">
    <h2>Cita para:</h2>
    <div className="selections-container">
    {
      props.availableCampaigns && props.availableCampaigns.map(
        (campaign, idx) => {
          return (
          <p 
            className="campaign-button"
            key={idx}
            onClick={() => {
              console.log("clicked!")
              console.log(campaign._id)
              props.changeActiveCampaignHandler(campaign._id)
              } 
            } 
          >
            {campaign && (
            campaign.shortDescription 
            ? campaign.shortDescription
            : campaign.title)}
          </p>
          )
        }
      ) 
    }
    </div>
  </div>
)

export default CampaignSelector
