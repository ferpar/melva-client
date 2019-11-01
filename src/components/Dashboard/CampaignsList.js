import React from "react";
import "./CampaignsList.css";

import { Link } from "react-router-dom";

const CampaignsList = props => {
  return (
    <div className="camplist-container">
      <div className="camplist-wrapper">
        <h1 className="camplist-title">Campañas</h1>
        {props.franchise.campaigns ? (
          props.franchise.campaigns.map((campaign, ind) => (
            <p key={ind}>{campaign.title}</p>
          ))
        ) : (
          <p> Ninguna campaña creada </p>
        )}
        <hr className="camplist-separator" />
        <Link 
          to="/campaigns"
          className="camplist-button"
        >
        Ir a Gestor de Campañas
        </Link>
      </div>
    </div>
  );
};

export default CampaignsList;
