import React, { useRef, useState, useEffect } from "react";
import { 
  select, 
  axisBottom ,
  axisRight,
  scaleLinear,
  scaleBand
} from "d3";
import ResizeObserver from "resize-observer-polyfill";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect( () => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver( (entries) => {
      entries.forEach( entry => {
        setDimensions(entry.contentRect)
      })
    })
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])
  return dimensions;
}

const InteractiveChart = ({data}) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef)
  
  useEffect(() => {
    const svg = select(svgRef.current) 

    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(data.map( (val, index) => index))
      .range([0, dimensions.width]) 
      .padding(0.5)

    const yScale = scaleLinear()
      .domain([0, 150]) // todo
      .range([dimensions.height, 0])  

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "yellow", "red"])
      .clamp(true)

    const xAxis = axisBottom(xScale)
      .ticks(data.length)

    svg.select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis)

    const yAxis = axisRight(yScale)

    svg.select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis)

    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("fill", colorScale)
      .style("transform", "scale(1, -1)")
      .attr("x", (val, index) => xScale(index))
      .attr("y", - dimensions.height)
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
      .attr("height", val => dimensions.height - yScale(val))
      
  }, [data, dimensions])
  return (
    <div ref={wrapperRef} className="chart-container">
      <svg ref={svgRef} >
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>)
  
}

export default InteractiveChart
