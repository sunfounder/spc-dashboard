import React, { Component, createRef } from 'react';
import ToggleSwitch from './toggleSwitch.jsx';
import Card from './card.jsx';

import "./minimal.css";

const ip = window.location.hostname;
const HOST = `http://${ip}:34001/api/v1.0/`;
// const HOST = `http://192.168.18.17:34001/api/v1.0/`;

class Minimal extends Component {
  constructor(props) {
    super(props);
    this.updateInterval = null;
    this.minimalChartBoxRef = createRef();
    this.state = {
      details: {
        usb: {
          voltage: {
            title: "Voltage",
            unit: "V",
            chart: true,
            color: props.theme.foregroundGreen,
          },
          isPluggedIn: {
            title: "Is Pluged in",
            unit: "",
            chart: false,
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
        // rpi: {
        // },
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
          isPluggedIn: "否",
          voltage: "20",
        },
        fan: {
          timestamp: null,
          speed: 10,
        },
        // rpi: {
        //   timestamp: null,
        //   cpu_usage: 0,
        //   cpu_temperature: 0,
        // },
        battery: {
          timestamp: null,
          voltage: 0,
          current: 0,
          isCharging: null,
          percentage: 0,
        },
        output: {
          timestamp: null,
          voltage: 0,
          current: 0,
        },
      },
      themeSwitchChecked: false,
      chartSize: { width: 100, height: 100 },
    }
  }
  componentDidMount() {
    this.updateChartSize(); // 组件挂载后更新图表尺寸
    // window.addEventListener('resize', this.updateChartSize); // 监听窗口大小变化
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    // this.updateInterval = setInterval(this.updateDate, 1000);
    let isDark = window.localStorage.getItem("isDark") || "true";
    isDark = isDark === "true";
    this.themeSwitching(isDark);

  }
  updateChartSize = () => {
    // let renderLineChart = null
    let dom = document.getElementsByClassName("minimalData").clientWidth
    console.log(dom)
    // const chartBox = this.minimalChartBoxRef.current; // 获取chartBox元素
    // if (chartBox) {
    //   const size = { width: chartBox.offsetWidth, height: chartBox.offsetHeight }
    //   this.setState({ chartSize: size });
    // }
  };
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
        isPluggedIn: data.is_usb_plugged_in ? "Plugged in" : "Unplugged",
        voltage: data.usb_voltage / 1000,
      },
      fan: {
        timestamp: timestamp,
        state: data.fan_state ? "ON" : "OFF",
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
        isCharging: data.is_charging ? "Charging" : "Not charging",
        voltage: data.battery_voltage / 1000,
        current: data.battery_current / 1000,
        power: data.battery_voltage / 1000 * data.battery_current / 1000,
      },
      output: {
        timestamp: timestamp,
        voltage: data.output_voltage / 1000,
        current: data.output_current / 1000,
        power: data.output_voltage / 1000 * data.output_current / 1000,
      },
    };
    this.setState({
      datas: newDatas,
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
  render() {
    const { theme } = this.props;
    const { details, datas } = this.state;
    return (
      <div className="minimal" style={{
        backgroundColor: this.props.theme.homeBackgroundColor,
        color: this.props.theme.primary
      }}>
        <div className="minimaltTitleBar">
          <div className="homeTitle" style={{ paddingLeft: "20px" }}>
            UPS Case
          </div>
          <div className="themeSwitch" style={{ paddingRight: "20px" }}>
            <span>Dark mode:</span>
            <ToggleSwitch state={this.state.themeSwitchChecked} onChange={this.themeSwitching} />
          </div>
        </div>
        <div className='minimalCard'>
          <div className='minimalChart' >
            {Object.keys(details).map((category) => (
              // ref={this.minimalChartBoxRef}
              <div className="minimalData" key={category} style={{
                backgroundColor: theme.chartBackgroundColor,
                border: theme.cardBorder,
              }}>
                <Card
                  detailShow={true}
                  theme={this.props.theme}
                  details={details[category]}
                  data={datas[category]}
                  minimalChartSize={this.state.chartSize}
                />
              </div>
            ))}
          </div>
          {/* <div className="minimalCard">
            {Object.keys(details).map((category) => (
              <div className="minimalChart" key={category}>
                <div className="minimalData" style={{
                  backgroundColor: theme.chartBackgroundColor,
                  border: theme.cardBorder,
                }}>
                  <Card
                    detailShow={true}
                    theme={this.props.theme}
                    details={details[category]}
                    datas={datas[category]}
                  />
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div >
    )
  }
}

export default Minimal;