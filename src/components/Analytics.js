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
      year: billable.Fecha.split("/")[2],
      date: new Date(
        billable.Fecha.split("/")[2], 
        billable.Fecha.split("/")[0] - 1,
        billable.Fecha.split("/")[1] )
    }))  
  )

  const groupBy = (formattedData, criterion = "year") => {

    const groupedBills = {}

    formattedData.forEach( bill => {
      if (groupedBills.hasOwnProperty(bill[criterion])) {
        groupedBills[bill[criterion]].push(bill)
      } else {
        groupedBills[bill[criterion]] = [bill]
      }
    })

    return groupedBills
  }

  const groupByMonth = (formattedData, criterion = "year") => {
    
    const groupedBills = groupBy(formattedData, criterion)
    const nestedGroupBills = {}

    for (year in groupedBills) {
      nestedGroupBills[year] = groupBy(groupedBills[year], "month")
    }

    return nestedGroupBills

  }


  const groupByDay = (formattedData, criterion = "year") => {
    
    const groupedBills = groupBy(formattedData, criterion)
    const nestedGroupBills = {}

    for (year in groupedBills) {
      nestedGroupBills[year] = groupBy(groupedBills[year], "month")
      for (month in nestedGroupBills[year]) {
        nestedGroupBills[year][month] = groupBy(nestedGroupBills[year][month], "day")
      }
    }

    return nestedGroupBills

  }

  const groupByYearPatient = (formattedData, criterion = "year") => {
    
    const groupedBills = groupBy(formattedData, criterion)
    const nestedGroupBills = {}

    for (year in groupedBills) {
      nestedGroupBills[year] = groupBy(groupedBills[year], "fullname")
    }

    return nestedGroupBills
  }

  const generatePatientBase = (formattedData) => {
    const patientList = {}
    formattedData.forEach ( bill => {
      if (patientList.hasOwnProperty(bill.patientId)) {
        patientList[bill.patientId].bills.push(bill)
        patientList[bill.patientId].years.add(bill.year)
        patientList[bill.patientId].yearSum = patientList[bill.patientId].years.size
        const years = [] 
        patientList[bill.patientId].years.forEach(year => years.push(year))
        patientList[bill.patientId].yearSpan = (Math.max(...years) - Math.min(...years))
        patientList[bill.patientId].billSum = patientList[bill.patientId].bills.length
      } else {
        patientList[bill.patientId]= {
          bills: [bill], 
          fullname: bill.fullname,
          years: new Set([bill.year]),
          yearSum: 1,
          yearSpan: 1,
          billSum: 1
        }
      }
    })
    return patientList
  }

  // example of rankParameters: { "Ayears": 8, "Byears": 5, "Abills": 20, "Bbills": 10 }}

  const rankPatientBase = (patientBase, rankParameters, yearSumToggle = false) => {
    const rankedPatientBase = {...patientBase}
      
      for ( let patient in patientBase) {

        //longevity ranking
        if (yearSumToggle) {
          if (patientBase[patient].yearSum > rankParameters.Ayears) {
            rankedPatientBase[patient].longevityRank = "A"
          } else if (patientBase[patient].yearSum > rankParameters.Byears) {
            rankedPatientBase[patient].longevityRank = "B"
          } else {
            rankedPatientBase[patient].longevityRank = "C";
          }
        } else {
          if (patientBase[patient].yearSpan > rankParameters.Ayears) {
            rankedPatientBase[patient].longevityRank = "A"
          } else if (patientBase[patient].yearSpan > rankParameters.Byears) {
            rankedPatientBase[patient].longevityRank = "B"
          } else {
            rankedPatientBase[patient].longevityRank = "C";
          }
        }

        //asiduity ranking
        if (patientBase[patient].billSum > rankParameters.Abills) {
          rankedPatientBase[patient].asiduityRank = "A"
        } else if (patientBase[patient].billSum > rankParameters.Bbills) {
          rankedPatientBase[patient].asiduityRank = "B"
        } else {
          rankedPatientBase[patient].asiduityRank = "C";
        }
      }

    return rankedPatientBase
  }
  
  const rankPatientBaseYearly = (patientBase, rankParameters, year, yearSumToggle = false) => {
    const rankedPatientBase = {...patientBase}
      
      for ( let patient in patientBase) {

        //longevity ranking
        if (yearSumToggle) {
          if (patientBase[patient].yearSum > rankParameters.Ayears) {
            rankedPatientBase[patient].longevityRank = "A"
          } else if (patientBase[patient].yearSum > rankParameters.Byears) {
            rankedPatientBase[patient].longevityRank = "B"
          } else {
            rankedPatientBase[patient].longevityRank = "C";
          }
        } else {
          if (patientBase[patient].yearSpan > rankParameters.Ayears) {
            rankedPatientBase[patient].longevityRank = "A"
          } else if (patientBase[patient].yearSpan > rankParameters.Byears) {
            rankedPatientBase[patient].longevityRank = "B"
          } else {
            rankedPatientBase[patient].longevityRank = "C";
          }
        }

        //asiduity ranking
        if (patientBase[patient].billSum > rankParameters.Abills) {
          rankedPatientBase[patient].asiduityRank = "A"
        } else if (patientBase[patient].billSum > rankParameters.Bbills) {
          rankedPatientBase[patient].asiduityRank = "B"
        } else {
          rankedPatientBase[patient].asiduityRank = "C";
        }

        //customer status
        if (patientBase[patient].years.has(year)){
          if (patientBase[patient].years.has( (parseInt(year) -1).toString())){
            rankedPatientBase[patient].status = "retained" 
          } else {
            if (patientBase[patient].years.size === 1) {
              rankedPatientBase[patient].status = "gained" 
            } else {
              rankedPatientBase[patient].satus = "regained"
            }
          }
        } else {
          if (patientBase[patient].years.has( (parseInt(year) -1).toString())){
            rankedPatientBase[patient].status = "lost"
          } else {
            if (patientBase[patient].years.size === 1){
              rankedPatientBase[patient].status = "forgotten1Year"
            } else {
              rankedPatientBase[patient].status = "forgottenMultiYear"
            }
          }
        }
      }

    return rankedPatientBase
  }

  const generateYearlyReport = async (formattedData, rankParameters, yearSumToggle) => {
    let yearlyReport = {}
    const billsByYear = groupBy(formattedData, "year")
    for (let year in billsByYear) {
      //yearlyReport[year] = rankPatientBase(generatePatientBase(formattedData.filter( bill => bill.date.getTime() < new Date(parseInt(year)+1, 0) )), rankParameters)
      yearlyReport[year] = rankPatientBaseYearly(generatePatientBase(formattedData.filter( bill => bill.date.getTime() < new Date(parseInt(year)+1, 0) )), rankParameters, year)
    }
    return yearlyReport
  }

  useEffect( () => {
    const loadReport = async () => {
      if (formattedSourceData) {
       const yearlyReport = await generateYearlyReport( formattedSourceData, {"Ayears": 8, "Byears": 4, "Abills": 20, "Bbills": 10})
       console.log(yearlyReport)
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
