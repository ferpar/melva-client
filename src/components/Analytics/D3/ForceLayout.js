import React from "react";
import * as d3 from "d3";

import data from "./FLdata.js"

class ForceLayout extends React.Component {
  mountPoint = React.createRef();
  componentDidMount() {
    const { width, height } = this.props;


  }
  render(){
    const {width, height} = this.props;
    const style = {
      width,
      height,
      border: "1px solid black"
    }

    return <div style={style} ref={this.mountPoint} />
  }
}

export default ForceLayout
