import React from "react";

const RecipientList = (
  {
    handleCustomerChange,
    customer,
    setCustomer,
    handleAddCustomer,
    recipients,
    handleCSVImport,
    handleRefresh,
    removeSwitch,
    setRemoveSwitch,
    handleSelectCustomer,
    multiSelect,
    setMultiSelect,
    handleMultiSelect,
    filter,
    setFilter,
    handleRemoveCustomer,
    PhoneInput,
    Switch
  }
) => (
          <div className="recipients-list">
            <div className="list-container">
              <form className="add-recipients-form">
              
                <div className="input-array">
                  <div className="input-line">
                    <label htmlFor="name">nombre</label>
                    <input className="add-name" name="name" onChange={e => handleCustomerChange(e)} id="name" placeholder=" max. 20 caracteres" type="text" value={customer.name}/>
                  </div>
                  <div className="input-line">
                    <label htmlFor="surname">apellidos</label>
                    <input className="add-surname" name="surname" onChange={e => handleCustomerChange(e)} id="surname" type="text" value={customer.surname}/>
                  </div>
                  <div className="input-line">
                    
                    <PhoneInput
                      className="add-phone"
                      name="phone"
                      id="phone"
                      country="ES"
                      onChange={value => { 
                        setCustomer(prevCustomer => ({...prevCustomer, userId: { ...prevCustomer.userId, phone : value}}))
                        }
                      }
                      placeholder="tel. 6xx xx xx xx"
                      value={customer.phone}
                    />
                  </div>
                  <button className="cp-button" onClick={e => handleAddCustomer(e)} >Añadir</button>
                  <p>
                    List size: {recipients.length}, 
                    Sent: { recipients.filter( recipient => (recipient.smsStatus === "enqueued" || recipient.smsStatus === "delivered")).length},
                    Enqueued: {recipients.filter( recipient => recipient.smsStatus === "enqueued" ).length},
                    Delivered: {recipients.filter( recipient => recipient.smsStatus === "delivered").length}, 
                    Failed: {recipients.filter( recipient => recipient.smsStatus === "failed").length}, 
                    Clicked on: {recipients.filter( recipient => recipient.linkClicked).length},
                    Booked: {recipients.filter( recipient => recipient.appointmentBooked).length}
                  </p>
                </div>
                <div className="import-container">
                  <label className="csv-import-button" htmlFor="csv-import">Importar desde .csv</label>
                  <input accept=".csv" id="csv-import" name="csv-import" type="file" onChange={e => handleCSVImport(e)}/>
                </div>
              </form>
              <div className="customers-container"> 
                <div className="customers-controls">
                    <button onClick={() => handleRefresh()} >Recargar</button>
                    <div className="remove-switch">
                      <Switch 
                        className = "switch-control"
                        checked = {removeSwitch}
                        onChange={checked => setRemoveSwitch(!removeSwitch)}
                        onColor = "#dc3545"
                      />
                      { removeSwitch ? <p> Borrado activado </p> : <p> Borrado inactivo </p>}
                    </div>
                    <div className="multiselect-switch">
                      <Switch 
                        className = "multiselect-switch-control"
                        checked = {multiSelect}
                        onChange={checked => setMultiSelect(!multiSelect)}
                        onColor = "#dc3545"
                      />
                      { multiSelect ? <p> Selección simple </p> : <p> Selección múltiple </p>}
                    </div>
                </div>
                <div><p>filter by:</p>
                  <button onClick={() => setFilter("all")}>all</button>
                  <button onClick={() => setFilter("not-sent")}>not-sent</button>
                  <button onClick={() => setFilter("enqueued")}>enqueued</button>
                  <button onClick={() => setFilter("delivered")}>delivered</button>
                  <button onClick={() => setFilter("failed")}>failed</button>
                  <button onClick={() => setFilter("clicked")}>clicked on</button>
                  <button onClick={() => setFilter("booked")}>Appointment Booked</button>
                </div>
                <ul className="customers-list">
                  {recipients
                    .filter(recipient => {
                      switch (filter) {
                        case "all":
                          return recipient;
                        case "not-sent":
                          return recipient.smsStatus==="not-sent";
                        case "enqueued":
                          return recipient.smsStatus==="enqueued";
                        case "delivered":
                          return recipient.smsStatus==="delivered";
                        case "failed":
                          return recipient.smsStatus==="failed";
                        case "clicked":
                          return recipient.linkClicked;
                        case "booked":
                          return recipient.appointmentBooked;
                        default:
                          return recipient;
                      }
                    })
                    .map( (recipient,i) => (
                    <li 
                      key={i} 
                      className = {
                        recipient.selected ? (
                          (new Date() - new Date(recipient.updated_at) <= 3600*1000*12) 
                            ? "customer-list-item selected new-customer" : "customer-list-item selected") : (
                           (new Date() - new Date(recipient.updated_at) <= 3600*1000*12) ?  "customer-list-item new-customer" : "customer-list-item")}>
                      <div 
                        onClick={multiSelect ? () => handleMultiSelect(recipient._id) : () => handleSelectCustomer(recipient._id)} 
                        className="customer-fields">
                        <p>{recipient.userId.name}</p>
                        <p>{recipient.userId.surname}</p>
                        <p>
                            {recipient.userId.phone}  {" "} 
                            {recipient.smsStatus === "not-sent" ?
                                <span style={{color: "grey"}}>N</span> : 
                                (recipient.smsStatus === "enqueued" ? 
                                  <span style={{color: "blue"}}>E</span> :
                                  (recipient.smsStatus === "delivered" ?
                                    <span style={{color: "green"}}>D</span> :
                                    (recipient.smsStatus === "failed" ?
                                    <span style={{color: "red"}}>F</span> :
                                   <span style={{color: "red"}}>-</span>)))}
                            {" "}
                            {recipient.linkClicked && <span style={{color: "orange"}}>C</span>}
                            {" "}
                            {recipient.appointmentBooked && <span style={{color: "red"}}>B!</span>}
                            {" "}
                            {(new Date() - new Date(recipient.updated_at) <= 3600*1000*12)
                              && <span className="ball"></span>}
                            {(recipient.userId.phone[3] != "6" || recipient.userId.phone.length != 12) && (<span className="ball" style={{"backgroundColor": "red"}}></span>)}
                                
                        </p>
                      </div>
                      <button 
                        className="remove-customer" 
                        disabled={!removeSwitch}
                        onClick={e => handleRemoveCustomer(e, i)}
                      >
                          -
                      </button>
                    </li>
                  ))
                  }
                </ul>
              </div>
            </div>
          </div>

)

export default RecipientList
