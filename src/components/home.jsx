import React, { useState, useEffect } from 'react';
import SettingPage from './settingPage.jsx';
import Snackbars from './snackbar.jsx';
import { formatBytes } from '../js/utils';
// import { Switch } from '@mui/material'
// import Chart from './chart.jsx';
// import BarChart from './barChart.jsx';
// import { Box } from '@mui/material';
import "./home.css";

import ExternalInput from './externalInput.jsx';
import FanCard from './fanCard.jsx';
import BatteryCard from './batteryCard.jsx';
import RaspberryPiPower from './raspberryPiPower.jsx';
import StorageCard from './storageCard.jsx';
import MemoryCard from './memoryCard.jsx';
import ProcessorCard from './processorCard.jsx';
import NetworkCard from './networkCard.jsx';
const ip = window.location.hostname;
// const HOST = `http://${ip}:34001/api/v1.0/`;
// const HOST = `http://192.168.137.6:34001/api/v1.0/`;
const HOST = `http://192.168.100.222:34001/api/v1.0/`;
// const HOST = `http://homeassistant.local:34001/api/v1.0/`;

const PRODUCT = [
  {
    'name': 'Pironman U1',
    'id': 'pironman_u1',
    "address": 0x00,
    "peripherals": [
      'battery',
      'usb_in',
      'output',
      'fan',
      'power_source_sensor',
      'ir',
    ],
  },
  {
    'name': 'Pironman 4',
    'id': 'pironman_4',
    "address": 0x01,
    "peripherals": [
      'usb_in',
      'fan',
      'oled',
      'ws2812', // RGB
      'ir',
    ],
  }
]

const defaultConfigData = {
  "auto": {
    "reflash_interval": 1, //刷新间隔
    "retry_interval": 3, //刷新
    "fan_mode": "auto",
    "fan_state": true,
    "fan_speed": 65,
    "temperature_unit": "C",
    "rgb_switch": true,
    "rgb_style": 'breath',  // 'breath', 'leap', 'flow', 'raise_up', 'colorful'
    "rgb_color": "#0a1aff",
    "rgb_speed": 50, //速度
    "rgb_pwm_frequency": 1000, //频率
    "rgb_pin": 10,  // 10,12,21
    "shutdown_battery_pct": 100
  },
  "mqtt": {
    "host": "core-mosquitto",
    "port": 1883,
    "username": "mqtt",
    "password": "mqtt"
  },
  "dashboard": {
    "ssl": false,
    "ssl_ca_cert": "",
    "ssl_cert": ""
  },
}

const Home = (props) => {
  const [datas, setDatas] = useState([]);
  const [themeSwitchChecked, setThemeSwitchChecked] = useState(false);
  // const [fanMode, setFanMode] = useState("Auto");
  const [boardName, setBoardName] = useState('');
  const [connectionState, setConnectionState] = useState(true);
  //设置页面的显示状态
  const [settingPageDisplay, setSettingPageDisplay] = useState(false);
  const [peripherals, setPeripherals] = useState([])
  const [configData, setConfigData] = useState(defaultConfigData);
  const [updateDataInterval, setUpdateDataInterval] = useState(1000);
  //全局提示框显示内容
  const [snackbarText, setSnackbarText] = useState("设置成功 ！");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  //全局提示框显示状态
  const [snackbarShow, setSnackbarShow] = useState(false);
  //对话框的显示状态
  // const [basicDialogShow, setBasicDialogShow] = useState(false); 
  //是否加载状态
  // const [loading, setLoading] = useState(false);  
  //对话框显示内容
  // const [basicDialogText, setBasicDialogText] = useState("修改成功");  
  useEffect(() => {
    // 发送请求
    getConfig();
  }, []);

  const handleSettingPage = () => {
    setSettingPageDisplay(!settingPageDisplay);
  }

  const showSnackBar = (severity, text) => {
    setSnackbarText(text);
    setSnackbarSeverity(severity);
    setSnackbarShow(true);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarShow(false);
    setSnackbarText("");
  }

  const handleCancel = () => {
    setSettingPageDisplay(false);
  }

  const handleSaveConfig = async () => {
    // setBasicDialogShow(true);
    console.log("set-config-data", configData);
    // 判断是否发送设置数据
    let responseData = await sendData("set-config", configData);
    console.log(responseData)
    if (responseData.status) {
      showSnackBar("success", "Save Successfully");
      setSettingPageDisplay(false);
    }
  }

  // 发送请求
  useEffect(() => {
    // updateDate();
    const interval = setInterval(() => {
      if (connectionState) updateDate();
    }, updateDataInterval);
    return () => clearInterval(interval);
  }, []);

  // const sendData = async (path, data) => {
  //   let payload = { data: data }
  //   await fetch(HOST + path, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });
  // }

  const sendData = async (path, data) => {
    let payload = { data: data };
    console.log("sendData", payload)
    try {
      const response = await fetch(HOST + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 确保请求成功
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("服务器返回的结果：", responseData);

      return responseData;
    } catch (error) {
      console.error("发生错误：", error);
    }
  }


  const getRequest = async (url, payload) => {
    try {
      if (payload !== undefined) {
        // Convert object to url param string
        const params = new URLSearchParams(payload);
        url += `?${params}`;
      }
      url = HOST + url;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Request failed with status ${response.status}`);
        showSnackBar("error", `Request Error: ${response.status}`);
        setConnectionState(false);
        return false;
      }
      const result = await response.json();
      const status = result.status;
      if (status) {
        const data = result.data;
        setConnectionState(true);
        return data;
      } else {
        console.error(`Error: ${result.error}`);
        showSnackBar("error", `Error: ${result.error}`);
        setConnectionState(false);
        return false;
      }
    } catch (error) {
      console.error(error);
      showSnackBar("error", `Request Error: ${error}`);
      setConnectionState(false);
      return false;
    }
  }
  const makeRequest = async (url, method, payload) => {
    try {
      const requestOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        // 将 payload 转换为 JSON 字符串，并将其添加到请求体中
        body: method === 'POST' ? JSON.stringify(payload) : undefined,
      };

      if (method === 'GET' && payload !== undefined) {
        // 如果是 GET 请求，将 payload 转换为 URL 参数字符串，并附加到 URL 上
        const params = new URLSearchParams(payload);
        url += `?${params}`;
      }
      const response = await fetch(HOST + url, requestOptions);

      if (!response.ok) {
        console.error(`Request failed with status ${response.status}`);
        showSnackBar("error", `Request Error: ${response.status}`);
        setConnectionState(false);
        return false;
      }

      const result = await response.json();
      const status = result.status;

      if (status) {
        const data = result.data;
        setConnectionState(true);
        return data;
      } else {
        console.error(`Error: ${result.error}`);
        showSnackBar("error", `Error: ${result.error}`);
        setConnectionState(false);
        return false;
      }
    } catch (error) {
      console.error(error);
      showSnackBar("error", `Request Error: ${error}`);
      setConnectionState(false);
      return false;
    }
  };
  const getConfig = async () => {
    // let respond = await fetch(HOST + "get-config");
    // let data = await respond.json();
    let data = await makeRequest("get-config", "GET");
    console.log("getConfig", data);
    if (data) setConfigData(data);
  }

  const handleChangeConfig = (field, name, value) => {
    let newData = { ...configData };
    newData[field][name] = value;
    setConfigData(newData);
    console.log("handleChangeConfig", configData)
  };

  const updateDate = async () => {
    // let respond = await fetch(HOST + "get-all");
    // let data = await respond.json();
    // let respond = await fetch(HOST + "get-history?n=20");
    // let data = await getRequest("get-history?n=20");
    let data = await makeRequest("get-history?n=20", "GET");
    console.log("data", data)
    if (!data) {
      setUpdateDataInterval(10000);
      // setRequestStatus(true);
    } else {
      setUpdateDataInterval(1000);
      let newDatas = data.reverse();
      setBoardName(newDatas[0].board_name);
      let id = newDatas[0].board_id;
      if (id !== null && id !== undefined) setPeripherals(PRODUCT[id].peripherals)
      setDatas(newDatas);
    }
  };
  const bytesFormatter = (value, name, props) => {
    let unit = props.unit;
    if (unit === 'B' || unit === 'B/s') {
      value = formatBytes(value);
    } else {
      if (Array.isArray(value)) return;
      value = value.toFixed(2);
      value += ' ';
    }
    return value;
  };
  return (
    <div className="home" style={{
      // backgroundColor: props.theme.homeBackgroundColor,
      color: props.theme.primary
    }}>
      <div className="titleBar">
        <div className="homeTitle" >
          {boardName}
        </div>
        <div className="themeSwitch">
          <div className='settingIcon' onClick={handleSettingPage}>
            <svg xmlns="http://www.w3.org/2000/svg" fill={props.theme.primary} height="1.5rem" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
          </div>
        </div>
      </div>
      <div className="cardBox">
        {peripherals.includes('usb_in') && <ExternalInput theme={props.theme} data={datas} bytesFormatter={bytesFormatter} />}
        {peripherals.includes('fan') && <FanCard theme={props.theme} data={datas} makeRequest={makeRequest} />}
        {peripherals.includes('battery') && <BatteryCard theme={props.theme} data={datas} />}
        {peripherals.includes('output') && <RaspberryPiPower theme={props.theme} data={datas} />}

        <StorageCard theme={props.theme} data={datas} />
        <MemoryCard theme={props.theme} data={datas} />
        <NetworkCard theme={props.theme} data={datas} />
        <ProcessorCard theme={props.theme} data={datas} />
      </div>
      <SettingPage
        open={settingPageDisplay}
        onCancel={handleCancel}
        onSave={handleSaveConfig}
        onChange={handleChangeConfig}
        onModeChange={props.onModeChange}
        configData={configData}
        peripherals={peripherals}
        getRequest={getRequest}
      />
      <Snackbars
        open={snackbarShow}
        text={snackbarText}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />
    </div >
  );
};
export default Home;