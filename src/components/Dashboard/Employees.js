import React, { useState } from "react";
import "./Employees.css";

import EmployeesForm from "./Employees/EmployeesForm.js";

const Employees = props => {

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [employees, setEmployees] = useState(props.franchise.employees)
  const [employeeToEdit, setEmployeeToEdit] = useState("")

  const handleIsFormOpen = () => {
    setIsFormOpen(!isFormOpen)
  }

  const handleAddEmployee = savedEmployee => {
    setEmployees([...employees, savedEmployee])
  }

  const handleEmployeeToEdit = employeeId => {
    setEmployeeToEdit(employeeId)
    handleIsFormOpen()
  }

  const handleUpdateEmployee = updatedEmployee => {
    const position = employees.findIndex( employee => employee._id === updatedEmployee._id )

    setEmployees([...employees.slice(0, position), updatedEmployee, ...employees.slice(position + 1)])
  }

  return (
    <div className="employees-container">
      <div className="employees-wrapper">
        <h1 className="employees-title">Usuarios</h1>
         {employees ? (
         employees.map( (employee, ind) => (
           <div 
            className="employees-slug"
            key={ind}
           >
            <p >{employee.name}</p>
            <button
              className="employees-button"
              onClick={() => handleEmployeeToEdit(employee._id)} 
            >
              Editar
            </button> 
           </div>
         )) 
         ) : (<p>No Locations added yet</p>)}
        <hr className="employees-separator"/>
        
        { isFormOpen ? (
          <EmployeesForm 
            handleIsFormOpen={handleIsFormOpen}
            handleAddEmployee={handleAddEmployee}
            employees={employees}
            employeeToEdit={employeeToEdit}
            handleEmployeeToEdit={handleEmployeeToEdit}
            handleUpdateEmployee={handleEmployeeToEdit}
            franchise={props.franchise}
            authService={props.authService}
          />
        ) : (
        <button 
          className="employees-button"
          onClick={() => setIsFormOpen(true)}
        >
          Añadir
        </button>
        )}

      </div>
    </div>
  )
}

export default Employees
