import React from "react"
// import React, { useState } from "react"
// import { Switch, ConfigProvider } from 'antd';
import { Box, Slider, Switch } from '@mui/material';
import './fanControl.css'
import { firstUpperCase } from '../js/utils';
const FanControl = (props) => {
  const modes = props.modes.map((mode, index) => {
    return {
      value: index,
      label: firstUpperCase(mode),
    }
  })

  const getMode = (index) => {
    return modes[index].label;
  }

  const onModeChange = (e) => {
    props.onModeChange(e.target.value)
  }
  const setFanOpe = (e) => {
    props.onStateChange(e.target.checked);
  }

  return (
    <div className="fanBut">
      <div className="fanSwitch">
        {/* <Switch checked={this.props.state} onChange={this.props.onStateChange} /> */}
        <Switch checked={props.state} onChange={setFanOpe} color={props.color} />
      </div>
      {/* <div className="slider"> */}
      {/* <Slider
              min={0}
              max={this.props.modes.length - 1}
              value={this.props.value}
              open={false}
              included={false}
              railStyle={{ backgroundColor: this.props.theme.sliderBackgroundColor }}
              // trackStyle={{ backgroundColor: this.props.theme.sliderBackgroundColor }}
              tooltip={{ formatter: this.getMode}}
              disabled={!this.props.state}
              marks={marks}
            /> */}
      <Box sx={{ width: 180, display: "flex" }}>
        <Slider
          // aria-label="Temperature"
          color={props.color}
          onChange={onModeChange}
          // width={100}
          defaultValue={props.value}
          // getAriaValueText={valuetext}
          valueLabelFormat={getMode}
          valueLabelDisplay="auto"
          step={1}
          // marks={modes}
          min={0}
          max={3}
        />
      </Box>
    </div>
    // </div>
  );
}

export default FanControl;