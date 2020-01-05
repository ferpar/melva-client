import React, { useRef, useState, useEffect } from "react";
import { 
  scaleLinear, 
  scaleBand, 
  select, 
  axisBottom,
  max,
  format,
  arc,
  pie,
  interpolate,
  precisionFixed
} from "d3";
import "./HistoPie.css";

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

const freqData=[
{State:'AL',freq:{low:4786, mid:1319, high:249}}
,{State:'AZ',freq:{low:1101, mid:412, high:674}}
,{State:'CT',freq:{low:932, mid:2149, high:418}}
,{State:'DE',freq:{low:832, mid:1152, high:1862}}
,{State:'FL',freq:{low:4481, mid:3304, high:948}}
,{State:'GA',freq:{low:1619, mid:167, high:1063}}
,{State:'IA',freq:{low:1819, mid:247, high:1203}}
,{State:'IL',freq:{low:4498, mid:3852, high:942}}
,{State:'IN',freq:{low:797, mid:1849, high:1534}}
,{State:'KS',freq:{low:162, mid:379, high:471}}
,{State:'ES',freq:{low:1660, mid:579, high:471}}
];

const initialColors = {
  barColor: 'steelblue',
  low:"#807dba", 
  mid:"#e08214",
  high:"#41ab5d"
}

const HistoPie = props => {
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef)

  const [colors, setColors] = useState(initialColors)

  const inputData = freqData.map( obj => {
     const newObj = {...obj}
     newObj.total = Object.values(obj.freq).reduce( (ac,cu) => ac+cu)
     return newObj
  }) 
  const [data, setData] = useState(inputData)

  const HgData = inputData.map( obj => [obj.State, obj.total])

  const pieData = Object.keys(inputData[0].freq) //for each type of frequency
    .map( type => ({
      type: type,
      freq: inputData.map(obj => obj.freq[type]).reduce((ac,cu) => ac+cu) //calc sum of all elements
    }) 
  )

  useEffect( () => {

    if (!dimensions) return;

    //HistoGram config
    const Hg = {}, HgDim = {pt: 10, pr: 0, pb: 30, pl: 0};

    //creating svg for histogram

    const Hgsvg = 
      select(wrapperRef.current)
      .select(".histogram")
      .attr("width", dimensions.width/2)
      .attr("height", dimensions.height)
      .style("border", "1px solid black")

    //x-axis mapping
    
    const xScale = scaleBand()
      .domain(HgData.map( arr => arr[0]))
      .range([0, dimensions.width/2])
      .padding(0.1)

    //creating x-axis
    
    const xAxis = axisBottom(xScale)
      .ticks(HgData.length)

    //adding x-axis to the histogram svg
    
    Hgsvg
      .select(".x-axis")
      .attr("transform", `translate( 0, ${dimensions.height})`)
      .call(xAxis)
      
    //y-axis mapping
    
    const yScale = scaleLinear()
      .domain([0, max(HgData, arr => arr[1] )])
      .range([dimensions.height - HgDim.pt - HgDim.pb, 0])

    //creating bars for histogram to contain rectangles and freq labels
    
    Hgsvg
      .selectAll(".bar")
      .data(HgData)
      .join(enter => {
        
        const bars = enter.append("g")
        
        //appending the rectangles

          bars
            .append("rect")
              .attr("x", d => xScale(d[0]))
              .attr("y", d => yScale(d[1]) + HgDim.pt)
              .attr("width", xScale.bandwidth())
              .attr("height", d => dimensions.height - yScale(d[1]) - HgDim.pb)
              .attr("fill", colors.barColor)
              .on("mouseover", HgMouseover)
              .on("mouseout", HgMouseout)

        //appending the labels
          bars
            .append("text")
              .text(d => format(',')(d[1]))
              .attr("x", d => xScale(d[0]) + xScale.bandwidth() /2)
              .attr("y", d => yScale(d[1]) - 5 + HgDim.pt )
              .attr("text-anchor", "middle")
      
        return bars
      },
      
      update => {
        const updatedBars = update

        //updating the rectangles
          updatedBars
            .selectAll("rect")
              .attr("x", d => xScale(d[0]))
              .attr("y", d => yScale(d[1]) + HgDim.pt)
              .attr("width", xScale.bandwidth())
              .attr("height", d => dimensions.height - yScale(d[1]) - HgDim.pb)
              .attr("fill", colors.barColor)
              .on("mouseover", HgMouseover)
              .on("mouseout", HgMouseout)

        //updating the text
          updatedBars
            .selectAll("text")
              .text(d => format(',')(d[1]))
              .attr("x", d => xScale(d[0]) + xScale.bandwidth() /2)
              .attr("y", d => yScale(d[1]) - 5 + HgDim.pt )
              .attr("text-anchor", "middle")
          
        return updatedBars
      })
      .attr("class", "bar")

    //HgMouseover function
    function HgMouseover(d) {
      let st = data.filter( s => s.State == d[0])[0]
      let nD = Object.keys(st.freq).map( s => ({type: s, freq: st.freq[s]}))

      Pc.update(nD)
      leg.update(nD)
    }

    //HgMouseout function
    function HgMouseout(d) {
      Pc.update(pieData)
      leg.update(pieData)
    }

    // histogram update function
    Hg.update = function(nD, color){
      // update y scale domain 
      yScale.domain([0, max(nD, arr => arr[1])])

      // attach the new data to the bars
      let bars = Hgsvg
        .selectAll(".bar")
        .data(nD)

      // transition the height and color of the rectangles
      bars
        .select("rect").transition().duration(500)
        .attr("y", d => yScale(d[1]) + HgDim.pt)
        .attr("height", d => dimensions.height - yScale(d[1]) - HgDim.pb)
        .attr("fill", color)

      // transition the labels location and change value
      bars
        .select("text").transition().duration(500)
        .text(d => format(',')(d[1]))
        .attr("y", d => yScale(d[1]) - 5 + HgDim.pt)
        
    }


    //PieChart Config
    const Pc = {}, pieDim = {w: dimensions.width/4, h: dimensions.height};
    pieDim.r = Math.min(pieDim.w, pieDim.h)/2

    //creating svg for piechart
    
    const piesvg = 
      select(wrapperRef.current)
      .select(".piechart")
        .attr("width", pieDim.w)
        .attr("height", pieDim.h)

    //function to draw the arcs of the pie slices
    const arcGen = arc()
      .outerRadius(pieDim.r - 10)
      .innerRadius(0)

    //function to compute the slice angles
    const pieGen = pie()
      .sort(null).value(d => d.freq)

    //draw the pie slices
    piesvg
      .selectAll("g")
      .data(pieGen(pieData))
      .join( 
        enter => {
         const pieChart = 
            enter
              .append("g")
                .attr("transform", `translate(${pieDim.w/2},${pieDim.h/2})`)

            pieChart
              .append("path")
                .each(function(d){this._current = d})
                .attr("d", arcGen)
                .attr("fill", d => colors[d.data.type])
                .on("mouseover", pieMouseover)
                .on("mouseout", pieMouseout)

          return pieChart
        },

        update => {
          const updatedPieChart = update

            updatedPieChart
              .selectAll("path")
                .each(function(d){this._current = d})
                .attr("d", arcGen)
                .attr("fill", d => colors[d.data.type])
                .on("mouseover", pieMouseover)
                .on("mouseout", pieMouseout)

          return updatedPieChart
        }
      )
   //   .join("path")
      .each(function(d){this._current = d})
      .attr("d", arcGen)
      .attr("fill", d => colors[d.data.type])
      .on("mouseover", pieMouseover)
      .on("mouseout", pieMouseout)

    //pieMouseover
    function pieMouseover(d) {
      Hg.update(
        data.map( obj => [obj.State, obj.freq[d.data.type]]),
        colors[d.data.type]
      )
    }

    //pieMouseout
    function pieMouseout(d){
      Hg.update(
        data.map( obj => [obj.State, obj.total]),
        colors.barColor
      )
    }

    //Update function accessible via the Pc object
    Pc.update = function(nD) {
      piesvg
        .selectAll("path")
        .data(pieGen(nD))
        .transition().duration(500)
        .attrTween("d", arcTween)
    }

    //ArcTween interpolator function
    function arcTween(a) {
      let interpolator = interpolate(this._current, a);
      this._current = interpolator(0);
      return (t) => arcGen(interpolator(t))
    }

    //legend config
    let leg = {};
            
    // create table for legend.
    let legend = select(wrapperRef.current)
      .select(".legend")
      .attr('class','legend')
      .attr("width", dimensions.width/4)
    ;
    
    // create one row per segment.
    let tr = legend
      .append("tbody")
      .selectAll("tr")
      .data(pieData)
      .join("tr");
        
    // create the first column for each segment.
    tr
      .append("td")
      .append("svg")
      .attr("width", '16')
      .attr("height", '16')
      .append("rect")
        .attr("width", '16')
        .attr("height", '16')
        .attr("fill", d => colors[d.type]);
        
    // create the second column for each segment.
    tr
      .append("td")
      .text(d => d.type);

    // create the third column for each segment.
    tr
      .append("td")
      .attr("class",'legendFreq')
        .text( d => format(",")(d.freq) );

    // create the fourth column for each segment.
    tr
      .append("td")
      .attr("class",'legendPerc')
        .text( d => getLegend(d,pieData) );

    // Utility function to be used to update the legend.
    leg.update = function(nD){
        // update the data attached to the row elements.
        var l = legend
          .select("tbody")
          .selectAll("tr")
          .data(nD);

        // update the frequencies.
        l
          .select(".legendFreq")
          .text( d => format(",")(d.freq) );

        // update the percentage column.
        l
          .select(".legendPerc")
          .text( d => getLegend(d,nD) );        
    }
    
    function getLegend(d,aD){ // Utility function to compute percentage.
        return format("." + precisionFixed(0.01) + "%")(d.freq/aD.map( v => v.freq ).reduce( (ac, cu) => ac + cu));
    }



  }, [data, dimensions])

  return (
    <div ref={wrapperRef} className="chart-container">
      <svg className="histogram">
        <g className="x-axis" />
      </svg>
      <svg className="piechart"></svg>
      <table className="legend"></table>
    </div>
  )
}

export default HistoPie
