import React, { useRef, useState, useEffect } from "react";
import { 
  select, 
  axisBottom ,
  axisRight,
  scaleLinear,
  scaleBand
} from "d3";

const InteractiveChart = (props) => {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75])
  const svgRef = useRef();
  const svgStyle = {
    "background": "#eee",
    "width": "700px",
    "overflow": "visible"
  }
  useEffect(() => {
    const svg = select(svgRef.current) 

    const xScale = scaleBand()
      .domain(data.map( (val, index) => index))
      .range([0, 700])
      .padding(0.5)

    const yScale = scaleLinear()
      .domain([0, 150])
      .range([150, 0])

    const colorScale = scaleLinear()
      .domain([75, 120, 150])
      .range(["green", "yellow", "red"])
      .clamp(true)

    const xAxis = axisBottom(xScale)
      .ticks(data.length)

    svg.select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis)

    const yAxis = axisRight(yScale)

    svg.select(".y-axis")
      .style("transform", "translateX(700px)")
      .call(yAxis)

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("fill", colorScale)
      .style("transform", "scale(1, -1)")
      .attr("x", (val, index) => xScale(index))
      .attr("y", -150)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", (value, index) => {
        svg
          .selectAll(".tooltip")
          .data([value])
          .join( enter => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth()/2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value + 8))
          .attr("opacity", 1)
      })
      .on("mouseleave", (value, index) => {
        svg
          .select(".tooltip")
          .remove() 
      })
      .transition()
      .attr("height", val => 150 - yScale(val))
      
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
      <button onClick ={() => setData( data => [...data, parseInt(Math.random()*100)])}>
        Add Data
      </button>
    </>)
  
}

export default InteractiveChart
