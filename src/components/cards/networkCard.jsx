import React from 'react';
import Card from './card.jsx';
import Chart from './chart.jsx';
import { timeFormatting } from '../../js/utils.js';

const NetworkCard = (props) => {
  const detail = {
    type: {
      title: "Type",
      unit: "",
    },
    upSpeed: {
      title: "Speed(Up)",
      unit: "B/s",
      color: props.theme.foregroundGreen,
    },
    downSpeed: {
      title: "Speed(Down)",
      unit: "B/s",
      color: props.theme.foregroundBlue,
    },
  };
  let newData = props.data.map(obj => ({
    timestamp: timeFormatting(obj.time),
    type: obj.network_type,
    upSpeed: obj.network_upload_speed, //可用
    downSpeed: obj.network_download_speed,
  }));
  let chartData = newData.map(({ type, ...rest }) => rest)
  return (
    <Card
      color="network"
      title="Network"
      theme={props.theme}
      width={4}
      data={newData}
      details={detail}
      iconBoxColor={props.theme.backgroundYellow}
      chart={<>
        <Chart theme={props.theme} detail={detail} data={chartData} />
      </>}
      processorChartAmount={true}
      chartNumber={2}
      icon={<svg aria-hidden="true" focusable="false" height="2em" fill={props.theme.svgBackgroundColor} data-prefix="fas" data-icon="network-wired" class="svg-inline--fa fa-network-wired fa-2x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M256 64H384v64H256V64zM240 0c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h48v32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96v32H80c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48H240c26.5 0 48-21.5 48-48V368c0-26.5-21.5-48-48-48H192V288H448v32H400c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48H560c26.5 0 48-21.5 48-48V368c0-26.5-21.5-48-48-48H512V288h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V192h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H240zM96 448V384H224v64H96zm320-64H544v64H416V384z"></path></svg>}
    />
  )
}

export default NetworkCard;