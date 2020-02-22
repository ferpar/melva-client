import React, {useState} from "react";
import InteractiveChart from "./InteractiveChatrtV2.js";
import "./InteractiveChartV2.css";

const ResponsiveChart = (props) => {
  const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75])

  return(
    <div className="main-container">
     <InteractiveChart data={data}/> 
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

    </div>
  )
}

export default ResponsiveChart
