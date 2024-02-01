import React, { useState } from 'react';
import Graph from './graph.jsx';
import { formatBytes } from '../js/utils';
import { Paper, Box, Typography } from '@mui/material';
import "./barChart.css"


const BarChart = (props) => {
  const { theme, processorChartAmount } = props;
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (index, event) => {
    setHoveredIndex(index);
    setHoveredPosition({ x: event.clientX + 20, y: event.clientY + 20 });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  return (
    <Graph theme={theme} processorChartAmount={processorChartAmount}>
      <div
        className='barChartBox'
        onMouseMove={(event) => {
          if (hoveredIndex !== null) {
            setHoveredPosition({ x: event.clientX + 20, y: event.clientY + 20 });
          }
        }}
        onMouseLeave={() => {
          setHoveredIndex(null);
        }}
      >
        <div className='barChart'>
          {props.data.map((item, index) => (
            <div
              key={index}
              className={`barData ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={(event) => handleMouseEnter(index, event)}
              onMouseLeave={handleMouseLeave}
            >
              <Box className='barUsed' sx={{ width: `${item.percent}%`, bgcolor: `${props.color}.main` }}></Box>
              {/* 中间空隙占2% */}
              <Box className='barFree' sx={{ width: `${100 - item.percent - 2}%` }}></Box>
            </div>
          ))}
        </div>
        {hoveredIndex !== null && (
          <Paper className='barChartTip'
            color={props.color}
            sx={{ top: hoveredPosition.y, left: hoveredPosition.x, boxShadow: "none" }}
          >
            <div className='barChartTipText'>
              <Typography
                sx={{ margin: "0px 0px 5px 0" }}
              >
                {props.data[hoveredIndex].time}
              </Typography>
              {/* <span>{props.data[hoveredIndex].percent} % Used</span> */}
              <Typography
                color={`${props.color}.main`}
                sx={{ margin: "0px 0px 5px 0" }}
              >
                {props.data[hoveredIndex].type} : {formatBytes(props.data[hoveredIndex].used)}B / {formatBytes(props.data[hoveredIndex].total)}B
              </Typography>

            </div>
          </Paper>
        )}
      </div >
    </Graph >
  );
}

export default BarChart;