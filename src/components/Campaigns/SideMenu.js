import React from "react";

const CampaignManager = ({
  locations,
  location,
  handleSetLocation,
  title,
  handleSetTitle,
  shortDescription,
  handleSetShortDescription,
  isActive,
  handleIsActive,
  isSaving,
  handleSaveCampaign,
  handleLoadCampaign,
  filteredCampaigns,
  handleDelete
}) => (
    <div className="campaign-management">
        <label htmlFor="location-select">clínica</label>
        <select onChange={e => handleSetLocation(e)} id="location-select" name="location-select">
          <option value="">seleccionar clínica</option>
          {locations.map( (location, ind) => (
            <option key={ind} value={location._id}>{location.name}</option>
          ))}
        </select>
        <hr className="camp-management-separator"/>
        { location ? (
          <>
            <label htmlFor="campaign-select">campaña</label>
            <select onChange={e => handleLoadCampaign(e)} id="campaign-select" name="campaign-select">
              <option value="">seleccionar campaña</option>
              {filteredCampaigns.map( (campaign, ind) => (
                <option key={ind} value={campaign._id}>{campaign.title}</option> 
              ))}
            </select>
            <hr/>
            <div className="campaign-name">
              <label htmlFor="title">nombre de campaña</label>
              <input name="title" id="title" type="text" value={title} onChange={(e) => handleSetTitle(e)}/>
            </div>
            <div className="campaign-description">
                <label htmlFor="short-description">nombre público</label>
                <input name="short-description" id="short-description" type="text" value={shortDescription} onChange={(e) => handleSetShortDescription(e)}/>
            </div>
            <div className="campaign-status">
                <input type="checkbox" id="isactive" name="isactive" checked={!isActive} onChange={e => handleIsActive(e)}/>
                <label htmlFor="isactive">Campaña terminada</label>
            </div>
            <button disabled={isSaving} className="save cp-button" onClick={e => handleSaveCampaign(e)}>{isSaving ? "Guardando..." : "Guardar Cambios"}</button>
            <hr/>
            <button className="delete cs-button" onClick={e => handleDelete(e)} >Borrar Campaña</button>
          </>
        ) : (
          <>
            <p> Elige una clínica para continuar </p> 
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
          </>
        )
        }
    </div>
)

export default CampaignManager
