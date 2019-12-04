import React from "react";

const confirmModal = ({ bookInfo }) => (
        <div className="modal-text">
          <p>
            Desea reservar cita para el{" "}
            {bookInfo.date &&
              bookInfo.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
            a las {bookInfo.hour && bookInfo.hour}?
          </p>
        </div>
)

const cancelModal = ( { bookInfo } ) => (
        <div className="modal-text">
          <p>
            Desea cancelar su cita prevista para el{" "}
            {bookInfo.date &&
              bookInfo.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
            a las {bookInfo.hour && bookInfo.hour}?
          </p>
        </div>
)

const unavailableModal = ( { bookInfo } ) => (
        <div className="modal-text">
          <p>
            La cita para el{" "}
            {bookInfo.date &&
              bookInfo.date.toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}{" "}
            a las {bookInfo.hour && bookInfo.hour} no está disponible.
          </p>
        </div>
)

const consentModal = ({ username }) => (
        <div className="modal-text">
          <p>
          <em> ¡ Hola {username} ! </em>
          </p>
          <br/>
          <p>
            {"Como paciente de la \"Clínica Rull\" queremos mejorar tu experiencia con nosotros ofreciéndote servicios de cita online, recordatorios e información que sea de tu interés."}
          </p>
          <br/>
          <p>
            {"Puedes modificar/borrar tus datos en la sección <Mi Perfil>. Por favor, marca la opcion deseada a continuación:"}
          </p>
        </div>
)

const confirmRemoveModal = () => (
        <div className="modal-text">
          <p>
            {"Si confirma esta acción se borrarán sus datos y no se le enviarán más mensajes."}
          </p>
        </div>
)

export { confirmModal, cancelModal, unavailableModal, consentModal, confirmRemoveModal }
