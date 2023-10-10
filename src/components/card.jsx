import React, { Component, createRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { round } from '../js/utils';

import "./card.css";

const MAX_DATA_POINT = 20;

class Card extends Component {
  constructor(props) {
    super(props);
    this.chartBoxRef = createRef();

    this.state = {
      chartSize: { width: 100, height: 100 },
      chartDatas: [],
      timestamp: null,
      cardMinWidth: 500
    }
  }

  componentDidMount() {
    this.updateChartSize(); // 组件挂载后更新图表尺寸
    // this.chartDimensionsInterval = setInterval(this.updateChartSize, 1000);
    window.addEventListener('resize', this.updateChartSize); // 监听窗口大小变化
  }

  componentDidUpdate() {
    if (this.state.timestamp !== this.props.data.timestamp) {
      // console.log(this.props.timestamp, this.props.data);
      let data = { timestamp: this.props.data.timestamp };
      Object.keys(this.props.data).map((key, index) => {
        data[key] = this.props.data[key];
      });
      let chartDatas = [...this.state.chartDatas, data].slice(-MAX_DATA_POINT); // 仅保留最近的20个数据点
      // console.log(chartDatas);
      this.setState({
        timestamp: this.props.data.timestamp,
        chartDatas: chartDatas,
      })
    }
  }

  updateChartSize = () => {
    let renderLineChart = null
    const chartBox = this.chartBoxRef.current; // 获取chartBox元素
    if (chartBox) {
      const size = { width: chartBox.offsetWidth, height: chartBox.offsetHeight }
      this.setState({ chartSize: size });
    }
  };
  render() {
    const { iconBoxColor, icon, theme, width, details, title, data, detailShow } = this.props;
    return (
      <>
        {
          detailShow ?
            // <ResponsiveContainer width="100%" height="100%">
            // <ResponsiveContainer width={this.props.minimalChartSize.width} height="100%">
            <ResponsiveContainer width={500} height="100%">
              <LineChart width={600} height={300} data={this.state.chartDatas}>
                <Tooltip contentStyle={{
                  backgroundColor: theme.cardBackgroundColor,
                  borderRadius: "1vh",
                  border: 0
                }} />
                <XAxis dataKey="timestamp" hide={true} />
                {Object.keys(details).map((key, index) => {
                  if (details[key].chart) {
                    return (<Line
                      type="monotone"
                      dataKey={key}
                      key={index}
                      stroke={details[key].color}
                      name={details[key].title}
                      strokeWidth={3}
                      isAnimationActive={false}
                      connectNulls={true}
                      animationEasing="linear"
                      dot={false}
                    />)
                  }
                })}
              </LineChart>
            </ResponsiveContainer>
            :
            <div className="card" style={{
              backgroundColor: theme.cardBackgroundColor,
              border: theme.cardBorder,
              flexGrow: width,
            }}>
              <div className="box">
                <div className="icon" style={{ backgroundColor: iconBoxColor }}>{icon}</div>
                <div className="children">
                  {this.props.children}
                </div>
                <div className="detailBox">
                  <div className="pictureBox">
                    <div className="mainTitle">
                      <p>{title}</p>
                    </div>
                    <div className="details">
                      {Object.keys(details).map((key) => {
                        let _data = data[key];
                        _data = round(_data, 2);
                        return (<div key={key}>
                          <div className="detailLineDot" style={{
                            backgroundColor: details[key].color
                          }}></div>
                          <p className="title">{details[key].title}</p>
                          <p className="digital">{_data}{details[key].unit}</p>
                        </div>)
                      })}
                    </div>
                  </div>
                  <div className="chartBox" ref={this.chartBoxRef}
                    style={{
                      backgroundColor: theme.chartBackgroundColor,
                      border: theme.cardBorder,
                    }}
                  >
                    <ResponsiveContainer width={this.state.chartSize.width} height="100%">
                      <LineChart width={600} height={300} data={this.state.chartDatas}>
                        <Tooltip contentStyle={{
                          backgroundColor: theme.cardBackgroundColor,
                          borderRadius: "1vh",
                          border: 0
                        }} />
                        <XAxis dataKey="timestamp" hide={true} />
                        {Object.keys(details).map((key, index) => {
                          let min = details[key].min;
                          let max = details[key].max;
                          // console.log(key, min);
                          if (min !== undefined) {
                            return (<YAxis
                              domain={[min, max]}
                              key={index}
                              hide={true}/>)
                          }
                        })}
                        {Object.keys(details).map((key, index) => {
                          if (details[key].chart) {
                            return (<Line
                              type="monotone"
                              dataKey={key}
                              key={index}
                              stroke={details[key].color}
                              name={details[key].title}
                              strokeWidth={3}
                              isAnimationActive={false}
                              connectNulls={true}
                              animationEasing="linear"
                              dot={false}
                            />)
                          }
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
        }
      </>
    )
  }
}

export default Card;
