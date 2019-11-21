import React from "react";
import "./CampaignSelector.css";

const CampaignSelector = props => (
  <div className="campaign-selector-container">
    <h2>Cita para:</h2>
    {
      props.availableCampaigns && props.availableCampaigns.map(
        (campaign, idx) => {
          return (
          <p 
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
)

export default CampaignSelector
