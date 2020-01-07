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
  precisionFixed,
  schemePaired
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
{category:'AL',freq:{low:4786, mid:1319, high:249}}
,{category:'AZ',freq:{low:1101, mid:412, high:674}}
,{category:'CT',freq:{low:932, mid:2149, high:418}}
,{category:'DE',freq:{low:832, mid:1152, high:1862}}
,{category:'FL',freq:{low:4481, mid:3304, high:948}}
,{category:'GA',freq:{low:1619, mid:167, high:1063}}
,{category:'IA',freq:{low:1819, mid:247, high:1203}}
,{category:'IL',freq:{low:4498, mid:3852, high:942}}
,{category:'IN',freq:{low:797, mid:1849, high:1534}}
,{category:'KS',freq:{low:162, mid:379, high:471}}
,{category:'ES',freq:{low:1660, mid:579, high:471}}
];

const initialColors = {
  barColor: 'steelblue',
  low:"#807dba", 
  mid:"#e08214",
  high:"#41ab5d",
  gained:"#807dba", 
  regained:"#e08214",
  retained:"#41ab5d",
  lost: schemePaired[5]
}

const HistoPie = ({data:propData}) => {
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef)

  const [colors, setColors] = useState(initialColors)
  const [processedInput, setProcessedInput] = useState(freqData)


  useEffect(() => {
    const inputData = propData ? propData : freqData

    if (!inputData[0].hasOwnProperty("total")){
      setProcessedInput(inputData.map( obj => {
           const newObj = {...obj}
           newObj.total = Object.values(obj.freq).reduce( (ac,cu) => ac+cu)
           return newObj
        }) 
      )
    } else {
      setProcessedInput(inputData)
    }
  }, [propData])

  useEffect( () => {

    if (!dimensions) return;

    //histogram initial data-formatting
    const HgData = processedInput.map( obj => [obj.category, obj.total])

    //pie initial data-formatting
    const pieData = Object.keys(processedInput[0].freq) //for each type of frequency
      .map( type => ({
        type: type,
        freq: processedInput.map(obj => obj.freq[type]).reduce((ac,cu) => ac+cu) //calc sum of all elements
      }) 
    )

    //HistoGram config
    const Hg = {}, HgDim = {pt: 30, pr: 0, pb: 30, pl: 0};

    //creating svg for histogram

    const Hgsvg = 
      select(wrapperRef.current)
      .select(".histogram")
        .attr("width", dimensions.width/2)
        .attr("height", dimensions.height)

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
        .attr("transform", `translate( 0, ${dimensions.height - HgDim.pb })`)
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
              .attr("height", d => dimensions.height - yScale(d[1]) - HgDim.pb - HgDim.pt)
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
            .select("rect")
              .attr("x", d => xScale(d[0]))
              .attr("y", d => yScale(d[1]) + HgDim.pt)
              .attr("width", xScale.bandwidth())
              .attr("height", d => dimensions.height - yScale(d[1]) - HgDim.pb - HgDim.pt)
              .attr("fill", colors.barColor)
              .on("mouseover", HgMouseover)
              .on("mouseout", HgMouseout)

        //updating the text
          updatedBars
            .select("text")
              .text(d => format(',')(d[1]))
              .attr("x", d => xScale(d[0]) + xScale.bandwidth() /2)
              .attr("y", d => yScale(d[1]) - 5 + HgDim.pt )
              .attr("text-anchor", "middle")
          
        return updatedBars
      }
      )
      .attr("class", "bar")

    //HgMouseover function
    function HgMouseover(d) {
      let st = processedInput.filter( s => s.category == d[0])[0]
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
          .attr("height", d => dimensions.height - yScale(d[1]) - HgDim.pb - HgDim.pt)
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
              .attr("transform", `translate(${pieDim.w/2},${pieDim.h/2})`)

            updatedPieChart
              .select("path")
                .each(function(d){this._current = d})
                .attr("d", arcGen)
                .attr("fill", d => colors[d.data.type])
                .on("mouseover", pieMouseover)
                .on("mouseout", pieMouseout)

          return updatedPieChart
        }
      )

    //pieMouseover
    function pieMouseover(d) {
      Hg.update(
        processedInput.map( obj => [obj.category, obj.freq[d.data.type]]),
        colors[d.data.type]
      )
    }

    //pieMouseout
    function pieMouseout(d){
      Hg.update(
        processedInput.map( obj => [obj.category, obj.total]),
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
      .select("tbody")
      .selectAll("tr")
      .data(pieData)
      .join( 
        enter => {
          const enterLegend = 
            enter.append("tr")

          // create the first column for each segment.
          enterLegend
            .append("td")
            .attr("class", "first")
              .append("svg")
                .attr("width", '16')
                .attr("height", '16')
                .append("rect")
                  .attr("width", '16')
                  .attr("height", '16')
                  .attr("fill", d => colors[d.type]);

          // create the second column for each segment.
          enterLegend
            .append("td")
            .attr("class", "second")
              .text(d => d.type);

          // create the third column for each segment.
          enterLegend
            .append("td")
            .attr("class", "third")
              .attr("class",'legendFreq')
              .text( d => format(",")(d.freq) );

          // create the fourth column for each segment.
          enterLegend
            .append("td")
            .attr("class", "fourth")
              .attr("class",'legendPerc')
              .text( d => getLegend(d,pieData) );

          return enterLegend
      },
      
        update => {
          const updatedLegend = update

          // create the first column for each segment.
          updatedLegend
            .select(".first")
              .select("svg")
                .attr("width", '16')
                .attr("height", '16')
                .select("rect")
                  .attr("width", '16')
                  .attr("height", '16')
                  .attr("fill", d => colors[d.type]);

          // create the second column for each segment.
          updatedLegend
            .select(".second")
              .text(d => d.type);

          // create the third column for each segment.
          updatedLegend
            .select(".legendFreq")
              .text( d => format(",")(d.freq) );

          // create the fourth column for each segment.
          updatedLegend
            .select(".legendPerc")
              .text( d => getLegend(d,pieData) );

          return updatedLegend
           
        }
      )
        

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



  }, [processedInput, dimensions])

  return (
    <div ref={wrapperRef} className="chart-container">
      <svg className="histogram">
        <g className="x-axis" />
      </svg>
      <svg className="piechart"></svg>
      <table className="legend">
        <tbody />
      </table>
    </div>
  )
}

export default HistoPie
