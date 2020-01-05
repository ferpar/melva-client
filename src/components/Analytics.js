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

const freqData=[
{category:'AL',freq:{low:8786, mid:1319, high:249}}
,{category:'AZ',freq:{low:1101, mid:412, high:674}}
,{category:'CT',freq:{low:932, mid:2149, high:418}}
,{category:'DE',freq:{low:832, mid:1152, high:1862}}
,{category:'FL',freq:{low:4481, mid:3304, high:948}}
,{category:'GA',freq:{low:1619, mid:167, high:1063}}
,{category:'IA',freq:{low:1819, mid:247, high:1203}}
,{category:'IL',freq:{low:4498, mid:3852, high:942}}
,{category:'IN',freq:{low:797, mid:1849, high:1534}}
,{category:'KS',freq:{low:162, mid:379, high:471}}
,{category:'ES',freq:{low:1660, mid:579, high:471}}
];

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
                  <HistoPie data={freqData}/>
                  {jsonSource ? 
                      (
                        jsonSource.slice(0, 10).map( (unit, idx) => 
                          <div key={idx} className="analytics-list-slug">
                            <p>{unit.NHC}</p>
                            <p>{unit.Nombre}</p>
                            <p>{unit.Apellidos}</p>
                          </div>)
                      ) 
                    : (<p>Porfavor, importe los datos a analizar.</p>) }
                </div>
            </div>
        )
      }
    </>
    
  )
};

export default Analytics;
