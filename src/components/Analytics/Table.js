import React, {useState} from "react"
import "./Table.css"

const YearlyTable = ({yearlyReport}) => {
  const [expanded, setExpanded] = useState(false)

  const handleSetExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr className="table-row">
            <th>año</th>
            {yearlyReport.map( (yearSummary, idx) => <th key={idx}>{yearSummary.year}</th>)}
          </tr>
        </thead>
        <tbody>
            {expanded ? (
              <>
                <tr className="table-row">
                  <td>Pacientes</td>
                  {yearlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
                </tr>
                <tr className="table-row">
                  <td>% cambio</td>
                  {yearlyReport.map( (row, idx) => 
                    
                    ( idx>0 
                      ? <td key={idx}>{Math.round((row.retained + row.regained + row.gained)/
                        (yearlyReport[idx-1].retained + yearlyReport[idx-1].regained + yearlyReport[idx-1].gained)
                        * 100 -100) + "%"
                      }</td> 
                      : <td key={idx}>{" "}</td>
                    )
                    )
                  }   
                </tr>
                <tr className="table-row row-pt2">
                  <td>nuevos</td>
                  {yearlyReport.map( (row, idx) => <td key={idx}>{row.gained}</td>)}   
                </tr>
                <tr className="table-row">
                  <td>repescados</td>
                  {yearlyReport.map( (row, idx) => <td key={idx}>{row.regained}</td>)}   
                </tr>
                <tr className="table-row row-pt2">
                  <td>perdidos</td>
                  {yearlyReport.map( (row, idx) => <td key={idx}>{row.lost}</td>)}   
                </tr>
              </>
            ) : (
            <tr className="table-row">
              <td>Pacientes</td>
              {yearlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
            </tr>
            )}
        </tbody>
      </table>
      <div>
        <button 
          className="expand-button" 
          onClick={handleSetExpanded}>Detalles
        </button>
      </div>
    </div>
  )
}

export {YearlyTable}
