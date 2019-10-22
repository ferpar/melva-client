import React from "react";
import "./FranchiseInfo.css";

const FranchiseInfo = props => (
 <div className="frainfo-container">
   <div className="frainfo-wrapper">
     <h1 id="frainfo-title">{props.franchise.name}</h1>
     <div className="frainfo-details">
       <p>Remitente SMS: {props.franchise.smsName}</p>
     </div>
     <button 
        className="frainfo-button"
        onClick={props.handleIsEditing}
        >
        Editar
      </button>
   </div>
 </div>   
)

export default FranchiseInfo;
