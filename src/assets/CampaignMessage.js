import React from "react";

const CampaignMessage = ({
  message,
  handleMsgChange,
  greeting,
  handleGreetingChange,
  customLink,
  handleLinkChange,
  showGSM,
  handleClickGSM,
  translateToGSM,
  handleSubmit
}) => (
          <div className="campaigns-message">
            <h1>Campañas</h1>
            <form>
              <div className="textarea-container">
                <textarea className="main-textarea" onChange={e => handleMsgChange(e)} placeholder="Introduzca contenido del SMS..." value={message}/>

                <div className="info-options">
                  <div className="greeting-checkbox">
                    <input type="checkbox" id="greeting" name="greeting" checked={greeting} onChange={e => handleGreetingChange(e)}/>
                    <label htmlFor="greeting">Saludo personalizado</label>
                    <input type="checkbox" id="link" name="link" checked={customLink} onChange={e => handleLinkChange(e)}/>
                    <label htmlFor="link">Enlace personalizado</label>
                  </div>
                  <p className="character-counter">{ greeting ? 
                    (customLink ? message.length + 27 + 29 : message.length + 27) :
                    (customLink ? message.length + 29: message.length)}
                    /160 caracteres
                  </p>
                  <div className="errors"></div>
                </div>
                { 
                  showGSM && 
                  <textarea 
                    className="translated-textarea" 
                    readOnly 
                    value={greeting ? 
                      ( customLink ? 
                          translateToGSM("Hola (NOMBRE), " + 
                          message + " https://dentt.info/xxxxxxxxx") : 
                        translateToGSM("Hola (NOMBRE), " + message))
                      : ( customLink ? translateToGSM(message + 
                        " https://dentt.info/xxxxxxxxx") : 
                        translateToGSM(message) )}/> }
                <div className="campaign-buttons">
                  <button className="expand cp-button" onClick={e => handleClickGSM(e)}>{ showGSM ? "Ocultar" : "Vista Previa"} </button>
                  <button className="submit cs-button" onClick={e => handleSubmit(e)} type="submit">Enviar mensajes</button>
                </div>
              </div>
            </form>
          </div>
)

export default CampaignMessage
