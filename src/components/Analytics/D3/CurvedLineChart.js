import React, { useRef, useState, useEffect } from "react";
import { select, line, curveCardinal } from "d3";
import data from "./FLdata.js";

const CurvedLineChart = (props) => {
  const [randomData, setRandomData] = useState([25, 30, 45, 60, 20, 65, 75])
  const svgRef = useRef();
  const svgStyle = {
    "background": "#eee",
    "width": "700px"
  }
  useEffect(() => {
    const svg = select(svgRef.current) 

    const myLine = line()
      .x((val, index) => index * 150)
      .y( val => 150 - val)
      .curve(curveCardinal)

    svg.selectAll("path")
      .data([randomData])
      .join("path")
      .attr("d", val => myLine(val))
      .attr("fill", "none")
      .attr("stroke", "blue")

  }, [randomData])
  return (
    <>
      <svg ref={svgRef} style={svgStyle}></svg>
      <button className="button" onClick={() => setRandomData( randomData.map( val => val + 5))}>
        Update
      </button>
      <button onClick ={() => setRandomData( randomData.filter( val => val < 35))}>
        Filter Data
      </button>
    </>)
  
}

export default CurvedLineChart
