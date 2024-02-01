import React, { useRef } from 'react';
import Paper from '@mui/material/Paper';
import "./graph.css"
// import { bgcolor } from '@mui/system';


const Graph = (props) => {
  const chartBoxRef = useRef();
  const { theme, children, processorChartAmount } = props

  return (
    <>
      {!processorChartAmount ?
        <Paper
          className="chartBox"
          // variant="outlined"
          ref={chartBoxRef}
          elevation={10}
          sx={{
            position: "relative",
            flex: "1 1 auto",
            minWidth: "150px",
            minHeight: "150px",
            borderRadius: "20px",
            right: "-20px",
            bottom: "-15px",
            margin: "0 10px",
          }}
        // style={{
        //   backgroundColor: theme.chartBackgroundColor,
        //   border: theme.cardBorder,
        // }}
        >
          {children}
        </Paper> :
        <div className='chart'
          style={{
            backgroundColor: theme.chartBackgroundColor,
            border: theme.cardBorder,
          }}>
          {children}
        </div>
      }
    </>
  )


}

export default Graph;
