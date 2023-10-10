import React, { Component } from "react"
import { Slider, Switch, ConfigProvider } from 'antd';
import './fanControl.css'
import { firstUpperCase } from '../js/utils';
class FanControl extends Component {

  getMode = (index) => {
    let mode = this.props.modes[index];
    return firstUpperCase(mode);
  }

  render() {
    let marks = {}
    this.props.modes.map((mark, index) => {
      marks[index] = " ";
    })
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: this.props.theme.foregroundGreen,
            colorPrimaryBorder: this.props.theme.backgroundGreen,
            colorPrimaryBorderHover: this.props.theme.backgroundGreen,
          }
        }}>
        <div className="fanBut">
          <div className="fanSwitch">
            <Switch checked={this.props.state} onChange={this.props.onStateChange} />
          </div>
          <div className="slider">
            <Slider
              min={0}
              max={this.props.modes.length - 1}
              onChange={this.props.onModeChange}
              value={this.props.value}
              open={false}
              included={false}
              railStyle={{ backgroundColor: this.props.theme.sliderBackgroundColor }}
              // trackStyle={{ backgroundColor: this.props.theme.sliderBackgroundColor }}
              tooltip={{ formatter: this.getMode}}
              disabled={!this.props.state}
              marks={marks}
            />
          </div>
        </div>
      </ConfigProvider >
    );
  }
}

export default FanControl;