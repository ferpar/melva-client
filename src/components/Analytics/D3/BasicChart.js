import React, { useRef, useState, useEffect } from "react";
import { select } from "d3";
import data from "./FLdata.js";

const BasicChart = (props) => {
  const [randomData, setRandomData] = useState([25, 30, 45, 60, 20])
  const svgRef = useRef();
  useEffect(() => {
    const svg = select(svgRef.current) 

    svg
      .selectAll("circle")
      .data(randomData)
      .join(
        enter => enter.append("circle").attr("class", "new"),
        update => update.attr("class", "updated"),
        exit => exit.remove()
      )
        .attr("r", val => val)
        .attr("cx", val => val*2)
        .attr("cy", val => val*2)
        .attr("stroke", "tomato")
  }, [randomData])
  return (
    <>
      <svg ref={svgRef}></svg>
      <button onClick={() => setRandomData( randomData.map( val => val + 5))}>
        Update
      </button>
      <button onClick ={() => setRandomData( randomData.filter( val => val < 35))}>
        Filter Data
      </button>
    </>)
  
}

export default BasicChart
