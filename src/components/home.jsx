import React, { Component } from 'react';
import Card from './card.jsx';
import ToggleSwitch from './toggleSwitch.jsx';
import FanControl from './fanControl.jsx';
import { firstUpperCase } from '../js/utils';

import "./home.css";

const ip = window.location.hostname;
const HOST = `http://${ip}:34001/api/v1.0/`;
// const HOST = `http://192.168.18.17:34001/api/v1.0/`;
const BOARDS = [
  "UPS Case",
  "Pironman",
]

class Home extends Component {
  constructor(props) {
    super(props);
    this.updateInterval = null;
    this.state = {
      details: {
        usb: {
          isPluggedIn: {
            title: "Status",
            unit: "",
            chart: false,
          },
          voltage: {
            title: "Voltage",
            unit: "V",
            color: props.theme.foregroundGreen,
            chart: true,
          },
          current: {
            title: "Current",
            unit: "A",
            color: props.theme.foregroundBlue,
            chart: true,
          },
          power: {
            title: "Power",
            unit: "W",
            color: props.theme.foregroundYellow,
            chart: true,
          }
        },
        fan: {
          state: {
            title: "State",
            unit: "",
            chart: false,
          },
          mode: {
            title: "Mode",
            unit: "",
            chart: false,
          },
          speed: {
            title: "Percentage",
            unit: "%",
            chart: false,
          },
          cpu_temperature: {
            title: "Temperature",
            unit: "℃",
            color: props.theme.foregroundRed,
            chart: true,
            min: 0,
            max: 100,
          },
        },
        rpi: {
        },
        battery: {
          percentage: {
            title: "Percentage",
            unit: "%",
            chart: false,
          },
          isCharging: {
            title: "Charging",
            unit: "",
            chart: false,
          },
          voltage: {
            title: "Voltage",
            unit: "V",
            color: props.theme.foregroundGreen,
            chart: true,
          },
          current: {
            title: "Current",
            unit: "A",
            color: props.theme.foregroundBlue,
            chart: true,
          },
          power: {
            title: "Power",
            unit: "W",
            color: props.theme.foregroundYellow,
            chart: true,
          }
        },
        output: {
          source: {
            title: "Output Source",
            unit: "",
            chart: false,
          },
          voltage: {
            title: "Voltage",
            unit: "V",
            color: props.theme.foregroundGreen,
            chart: true,
          },
          current: {
            title: "Current",
            unit: "A",
            color: props.theme.foregroundBlue,
            chart: true,
          },
          power: {
            title: "Power",
            unit: "W",
            color: props.theme.foregroundYellow,
            chart: true,
          }
        }
      },
      datas: {
        usb: {
          timestamp: null,
          isPluggedIn: "Unplugged",
          voltage: -1,
          current: -1,
        },
        fan: {
          timestamp: null,
          state: null,
          mode: null,
          speed: -1,
          cpu_temperature: -1,
        },
        rpi: {
          timestamp: null,
          cpu_usage: 0,
          cpu_temperature: 0,
        },
        battery: {
          timestamp: null,
          voltage: -1,
          current: -1,
          isCharging: null,
          percentage: -1,
        },
        output: {
          timestamp: null,
          voltage: -1,
          current: -1,
        },
      },
      themeSwitchChecked: false,
      fanMode: "Auto",
      fanState: false,
      fanModeIndex: 3,
      boardName: ''
    }
    this.fanModes = [
      'quiet',
      'normal',
      'performance',
      'auto',
    ];
  }
  componentDidMount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(this.updateDate, 1000);
    let isDark = window.localStorage.getItem("isDark") || "true";
    isDark = isDark === "true";
    this.themeSwitching(isDark);

  }
  updateDate = async () => {
    // console.log("updateDate")
    let respond = await fetch(HOST + "get-all");
    let data = await respond.json();
    data = data.data;
    let timestamp = new Date();
    timestamp = timestamp.toUTCString();
    let newDatas = {
      usb: {
        timestamp: timestamp,
        isPluggedIn: data.is_usb_plugged_in  ? "Plugged in" : "Unplugged",
        voltage: data.usb_voltage / 1000,
        current: data.usb_current / 1000,
        power: data.usb_voltage / 1000 * data.usb_current / 1000,
      },
      fan: {
        timestamp: timestamp,
        state: data.fan_state  ? "ON" : "OFF",
        mode: firstUpperCase(data.fan_mode),
        speed: data.fan_speed,
        cpu_temperature: data.cpu_temperature,
      },
      rpi: {
        timestamp: timestamp,
        // cpu_usage: data.,
        // cpu_temperature: data.,
      },
      battery: {
        timestamp: timestamp,
        percentage: data.battery_percentage,
        isCharging: data.is_charging  ? "Charging" : "Not charging",
        voltage: data.battery_voltage / 1000,
        current: data.battery_current / 1000,
        power: data.battery_voltage / 1000 * data.battery_current / 1000,
      },
      output: {
        timestamp: timestamp,
        source: data.power_source,
        voltage: data.output_voltage / 1000,
        current: data.output_current / 1000,
        power: data.output_voltage / 1000 * data.output_current / 1000,
      },
    };
    this.setState({
      datas: newDatas,
      fanMode: firstUpperCase(data.fan_mode),
      fanState: data.fan_state,
      fanModeIndex: this.fanModes.indexOf(data.fan_mode),
      boardName: BOARDS[data.board_id],
    })
  }
  themeSwitching = (checked) => {
    if (checked) {
      this.props.onModeChange("dark");
    } else {
      this.props.onModeChange("light");
    }
    this.setState({
      themeSwitchChecked: checked,
    })
    window.localStorage.setItem("isDark", checked);
  };

  sendData = async (path, data) => {
    let payload = { data: data }
    await fetch(HOST + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }
  setFanMode = async (mode) => {
    await this.sendData("set-fan-mode", mode);
  }
  setFanState = async (state) => {
    await this.sendData("set-fan-state", state);
  }
  onFanModeChange = (index) => {
    let mode = this.fanModes[index];
    this.setFanMode(mode);
    this.setState({
      fanModeIndex: index,
      fanMode: firstUpperCase(mode),
    });
  }
  onFanStateChange = (checked) => {
    this.setFanState(checked);
    this.setState({ fanState: checked });
  };
  render() {
    return (
      <div className="home" style={{
        backgroundColor: this.props.theme.homeBackgroundColor,
        color: this.props.theme.primary
      }}>
        <div className="titleBar">
          <div className="homeTitle" >
            {this.state.boardName}
          </div>
          <div className="themeSwitch">
            <span>Dark mode</span>
            <ToggleSwitch state={this.state.themeSwitchChecked} onChange={this.themeSwitching} />
          </div>
        </div>
        <div className="cardBox">
          <Card
            title="USB"
            theme={this.props.theme}
            width={4}
            data={this.state.datas.usb}
            details={this.state.details.usb}
            iconBoxColor={this.props.theme.backgroundBlue}
            icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 640 512" fill={this.props.theme.svgBackgroundColor} ><path d="M641.5 256c0 3.1-1.7 6.1-4.5 7.5L547.9 317c-1.4.8-2.8 1.4-4.5 1.4-1.4 0-3.1-.3-4.5-1.1-2.8-1.7-4.5-4.5-4.5-7.8v-35.6H295.7c25.3 39.6 40.5 106.9 69.6 106.9H392V354c0-5 3.9-8.9 8.9-8.9H490c5 0 8.9 3.9 8.9 8.9v89.1c0 5-3.9 8.9-8.9 8.9h-89.1c-5 0-8.9-3.9-8.9-8.9v-26.7h-26.7c-75.4 0-81.1-142.5-124.7-142.5H140.3c-8.1 30.6-35.9 53.5-69 53.5C32 327.3 0 295.3 0 256s32-71.3 71.3-71.3c33.1 0 61 22.8 69 53.5 39.1 0 43.9 9.5 74.6-60.4C255 88.7 273 95.7 323.8 95.7c7.5-20.9 27-35.6 50.4-35.6 29.5 0 53.5 23.9 53.5 53.5s-23.9 53.5-53.5 53.5c-23.4 0-42.9-14.8-50.4-35.6H294c-29.1 0-44.3 67.4-69.6 106.9h310.1v-35.6c0-3.3 1.7-6.1 4.5-7.8 2.8-1.7 6.4-1.4 8.9.3l89.1 53.5c2.8 1.1 4.5 4.1 4.5 7.2z" /></svg>}
          />
          <Card
            title="Fan"
            theme={this.props.theme}
            width={4}
            data={this.state.datas.fan}
            details={this.state.details.fan}
            iconBoxColor={this.props.theme.backgroundGreen}
            icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill={this.props.theme.svgBackgroundColor}><path d="M258.6 0c-1.7 0-3.4 .1-5.1 .5C168 17 115.6 102.3 130.5 189.3c2.9 17 8.4 32.9 15.9 47.4L32 224H29.4C13.2 224 0 237.2 0 253.4c0 1.7 .1 3.4 .5 5.1C17 344 102.3 396.4 189.3 381.5c17-2.9 32.9-8.4 47.4-15.9L224 480v2.6c0 16.2 13.2 29.4 29.4 29.4c1.7 0 3.4-.1 5.1-.5C344 495 396.4 409.7 381.5 322.7c-2.9-17-8.4-32.9-15.9-47.4L480 288h2.6c16.2 0 29.4-13.2 29.4-29.4c0-1.7-.1-3.4-.5-5.1C495 168 409.7 115.6 322.7 130.5c-17 2.9-32.9 8.4-47.4 15.9L288 32V29.4C288 13.2 274.8 0 258.6 0zM256 224a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg>}
          >
            <FanControl
              theme={this.props.theme}
              state={this.state.fanState}
              value={this.state.fanModeIndex}
              onModeChange={this.onFanModeChange}
              onStateChange={this.onFanStateChange}
              modes={this.fanModes}
            />
          </Card>
          {/* <Card
            title="Raspberry Pi"
            theme={this.props.theme}
            width={4}
            data={this.state.datas.rpi}
            details={this.state.details.rpi}
            iconBoxColor={this.props.theme.backgroundRed}
            icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill={this.props.theme.svgBackgroundColor}><path d="M176 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64c-35.3 0-64 28.7-64 64H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v56H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v56H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64c0 35.3 28.7 64 64 64v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h56v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h56v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448c35.3 0 64-28.7 64-64h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V280h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V176h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448c0-35.3-28.7-64-64-64V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H280V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H176V24zM160 128H352c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32zm192 32H160V352H352V160z" /></svg>}
          /> */}

          <Card
            title="Battery"
            theme={this.props.theme}
            width={4}
            data={this.state.datas.battery}
            details={this.state.details.battery}
            iconBoxColor={this.props.theme.backgroundPurple}
            icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512" fill={this.props.theme.svgBackgroundColor}><path d="M464 160c8.8 0 16 7.2 16 16V336c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16H464zM80 96C35.8 96 0 131.8 0 176V336c0 44.2 35.8 80 80 80H464c44.2 0 80-35.8 80-80V320c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32V176c0-44.2-35.8-80-80-80H80zm272 96H96V320H352V192z" /></svg>}
          />

          <Card
            title="Output"
            theme={this.props.theme}
            width={4}
            data={this.state.datas.output}
            details={this.state.details.output}
            iconBoxColor={this.props.theme.backgroundYellow}
            icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512" fill={this.props.theme.svgBackgroundColor}><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>}
          />
        </div>
      </div >
    )
  }
}

export default Home;