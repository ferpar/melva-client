import React, {useState} from "react"
import "./Table.css"

const ReportTable = ({report, interval}) => {
  const [expanded, setExpanded] = useState(0)

  const handleSetExpanded = () => {
    if (expanded === 0){
      setExpanded(expanded + 1)
    } else {
      setExpanded(expanded - 1)
    }
  }

  const handleSetExpanded2 = () => {
      setExpanded(expanded + 1)
  }
  
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {interval === "yearly" &&
          <tr className="table-row">
            <th>año</th>
            {report.map( (yearSummary, idx) => <th key={idx}>{yearSummary.year}</th>)}
          </tr>
          }
        </thead>
        <tbody>
            {expanded > 0 ? (
              <>
                <tr className="table-row">
                  <td>Pacientes</td>
                  {report.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
                </tr>
                <tr className="table-row">
                  <td>% cambio</td>
                  {report.map( (row, idx) => 
                    
                    ( idx>0 
                      ? <td key={idx}>{Math.round((row.retained + row.regained + row.gained)/
                        (report[idx-1].retained + report[idx-1].regained + report[idx-1].gained)
                        * 100 -100) + "%"
                      }</td> 
                      : <td key={idx}>{" "}</td>
                    )
                    )
                  }   
                </tr>
                { expanded > 1 &&
                  <tr className="table-row">
                    <td>mantenidos</td>
                    {report.map( (row, idx) => <td key={idx}>{row.retained}</td>)}   
                  </tr>
                }
                { expanded > 2 ? (
                  <>
                    <tr className="table-row row-pt2">
                      <td>nuevos</td>
                      {report.map( (row, idx) => <td key={idx}>{row.gained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>repescados</td>
                      {report.map( (row, idx) => <td key={idx}>{row.regained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ganados</td>
                      {report.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                  </>
                ) : (
                    <tr className="table-row row-pt2">
                      <td>ganados</td>
                      {report.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                )
                }
                <tr className="table-row row-pt2">
                  <td>perdidos</td>
                  {report.map( (row, idx) => <td className="perdidos" key={idx}>{"- "}{row.lost}</td>)}   
                </tr>
                { expanded > 3 && (
                  <> 
                    <tr className="table-row">
                      <td>olv 1 año</td>
                      {report.map( (row, idx) => <td key={idx}>{row.forgotten1Year}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ovl multiaño</td>
                      {report.map( (row, idx) => <td key={idx}>{row.forgottenMultiYear}</td>)}   
                    </tr>
                  </>
                ) }
                { expanded > 1 &&
                <tr className="table-row row-pt2">
                  <td>potenciales</td>
                  {report.map( (row, idx) => <td key={idx}>{row.gained + row.regained + row.retained + row.lost}</td>)}   
                </tr>
                }
              </>
            ) : (
              <>
                <tr className="table-row">
                  <td>Pacientes</td>
                  {report.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
                </tr>
                <tr className="table-row">
                  <td>% cambio</td>
                  {report.map( (row, idx) => 
                    
                    ( idx>0 
                      ? <td key={idx}>{Math.round((row.retained + row.regained + row.gained)/
                        (report[idx-1].retained + report[idx-1].regained + report[idx-1].gained)
                        * 100 -100) + "%"
                      }</td> 
                      : <td key={idx}>{" "}</td>
                    )
                    )
                  }   
                </tr>
              </>
            )}
        </tbody>
      </table>
      <div className="table-buttons">
        <button 
          className="expand-button" 
          onClick={handleSetExpanded}>
            {expanded > 0 ? ("- Detalle") : ("+ Detalle")}
        </button>
        { (expanded > 0 && expanded < 4) &&
          <button 
            className="expand-button" 
            onClick={handleSetExpanded2}>
              + Detalle
          </button>
        }
      </div>
    </div>
  )
}

export default ReportTable
