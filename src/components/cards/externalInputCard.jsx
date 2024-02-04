import React from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import { timeFormatting } from '../../js/utils.js';

const ExternalInputCard = (props) => {
  const detail = {
    isPluggedIn: {
      title: "Status",
      unit: "",
    },
    voltage: {
      title: "Voltage",
      unit: "V",
      color: props.theme.foregroundGreen,
    },
    current: {
      title: "Current",
      unit: "A",
      color: props.theme.foregroundBlue,
    },
    power: {
      title: "Power",
      unit: "W",
      color: props.theme.foregroundYellow,
    }
  };
  let newData = props.data.map(obj => ({
    timestamp: timeFormatting(obj.time),
    isPluggedIn: obj.is_plugged_in ? "Plugged in" : "Unplugged",
    voltage: obj.external_input_voltage / 1000,
    current: obj.external_input_current / 1000,
    power: obj.external_input_voltage / 1000 * obj.external_input_current / 1000,
  }))
  let chartData = newData.map(({ isPluggedIn, ...rest }) => rest)
  return (
    <Card
      title="External"
      theme={props.theme}
      color="externalInput"
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={props.theme.backgroundBlue}
      chart={<Chart theme={props.theme} detail={detail} data={chartData} />}
      icon={<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 384 512" fill={props.theme.svgBackgroundColor}><path d="M96 0C78.3 0 64 14.3 64 32v96h64V32c0-17.7-14.3-32-32-32zM288 0c-17.7 0-32 14.3-32 32v96h64V32c0-17.7-14.3-32-32-32zM32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32v32c0 77.4 55 142 128 156.8V480c0 17.7 14.3 32 32 32s32-14.3 32-32V412.8C297 398 352 333.4 352 256V224c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z" /></svg>
      }
    >
    </Card>
  )
}

export default ExternalInputCard;