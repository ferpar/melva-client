import React from "react";
import "./IntroMsg.css";

const IntroMsg = props => (
  <div className="intromsg-container">
    <div className="intromsg-wrapper">
      <h1 id="intromsg-title"> Bienvenid@ </h1>
      <p>Empezemos por introducir los datos de tu franquicia</p>
      <button 
        className="intromsg-button" 
        onClick={props.handleIsConfiguring}
      >
      Comenzar
      </button>
    </div>
  </div>
)


export default IntroMsg;
