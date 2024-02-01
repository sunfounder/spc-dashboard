import React, { Component, createRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatBytes, round } from '../js/utils';

import "./card.css";

const MAX_DATA_POINT = 20;
const COLORS = ['#0088FE', '#00C49F'];
const datass = [
  { name: 'Group A', value: 40 },
  { name: 'Group B', value: 60 },
];
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
        return undefined;
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
    // let renderLineChart = null
    const chartBox = this.chartBoxRef.current; // 获取chartBox元素
    if (chartBox) {
      const size = { width: chartBox.offsetWidth, height: chartBox.offsetHeight }
      this.setState({ chartSize: size });
    }
  };

  getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
    const toPercent = (decimal, fixed = 0) => `${(decimal * 100).toFixed(fixed)}%`;
    return toPercent(ratio, 2);
  };

  renderTooltipContent = (o) => {
    // console.log(o)
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0);
    return (
      <div className="customized-tooltip-content">
        <p className="total">{`${label} (Total: ${total})`}</p>
        <ul className="list">
          {payload.map((entry, index) => (
            <li key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}(${this.getPercent(entry.value, total)})`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  bytesFormatter = (value, name, props) => {
    console.log(value, name, props);
    let unit = props.unit;
    if (unit === "B" || unit === "B/s") {
      value = formatBytes(value);
    } else {
      console.log(value)
      if (Array.isArray(value)) return;
      value = value.toFixed(2);
      value += " "
    }
    return value;
  }
  render() {
    const { iconBoxColor, icon, theme, width, details, title, data } = this.props;
    return (
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
                  if (!Object.keys(data).includes(key)) {
                    console.log("key not found: ", title, key);
                    return null;
                  }
                  let _data = data[key];
                  _data = round(_data, 2);
                  let unit = details[key].unit;
                  if (unit === "B" || unit === "B/s") {
                    _data = formatBytes(_data);
                    _data += details[key].unit;
                  } else {
                    _data += " " + details[key].unit;
                  }
                  return (<div key={key}>
                    <div className="detailLineDot" style={{
                      backgroundColor: details[key].color
                    }}></div>
                    <p className="title">{details[key].title}</p>
                    <p className="digital">{_data}</p>
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
              {
                this.props.pieChart ?
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        data={datass}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        fill="#8884d8"
                        dataKey="value"
                        innerRadius={40}
                        outerRadius={90}
                      >
                        {datass.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={this.renderTooltipContent} />
                    </PieChart>
                  </ResponsiveContainer>
                  :
                  <ResponsiveContainer width={this.state.chartSize.width} height="100%">
                    <LineChart width={600} height={300} data={this.state.chartDatas}>
                      <Tooltip contentStyle={{
                        backgroundColor: theme.cardBackgroundColor,
                        borderRadius: "1vh",
                        border: 0
                      }}
                        formatter={this.bytesFormatter}
                      />
                      <XAxis dataKey="timestamp" hide={true} />
                      {Object.keys(details).map((key, index) => {
                        let min = details[key].min;
                        let max = details[key].max;
                        // console.log(key, min);
                        if (min !== undefined) {
                          return (<YAxis
                            domain={[min, max]}
                            key={index}
                            hide={true} />)
                        }
                        return undefined;
                      })}
                      {Object.keys(details).map((key, index) => {
                        if (details[key].chart) {
                          return (<Line
                            type="monotone"
                            dataKey={key}
                            key={index}
                            stroke={details[key].color}
                            name={details[key].title}
                            unit={details[key].unit}
                            strokeWidth={3}
                            isAnimationActive={false}
                            connectNulls={true}
                            animationEasing="linear"
                            dot={false}
                          />)
                        }
                        return undefined;
                      })}
                    </LineChart>
                  </ResponsiveContainer>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Card;
