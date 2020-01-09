import React, {useState} from "react"
import "./Table.css"

const YearlyTable = ({yearlyReport}) => {
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
          <tr className="table-row">
            <th>año</th>
            {yearlyReport.map( (yearSummary, idx) => <th key={idx}>{yearSummary.year}</th>)}
          </tr>
        </thead>
        <tbody>
            {expanded > 0 ? (
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
                { expanded > 2 ? (
                  <>
                    <tr className="table-row row-pt2">
                      <td>nuevos</td>
                      {yearlyReport.map( (row, idx) => <td key={idx}>{row.gained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>repescados</td>
                      {yearlyReport.map( (row, idx) => <td key={idx}>{row.regained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ganados</td>
                      {yearlyReport.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                  </>
                ) : (
                    <tr className="table-row row-pt2">
                      <td>ganados</td>
                      {yearlyReport.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                )
                }
                <tr className="table-row row-pt2">
                  <td>perdidos</td>
                  {yearlyReport.map( (row, idx) => <td className="perdidos" key={idx}>{"- "}{row.lost}</td>)}   
                </tr>
                { expanded > 3 && (
                  <> 
                    <tr className="table-row">
                      <td>olv 1 año</td>
                      {yearlyReport.map( (row, idx) => <td key={idx}>{row.forgotten1Year}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ovl multiaño</td>
                      {yearlyReport.map( (row, idx) => <td key={idx}>{row.forgottenMultiYear}</td>)}   
                    </tr>
                  </>
                ) }
                { expanded > 1 &&
                <tr className="table-row row-pt2">
                  <td>potencial</td>
                  {yearlyReport.map( (row, idx) => <td key={idx}>{row.gained + row.regained + row.retained + row.lost}</td>)}   
                </tr>
                }
              </>
            ) : (
            <tr className="table-row">
              <td>Pacientes</td>
              {yearlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
            </tr>
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

const QuarterlyTable = ({quarterlyReport}) => {
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
          <tr className="table-row">
            <th>trimestre</th>
            {quarterlyReport.map( (yearSummary, idx) => <th key={idx}>{yearSummary.year}</th>)}
          </tr>
        </thead>
        <tbody>
            {expanded > 0 ? (
              <>
                <tr className="table-row">
                  <td>Pacientes</td>
                  {quarterlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
                </tr>
                <tr className="table-row">
                  <td>% cambio</td>
                  {quarterlyReport.map( (row, idx) => 
                    
                    ( idx>0 
                      ? <td key={idx}>{Math.round((row.retained + row.regained + row.gained)/
                        (quarterlyReport[idx-1].retained + quarterlyReport[idx-1].regained + quarterlyReport[idx-1].gained)
                        * 100 -100) + "%"
                      }</td> 
                      : <td key={idx}>{" "}</td>
                    )
                    )
                  }   
                </tr>
                { expanded > 2 ? (
                  <>
                    <tr className="table-row row-pt2">
                      <td>nuevos</td>
                      {quarterlyReport.map( (row, idx) => <td key={idx}>{row.gained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>repescados</td>
                      {quarterlyReport.map( (row, idx) => <td key={idx}>{row.regained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ganados</td>
                      {quarterlyReport.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                  </>
                ) : (
                    <tr className="table-row row-pt2">
                      <td>ganados</td>
                      {quarterlyReport.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                )
                }
                <tr className="table-row row-pt2">
                  <td>perdidos</td>
                  {quarterlyReport.map( (row, idx) => <td className="perdidos" key={idx}>{"- "}{row.lost}</td>)}   
                </tr>
                { expanded > 3 && (
                  <> 
                    <tr className="table-row">
                      <td>olv 1 año</td>
                      {quarterlyReport.map( (row, idx) => <td key={idx}>{row.forgotten1Year}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ovl multiaño</td>
                      {quarterlyReport.map( (row, idx) => <td key={idx}>{row.forgottenMultiYear}</td>)}   
                    </tr>
                  </>
                ) }
                { expanded > 1 &&
                <tr className="table-row row-pt2">
                  <td>potencial</td>
                  {quarterlyReport.map( (row, idx) => <td key={idx}>{row.gained + row.regained + row.retained + row.lost}</td>)}   
                </tr>
                }
              </>
            ) : (
            <tr className="table-row">
              <td>Pacientes</td>
              {quarterlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
            </tr>
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

const MonthlyTable = ({monthlyReport}) => {
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
          <tr className="table-row">
            <th>més</th>
            {monthlyReport.map( (yearSummary, idx) => <th key={idx}>{yearSummary.year}</th>)}
          </tr>
        </thead>
        <tbody>
            {expanded > 0 ? (
              <>
                <tr className="table-row">
                  <td>Pacientes</td>
                  {monthlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
                </tr>
                <tr className="table-row">
                  <td>% cambio</td>
                  {monthlyReport.map( (row, idx) => 
                    
                    ( idx>0 
                      ? <td key={idx}>{Math.round((row.retained + row.regained + row.gained)/
                        (monthlyReport[idx-1].retained + monthlyReport[idx-1].regained + monthlyReport[idx-1].gained)
                        * 100 -100) + "%"
                      }</td> 
                      : <td key={idx}>{" "}</td>
                    )
                    )
                  }   
                </tr>
                { expanded > 2 ? (
                  <>
                    <tr className="table-row row-pt2">
                      <td>nuevos</td>
                      {monthlyReport.map( (row, idx) => <td key={idx}>{row.gained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>repescados</td>
                      {monthlyReport.map( (row, idx) => <td key={idx}>{row.regained}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ganados</td>
                      {monthlyReport.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                  </>
                ) : (
                    <tr className="table-row row-pt2">
                      <td>ganados</td>
                      {monthlyReport.map( (row, idx) => <td className="ganados" key={idx}>{row.gained + row.regained}</td>)}   
                    </tr>
                )
                }
                <tr className="table-row row-pt2">
                  <td>perdidos</td>
                  {monthlyReport.map( (row, idx) => <td className="perdidos" key={idx}>{"- "}{row.lost}</td>)}   
                </tr>
                { expanded > 3 && (
                  <> 
                    <tr className="table-row">
                      <td>olv 1 año</td>
                      {monthlyReport.map( (row, idx) => <td key={idx}>{row.forgotten1Year}</td>)}   
                    </tr>
                    <tr className="table-row">
                      <td>ovl multiaño</td>
                      {monthlyReport.map( (row, idx) => <td key={idx}>{row.forgottenMultiYear}</td>)}   
                    </tr>
                  </>
                ) }
                { expanded > 1 &&
                <tr className="table-row row-pt2">
                  <td>potencial</td>
                  {monthlyReport.map( (row, idx) => <td key={idx}>{row.gained + row.regained + row.retained + row.lost}</td>)}   
                </tr>
                }
              </>
            ) : (
            <tr className="table-row">
              <td>Pacientes</td>
              {monthlyReport.map( (row, idx) => <td key={idx}>{row.retained + row.regained + row.gained}</td>)}   
            </tr>
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

export {YearlyTable, QuarterlyTable, MonthlyTable}
