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

import ReportTable from "./Analytics/Table.js";
import IntervalSelector from "./Analytics/IntervalSelector.js";

import HistoPie from "./Analytics/D3/HistoPie.js";
import {schemePaired, schemeDark2} from "d3";

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
  const [selectedYear, setSelectedYear] = useState(null);
  const [timeInterval, setTimeInterval] = useState("quarterly");
  const handleSetTimeInterval = e => {
    setTimeInterval(e.target.value)
  }

  //detail levels
  const [expanded, setExpanded] = useState(0)

  const handleSetExpanded = () => {
    console.log(expanded)
    if (expanded === 0){
      setExpanded(expanded + 1)
    } else {
      setExpanded(expanded - 1)
    }
  }

  const handleSetExpanded2 = () => {
    console.log(expanded)
      setExpanded(expanded + 1)
  }

  //data cache
  const [formattedSourceData, setFormattedSourceData] = useState(null); //raw imported data
  const [jsonSource, setJsonSource] = useState(null); //preprocessed data

  //reports cache
  const [rawYearly, setRawYearly] = useState(null)
  const [yearlyReport, setYearlyReport] = useState(null)
  const [rawQuarterly, setRawQuarterly] = useState(null)
  const [quarterlyReport, setQuarterlyReport] = useState(null)
  const [rawMonthly, setRawMonthly] = useState(null)
  const [monthlyReport, setMonthlyReport] = useState(null)

  //histopie data
  const [histoPieData, setHistoPieData] = useState(freqData)

  //sidemenu
  const [menuOpen, setMenuOpen] = useState(false);
  const handleStateChange = state => {
    setMenuOpen(state.isOpen)
  }
  const closeMenu = () => {
    setMenuOpen(false)
  }
  // -------

  //import function
  const handleCSVImport = async e => {
    const csvContent= await e.target.files[0].text()
    const jsonObj = await csv({
      delimiter:[";", ",", " ", "|"],
      //headers:["surname", "name", "phone"]
    })
      .fromString(csvContent)

    setJsonSource(jsonObj) //raw imported data

    const afterFormatting = await formatImport(jsonObj) //preprocessed data
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


  // on Import
  useEffect( () => {
    const loadReport = async () => {
      if (formattedSourceData) {
        setRawYearly(await generateYearlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10}))

        setRawQuarterly(await generateQuarterlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10}))

        setRawMonthly(await generateMonthlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10}))
      } 
    }
    loadReport()
  }, [formattedSourceData])

  // yearly report array
  useEffect(() => {
    if (rawYearly) {
      const processedYearly =  [
          ...Object.values(rawYearly).map( (elem, i) => ({
            year: Object.keys(rawYearly)[i],
            retained: Object.values(elem).filter(elem => elem.status==="retained").length,
            regained: Object.values(elem).filter(elem => elem.status==="regained").length,
            new: Object.values(elem).filter(elem => elem.status==="new").length,
            lost: Object.values(elem).filter(elem => elem.status==="lost").length,
            forgotten1Year: Object.values(elem).filter(elem => elem.status==="forgotten1Year").length,
            forgottenMultiYear: Object.values(elem).filter(elem => elem.status==="forgottenMultiYear").length,
            total: 
              Object.values(elem).filter(elem => elem.status==="retained").length +
              Object.values(elem).filter(elem => elem.status==="regained").length +
              Object.values(elem).filter(elem => elem.status==="new").length,
            accumulated: Object.values(elem).length

          })) 
        ]
        setYearlyReport(processedYearly)
        console.log(rawYearly)
    }
  }, [rawYearly])

  //quarterly report array
  useEffect(() => {
    if(rawQuarterly) {
      const processedQuarterly = []
      for (let year in rawQuarterly){
        for (let quarter in rawQuarterly[year]){
          processedQuarterly.push(
            {
              year,
              quarter,
              new: Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "new").length,
              regained: Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "regained").length,
              retained: Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "retained").length,
              lost: Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "lost").length,
              forgotten1Year: Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "forgotten1Year").length,
              forgottenMultiYear: Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "forgottenMultiYear").length,
              total: 
                Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "new").length +
                Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "regained").length +
                Object.values(rawQuarterly[year][quarter]).filter(elem => elem.status === "retained").length,
              accumulated: Object.values(rawQuarterly[year][quarter]).length
            }
          )
        }
      }
      setQuarterlyReport(processedQuarterly)
      console.log("processedQuarterly")
      console.log(processedQuarterly)
    }
  }, [rawQuarterly])

  //monthly  report array
  useEffect(() => {
    if(rawMonthly) {
      const processedMonthly= []
      for (let year in rawMonthly){
        for (let month in rawMonthly[year]){
          processedMonthly.push(
            {
              year,
              month,
              new: Object.values(rawMonthly[year][month]).filter(elem => elem.status === "new").length,
              regained: Object.values(rawMonthly[year][month]).filter(elem => elem.status === "regained").length,
              retained: Object.values(rawMonthly[year][month]).filter(elem => elem.status === "retained").length,
              lost: Object.values(rawMonthly[year][month]).filter(elem => elem.status === "lost").length,
              forgotten1Year: Object.values(rawMonthly[year][month]).filter(elem => elem.status === "forgotten1Year").length,
              forgottenMultiYear: Object.values(rawMonthly[year][month]).filter(elem => elem.status === "forgottenMultiYear").length,
              total: 
                Object.values(rawMonthly[year][month]).filter(elem => elem.status === "new").length +
                Object.values(rawMonthly[year][month]).filter(elem => elem.status === "regained").length +
                Object.values(rawMonthly[year][month]).filter(elem => elem.status === "retained").length,
              accumulated: Object.values(rawMonthly[year][month]).length
            }
          )
        }
      }
      setMonthlyReport(processedMonthly)
      console.log("processedMonthly")
      console.log(processedMonthly)
    }
  }, [rawMonthly])

  useEffect(() => {

    if (yearlyReport && quarterlyReport && monthlyReport) {
    let report = null;
    switch (timeInterval){
      case "yearly":
        report = yearlyReport;
        break;
      case "quarterly":
        report = quarterlyReport.filter( elem => elem.year === "2016" || elem.year === "2017" || elem.year ==="2018" || elem.year === "2019");
        break;
      case "monthly":
        report = monthlyReport.filter(elem => elem.year === "2018" || elem.year === "2019");
        break;
    }

      setHistoPieData(
          report.map( 
            obj => { 

              let freq = {}, colors = {}
              switch (expanded){
                case 0:
                case 1:
                  freq = {
                    ganados: obj.new + obj.regained,
                    perdidos: obj.lost
                  }
                  colors = {
                    barColor: "steelBlue",
                    ganados: "#41ab5d",
                    perdidos: schemePaired[5]
                  }
                  break;
                case 2:
                  freq = {
                    nuevos: obj.new,
                    repescados: obj.regained,
                    perdidos: obj.lost
                  }
                  colors = {
                    barColor: "steelBlue",
                    nuevos: schemeDark2[0], 
                    repescados:"#e08214",
                    perdidos: schemePaired[5]
                  }
                  break;
                case 3:
                case 4:
                  freq = {
                    nuevos: obj.new,
                    repescados: obj.regained,
                    mantenidos: obj.retained,
                    perdidos: obj.lost
                  }
                  colors = {
                    barColor: 'steelBlue',
                    nuevos: schemeDark2[0], 
                    repescados:"#e08214",
                    mantenidos:"#807dba",
                    perdidos: schemePaired[5]
                  }
              }
              
              switch(timeInterval){
                case "yearly":
                  return {
                    category: obj.year,
                    total: obj.total,
                    freq,
                    colors
                  }
                  break;
                case "quarterly":
                  return {
                    category: obj.year + " " + obj.quarter,
                    total: obj.total,
                    freq,
                    colors
                  }
                  break;
                case "monthly":
                  return {
                    category: obj.year + " " + obj.month,
                    total: obj.total,
                    freq,
                    colors
                  }
                  break;
              }
            }
        )
      )
    }
  },[yearlyReport, quarterlyReport, monthlyReport, timeInterval, expanded])

  useEffect(() => {
    if (histoPieData) {
      console.log(histoPieData)
    }
  }, [histoPieData])

  useEffect(() => {
    if (rawQuarterly) {
      console.log(rawQuarterly)
    }
  }, [rawQuarterly])

  useEffect(() => {
    if(rawMonthly){
      console.log(rawMonthly)
    }
  }, [rawMonthly])


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
                <div className="analytics-controls-wrapper">
                  <div className="analytics-import-container">
                    <label 
                      className="csv-import-button" 
                      htmlFor="csv-import"
                    >
                      Importar desde .csv
                    </label>
                    <input 
                      accept=".csv" 
                      id="csv-import" 
                      name="csv-import" 
                      type="file" 
                      onChange={e => handleCSVImport(e)}
                    />
                  </div>
                   { (yearlyReport && quarterlyReport && monthlyReport) &&
                     <IntervalSelector
                      timeInterval={timeInterval}
                      handleSetTimeInterval={handleSetTimeInterval}
                     /> 
                   }
                </div>
                <div className="analytics-wrapper">
                  <HistoPie data={histoPieData}/>
                  {yearlyReport && quarterlyReport && monthlyReport ? 
                      (
                        <ReportTable 
                          report={
                            timeInterval === "quarterly" 
                            ? quarterlyReport.filter(elem => elem.year==="2016" || elem.year==="2017" || elem.year==="2018" || elem.year==="2019") : (
                                timeInterval === "monthly" 
                                ? monthlyReport.filter(elem => elem.year==="2018" || elem.year==="2019") 
                                : yearlyReport
                            )
                          } 
                          interval={timeInterval}
                          expanded={expanded}
                          handleSetExpanded={handleSetExpanded}
                          handleSetExpanded2={handleSetExpanded2}
                        />
                      ) 
                    : (<p>Porfavor, importe los datos a analizar.</p>) 
                  }
                </div>
            </div>
        )
      }
    </>
    
  )
};

export default Analytics;
