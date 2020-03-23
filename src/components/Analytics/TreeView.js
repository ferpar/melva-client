import React from "react"
import TreeMenu from "react-simple-tree-menu";
import "./TreeView.css"

const categoryMapper = {
  new: "nuevos",
  regained: "repescados",
  gained: "ganados",
  retained: "conservados",
  forgotten1Year: "olvidados 1 año",
  forgottenMultiYear: "olvidados multiaño"
}

const TreeView = ({ 
  data, 
  lookupYear, 
  lookupMonth, 
  category,
  handleSetEntrySum,
  handleSetExportMemo
}) => {

  const treeData = []

  const subset = (lookupYear && lookupMonth) && data[lookupYear][lookupMonth]

  //user properties: patientId, bills, name, surname, fullname, phone, phone1, phone2, yearSum, yearSpan, billSum, longevityRank, asiduityRank, status
  
  if (lookupYear && lookupMonth) {
    for (let patient in subset){
      let patientNodes = []
      let patientStatus = ""
      for (let item in subset[patient]) {
        if (typeof subset[patient][item] === "string" || typeof subset[patient][item] === "number") {
          if (item === "asiduityRank") {
            patientNodes.push({key: item, label: "asiduidad: " + subset[patient][item]})
          }
          if (item === "billSum") {
            patientNodes.push({key: item, label: "total de facturas: " + subset[patient][item]})
          }
          if (item === "longevityRank") {
            patientNodes.push({key: item, label: "longevidad: " + subset[patient][item]})
          }
          if (item === "yearSpan") {
            patientNodes.push({key: item, label: "años activo: " + subset[patient][item]})
          }
          if (item === "status") {
            patientNodes.push({key: item, label: "categoría: " + categoryMapper[subset[patient][item]]})
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
                + "  paciente: " +subset[patient].bills[bill].patientId
            })
          }
          patientNodes.push({key: item, label: "facturas", nodes: billNodes})
        }
      }
      treeData.unshift({key: patient, label: patient + " " + 
        subset[patient].surname + "; " + subset[patient].name + "; " + subset[patient].phone,
        status: patientStatus,
        stringExport: subset[patient].surname + "; " + subset[patient].name + "; " + subset[patient].phone, 
        nodes: patientNodes})
    }
  }

  const filteredTreeData = category ? 
    ( category === "gained" 
      ? treeData.filter(patient => (patient.status === "new" || patient.status === "regained")) 
      : treeData.filter(patient => patient.status === category)
    ) 
    : treeData
  
  //passing the result total one component above
  handleSetEntrySum(filteredTreeData.length)

  const exportArray = filteredTreeData.map( patient => patient.stringExport)
  handleSetExportMemo("Apellidos;Nombre;Telefono 1\n" + exportArray.join('\n')) 

  return (
    <TreeMenu data={filteredTreeData}/>
  )
}

export default TreeView




