import React from "react";

const confirmModal = ({
  recipients,
  message,
  greeting,
  customLink,
  translateToGSM
}) => (
        <div className="modal-text">
          <p>
            {"Confirme el envío de "}
            {recipients.filter( 
              recipient => (
                recipient.selected && (
                  recipient.smsStatus==="not-sent" || 
                  recipient.smsStatus===null)))
            .length} 
            {" mensajes con el siguiente mensaje: "}
          </p>
          <p>
            {"<<"}
              {greeting 
                ? 
                ( customLink 
                  ? translateToGSM("Hola (NOMBRE), "
                    + message 
                    + " https://dentt.info/xxxxxxxxx"
                  ) 
                  : translateToGSM("Hola (NOMBRE), " + message) 
                ) 
                : 
                ( customLink 
                  ? translateToGSM(message + " https://dentt.info/xxxxxxxxx") 
                  : translateToGSM(message) 
                )
              }
            {">>"}
          </p>
        </div>
)

const deleteModal = ({title}) => (
        <div className="modal-text">
          <p>
            Confirme el BORRADO PERMANENTE de la siguiente campaña:
          </p>
          <p>
            {"<<"}{title}{">>"}
          </p>
        </div>
)

export { confirmModal, deleteModal }
