import React from "react"
import TreeMenu from "react-simple-tree-menu";

const TreeView = ({ data, lookupYear, lookupMonth }) => {

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
  
  const subset = (lookupYear && lookupMonth) &&  data[lookupYear][lookupMonth]
  
  if (lookupYear && lookupMonth) {
    for (let patient in subset){
      treeData.unshift({key: patient, label: patient})
    }
  }


  return (
    <TreeMenu data={treeData}/>
  )
}

export default TreeView
