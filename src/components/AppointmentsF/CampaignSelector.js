import React from "react";
import "./CampaignSelector.css";

const CampaignSelector = props => (
  <div className="campaign-selector-container">
  { props.isSelectorOpen ? 
    (
    <>
      <h2 className="cs-header">Cita para:</h2>
      <div className="selections-container">
      {
        props.availableCampaigns && props.availableCampaigns
        .filter(campaign =>  campaign && campaign.isActive)
        .map(
          (campaign, idx) => {
            return (
            <p 
              className="campaign-button"
              key={idx}
              onClick={() => {
                console.log("clicked!")
                console.log(campaign._id)
                props.changeActiveCampaignHandler(campaign._id)
                props.handleIsSelectorOpen()
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
    </>
    ) : (

    <div className="selections-container">
    {
      props.availableCampaigns && props.availableCampaigns
      .filter(campaign => campaign._id === props.activeCampaign)
      .map(
        (campaign, idx) => {
          return (
          <p 
            className="campaign-button"
            key={idx}
            onClick={() => {
              console.log("clicked!")
              console.log(campaign._id)
              props.handleIsSelectorOpen()
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
  }
  </div>
)

export default CampaignSelector
