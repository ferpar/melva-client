import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Analytics/Analytics.css";

import csv from "csvtojson";

import Spinner from "./spinners/Ripple.js";
import { slide as Menu } from "react-burger-menu";

import { 
  formatImport,
  groupBy, 
  groupByMonth, 
  groupByDay, 
  groupByYearPatient,
  groupObjectBy,
  generatePatientBase,
  rankPatientBase,
  rankPatientBaseYearly,
  generateYearlyReport,
  rankPatientBaseQuarterly,
  generateQuarterlyReport,
  rankPatientBaseMonthly,
  generateMonthlyReport
} from "../helpers/analytics.js";

//import ForceLayout from "./Analytics/D3/ForceLayout.js";
//import BasicChart from "./Analytics/D3/BasicChart.js";
//import CurvedLineChart from "./Analytics/D3/CurvedLineChart.js";
//import AxisScales from "./Analytics/D3/AxisScales.js";
//import AnimatedChart from "./Analytics/D3/AnimatedChart.js";
//import InteractiveChart from "./Analytics/D3/InteractiveChart.js";
//import ResponsiveChart from "./Analytics/D3/ResponsiveChart.js";
import HistoPie from "./Analytics/D3/HistoPie.js";

const Analytics = props => {
  const { franchise } = props.user
  const [isLoading, setIsLoading] = useState(true);
  const [jsonSource, setJsonSource] = useState(null);
  const [formattedSourceData, setFormattedSourceData] = useState(null);

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

    const afterFormatting = await formatImport(jsonObj)
    console.log(afterFormatting)
    setFormattedSourceData(afterFormatting)
    
  }

  //preprocess the imported data into a usable object
  //!!! for now this function is being manually adapted to the given data format
  
  const formatImport = (jsonObj) => (
    jsonObj.map( billable => ({
      treatment: billable.Tratamiento,
      patientId: billable.NHC,
      name: billable.Nombre ,
      surname: billable.Apellidos,
      fullname: billable.ApellidosNombre,
      phone: billable.Telf,
      address: billable.Direccion,
      day: billable.Fecha.split("/")[1],
      month: billable.Fecha.split("/")[0],
      quarter: 
        billable.Fecha.split("/")[0] > 9 ? 
          4 
          : (billable.Fecha.split("/")[0] > 6 ?
            3
            : (billable.Fecha.split("/")[0] > 3 ?
              2 : 1)
          ),
      year: billable.Fecha.split("/")[2],
      date: new Date(
        billable.Fecha.split("/")[2], 
        billable.Fecha.split("/")[0] - 1,
        billable.Fecha.split("/")[1] )
    }))  
  )


  useEffect( () => {
    const loadReport = async () => {
      if (formattedSourceData) {
        const yearlyReport = await generateYearlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10})
        console.log(yearlyReport)
        //const subGroupingTest = await groupObjectBy(groupBy(formattedSourceData, "year"), "quarter")
        //console.log(subGroupingTest)

        const quarterlyReport = await generateQuarterlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10})
        console.log(quarterlyReport)

        const monthlyReport = await generateMonthlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10})
        console.log(monthlyReport)
      } 
    }
    loadReport()
  }, [formattedSourceData])

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
          {/*<ForceLayout width={600} height={400}/>*/}
          {/*<BasicChart />*/}
          {/*      <CurvedLineChart />*/}
          {/*      <AxisScales /> */}
          {/*     <AnimatedChart /> */}
          {/*       <InteractiveChart />*/}
          {/*        <ResponsiveChart />*/}
                  <HistoPie />
                  {jsonSource ? 
                      (
                        jsonSource.slice(0, 10).map( (unit, idx) => 
                          <div key={idx} className="analytics-list-slug">
                            <p>{unit.NHC}</p>
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
