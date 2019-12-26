import React, { useRef, useState, useEffect } from "react";
import { 
  select, 
  line, 
  curveCardinal, 
  axisBottom ,
  axisRight,
  scaleLinear
} from "d3";

const AxisScales = (props) => {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75])
  const svgRef = useRef();
  const svgStyle = {
    "background": "#eee",
    "width": "700px",
    "overflow": "visible"
  }
  useEffect(() => {
    const svg = select(svgRef.current) 
    const xScale = scaleLinear().domain([0, 6]).range([0, 700])
    const yScale = scaleLinear().domain([0, 75]).range([150, 0])

    const xAxis = axisBottom(xScale).ticks(data.length).tickFormat(index => index +1)

    svg.select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis)

    const yAxis = axisRight(yScale)

    svg.select(".y-axis")
      .style("transform", "translateX(700px)")
      .call(yAxis)

    const myLine = line()
      .x((val, index) => xScale(index))
      .y(yScale)  // same as:.y( val => yScale(val))
      .curve(curveCardinal)

    svg.selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", val => myLine(val))
      .attr("fill", "none")
      .attr("stroke", "blue")

  }, [data])
  return (
    <>
      <svg ref={svgRef} style={svgStyle}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={() => setData( data.map( val => val + 5))}>
        Update
      </button>
      <button onClick ={() => setData( data.filter( val => val < 35))}>
        Filter Data
      </button>
    </>)
  
}

export default AxisScales
