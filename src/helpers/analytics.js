

//groups an array turning it into an object with the selected criterion as key/property

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

  //fist iteration of nested grouping year=>month
  const groupByMonth = (formattedData, criterion = "year") => {
    
    const groupedBills = groupBy(formattedData, criterion)
    const nestedGroupBills = {}

    for (year in groupedBills) {
      nestedGroupBills[year] = groupBy(groupedBills[year], "month")
    }

    return nestedGroupBills

  }

  //first iteration of double nested grouping year => month => day
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

  //second iteration of nested grouping: year => patient
  const groupByYearPatient = (formattedData, criterion = "year") => {
    
    const groupedBills = groupBy(formattedData, criterion)
    const nestedGroupBills = {}

    for (year in groupedBills) {
      nestedGroupBills[year] = groupBy(groupedBills[year], "fullname")
    }

    return nestedGroupBills
  }

  //function for nested grouping after groupBy was first used ==> Generalization for second level subGroups
  const groupObjectBy = ( inputObject, criterion="patient" ) => {
    const nestedGroupedObject = {}

    for (let prop in inputObject) {
      nestedGroupedObject[prop] = groupBy(inputObject[prop], criterion)  
    }

    return nestedGroupedObject
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

        if (patientList[bill.patientId].quarters[bill.year]) {
          patientList[bill.patientId].quarters[bill.year].add(bill.quarter)
        } else {
          patientList[bill.patientId].quarters[bill.year] = new Set([bill.quarter])
        }

        if (patientList[bill.patientId].months[bill.year]) {
          patientList[bill.patientId].months[bill.year].add(parseInt(bill.month))
        } else {
          patientList[bill.patientId].months[bill.year] = new Set([parseInt(bill.month)])
        }

      } else {
        patientList[bill.patientId]= {
          patientId: bill.patientId,
          bills: [bill], 
          fullname: bill.fullname,
          years: new Set([bill.year]),
          yearSum: 1,
          yearSpan: 1,
          billSum: 1,
          quarters: {[bill.year]: new Set([bill.quarter])},
          months: {[bill.year]: new Set([parseInt(bill.month)])}
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
          } else if (patientBase[patient].yearSum >= rankParameters.Byears) {
            rankedPatientBase[patient].longevityRank = "B"
          } else {
            rankedPatientBase[patient].longevityRank = "C";
          }
        } else {
          if (patientBase[patient].yearSpan > rankParameters.Ayears) {
            rankedPatientBase[patient].longevityRank = "A"
          } else if (patientBase[patient].yearSpan >= rankParameters.Byears) {
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
              rankedPatientBase[patient].status = "regained"
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
      yearlyReport[year] = rankPatientBaseYearly(generatePatientBase(formattedData.filter( bill => bill.date.getTime() < new Date(parseInt(year)+1, 0) )), rankParameters, year)
    }
    return yearlyReport
  }

  const rankPatientBaseQuarterly = (patientBase, rankParameters, year, quarter, yearSumToggle = false) => {
    const rankedPatientBase = {...patientBase}
      
        //auxiliary function to check if there were bills on any of the previous 4 quarters
        function checkLastYearBills(patientObject, year, quarter) {
          for (let i = quarter-1; i >= 1; i--){
            if ( patientObject.quarters[year] && patientObject.quarters[year].has(parseInt(i)) ) return true
          }
          for (let i= quarter; i<=4; i++){
            if ( patientObject.years.has((parseInt(year) -1).toString())  && patientObject.quarters[year-1].has(parseInt(i)) ) return true
          }
          return false
        }

        function checkIfLost(patientObject, year, quarter) {
          if (quarter == 1) {
            if ( patientObject.quarters[year-2] && patientObject.quarters[year-2].has(4)) return true
          } else {
            if (patientObject.quarters[year-1] && patientObject.quarters[year-1].has(quarter-1)) return true
          }
          return false
        }
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
        if ((patientBase[patient].years.has(year.toString()) && patientBase[patient].quarters[year].has(parseInt(quarter))) || checkLastYearBills(patientBase[patient], year, quarter)) {
          if(checkLastYearBills(patientBase[patient], year, quarter)){
            rankedPatientBase[patient].status="retained" 
          } else {
            if (patientBase[patient].years.size === 1) {
              rankedPatientBase[patient].status="gained"
            } else {
              rankedPatientBase[patient].status="regained"
            }
          }
          
        } else {
          if (checkIfLost(patientBase[patient], year, quarter)){
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

  const generateQuarterlyReport = async (formattedData, rankParameters, yearSumToggle) => {
    let quarterlyReport = {}
    const billsByYearQuarter = groupObjectBy(groupBy(formattedData, "year"), "quarter")
    for (let year in billsByYearQuarter) {
      if (!quarterlyReport[year]) quarterlyReport[year]={}
      for (let quarter in billsByYearQuarter[year]) {
        quarterlyReport[year][quarter] = rankPatientBaseQuarterly(generatePatientBase(formattedData.filter( bill => bill.date.getTime() < new Date(parseInt(year), parseInt(quarter)*3)  )), rankParameters, year, quarter)
      }
    }
    return quarterlyReport
  }

  const rankPatientBaseMonthly = (patientBase, rankParameters, year, month, yearSumToggle = false) => {
    const rankedPatientBase = {...patientBase}
      
        //auxiliary function to check if there were bills on any of the previous 4 quarters
        function checkLastYearBills(patientObject, year, month) {
          for (let i = month-1; i >= 1; i--){
            if ( patientObject.months[year] && patientObject.months[year].has(parseInt(i)) ) return true
          }
          for (let i= month; i<=12; i++){
            if ( patientObject.years.has((parseInt(year) -1).toString())  && patientObject.months[year-1].has(parseInt(i)) ) return true
          }
          return false
        }

        function checkIfLost(patientObject, year, month) {
          if (month == 1) {
            if ( patientObject.months[year-2] && patientObject.months[year-2].has(12)) return true
          } else {
            if (patientObject.months[year-1] && patientObject.months[year-1].has(month-1)) return true
          }
          return false
        }
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
        if ((patientBase[patient].years.has(year.toString()) && patientBase[patient].months[year].has(parseInt(month))) || checkLastYearBills(patientBase[patient], year, month)) {
          if(checkLastYearBills(patientBase[patient], year, month)){
            rankedPatientBase[patient].status="retained" 
          } else {
            if (patientBase[patient].years.size === 1) {
              rankedPatientBase[patient].status="gained"
            } else {
              rankedPatientBase[patient].status="regained"
            }
          }
          
        } else {
          if (checkIfLost(patientBase[patient], year, month)){
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

  const generateMonthlyReport = async (formattedData, rankParameters, yearSumToggle) => {
    let monthlyReport = {}
    const billsByYearMonth= groupObjectBy(groupBy(formattedData, "year"), "month")
    for (let year in billsByYearMonth) {
      if (!monthlyReport[year]) monthlyReport[year]={}
      for (let month in billsByYearMonth[year]) {
        monthlyReport[year][month] = rankPatientBaseMonthly(generatePatientBase(formattedData.filter( bill => bill.date.getTime() < new Date(parseInt(year), parseInt(month)-1)  )), rankParameters, year, month)
      }
    }
    return monthlyReport
  }

export { 
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
}
