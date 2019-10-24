import React from "react";
import "./CampaignsList.css";

const CampaignsList = props => {
  return (
    <div className="camplist-container">
      <div className="camplist-wrapper">
        <h1 className="camplist-title">Campaigns</h1>
        {props.franchise.campaigns ? (
          props.franchise.campaigns.map((campaign, ind) => (
            <p key={ind}>{campaign.title}</p>
          ))
        ) : (
          <p> No campaigns created yet </p>
        )}
        <hr className="camplist-separator" />
        <button className="camplist-button">Campaign Manager</button>
      </div>
    </div>
  );
};

export default CampaignsList;
