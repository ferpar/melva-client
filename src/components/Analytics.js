import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Analytics/Analytics.css";

import csv from "csvtojson";

import Spinner from "./spinners/Ripple.js";
import { slide as Menu } from "react-burger-menu";

const Analytics = props => {
  const { franchise } = props.user
  const [isLoading, setIsLoading] = useState(true);
  const [jsonSource, setJsonSource] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen)
  }
  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleCSVImport = async e => {
    const csvContent= await e.target.files[0].text()
    const jsonObj = await csv({
      delimiter:[";", ",", " ", "|"],
      //headers:["surname", "name", "phone"]
    })
      .fromString(csvContent)
    console.log(jsonObj)
    setJsonSource(jsonObj)
  }

  useEffect( () => {
    setIsLoading(false)
  }, [])

  return (
    <>
      <Menu 
        isOpen={menuOpen}
        onStateChange={(state) => handleStateChange(state)}
      >
          <Link onClick={() => closeMenu()} to="/appointments-book">Citas Pendientes</Link>
          <Link onClick={() => closeMenu()} to="/appointments-manager">Gestor de Citas</Link>
          <Link onClick={() => closeMenu()} to="/campaigns">Gestor de Campañas</Link>
          <button onClick={ async () => {
            await props.handleLogout() //this is important to avoid race between handleLogout and closeMenu
            closeMenu()}
          }>Desconectar</button>
      </Menu>

      { isLoading ? 
        (
          <div className="analytics-container">
            <Spinner />
          </div>
        ) : ( 
            <div className="analytics-container">
                <div className="analytics-wrapper">
                  <p>testing</p>
                  <div className="import-container">
                    <label className="csv-import-button" htmlFor="csv-import">Importar desde .csv</label>
                    <input accept=".csv" id="csv-import" name="csv-import" type="file" onChange={e => handleCSVImport(e)}/>
                  </div>
                </div>
                <div className="analytics-wrapper">
                  {jsonSource ? 
                      (
                        jsonSource.slice(0, 10).map( (unit, idx) => 
                          <div key={idx} className="analytics-list-slug">
                            <p>{unit.NºHC}</p>
                            <p>{unit.Nombre}</p>
                            <p>{unit.Apellidos}</p>
                          </div>)
                      ) 
                    : (<p>test2</p>) }
                </div>
            </div>
        )
      }
    </>
    
  )
};

export default Analytics;
