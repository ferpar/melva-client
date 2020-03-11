import React from "react"
import TreeMenu from "react-simple-tree-menu";

const TreeView = ({ data, lookupYear, lookupMonth, category }) => {

  const treeData = []

//  for (let year in props.data) {
//    let yearNodes = []
//    for (let month in props.data[year]) {
//      let monthNodes = []
//      for (let patient in props.data[year][month]){
//        let patientNodes = []
//        for (let item in props.data[year][month][patient]){
//          if (typeof props.data[year][month][patient][item] === "string" || typeof props.data[year][month][patient][item] === "number"){
//            patientNodes.push({key: item, label: item + " " + props.data[year][month][patient][item]})
//          } else if (item === "bills") {
//            let billsNodes = []
//            for (let bill in props.data[year][month][patient].bills) {
//              billsNodes.push({ key: bill, label: bill})
//            }
//            patientNodes.push({key: item, label: item, nodes: billsNodes})
//          } else {
//            patientNodes.push({key: item, label: item + " " + props.data[year][month][patient][item]})
//          }
//        }
//        monthNodes.unshift({key: patient, label: props.data[year][month][patient].fullname, nodes: patientNodes})
//      }
//      yearNodes.push({key: month, label: month, nodes: monthNodes})
//    }
//    treeData.push({key: year, label: year, nodes: yearNodes})
//  }

            //  let billDetailNodes = []
            //  for (let detail in bill){
            //    billDetailNodes.push({key: detail, label: detail + " " + props.data[year][month][patient].bills[bill][detail]})
            //  }
            //  billsNodes.push({ key: bill, label: bill, nodes: billDetailNodes})
  
  const subset = (lookupYear && lookupMonth) && data[lookupYear][lookupMonth]
  
  if (lookupYear && lookupMonth) {
    for (let patient in subset){
      let patientNodes = []
      let patientStatus = ""
      for (let item in subset[patient]) {
        patientNodes.push({key: item, label: item + " " + subset[patient][item]})
        if (item === "status") {
          patientStatus = subset[patient][item]
        }
      }
      treeData.unshift({key: patient, label: patient + " " + subset[patient].fullname, status: patientStatus, nodes: patientNodes})
    }
  }

  console.log(treeData)

  const filteredTreeData = category ? 
    ( category === "gained" 
      ? treeData.filter(patient => (patient.status === "new" || patient.status === "regained")) 
      : treeData.filter(patient => patient.status === category)
    ) 
    : treeData
  console.log(filteredTreeData.length)

  return (
    <TreeMenu data={filteredTreeData}/>
  )
}

export default TreeView
