import React from "react"
import TreeMenu from "react-simple-tree-menu";
import "./TreeView.css"

const TreeView = ({ data, lookupYear, lookupMonth, category }) => {

  const treeData = []

  const subset = (lookupYear && lookupMonth) && data[lookupYear][lookupMonth]
  
  if (lookupYear && lookupMonth) {
    for (let patient in subset){
      let patientNodes = []
      let patientStatus = ""
      for (let item in subset[patient]) {
        if (typeof subset[patient][item] === "string" || typeof subset[patient][item] === "number") {
          patientNodes.push({key: item, label: item + " " + subset[patient][item]})
          if (item === "status") {
            patientStatus = subset[patient][item]
          }
        } else if (item === "bills") {
          let billNodes = []
          for (let bill in subset[patient].bills){
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            billNodes.push({
              key: bill, 
              label: 
                subset[patient].bills[bill].date.toLocaleDateString('es-ES', options) + 
                " concepto: " + subset[patient].bills[bill].treatment + "  " 
                + "  " + subset[patient].bills[bill].patientId
            })
          }
          patientNodes.push({key: item, label: "facturas", nodes: billNodes})
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
