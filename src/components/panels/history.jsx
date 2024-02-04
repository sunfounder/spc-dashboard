import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import dayjs from 'dayjs';

import Panel from './panel.jsx';

const HistoryPanel = (props) => {
  const [keys, setKeys] = useState([]);
  const [data, setData] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(new Date());
  const [selectedKeys, setSelectedKeys] = useState([]);

  const updateData = useCallback(async () => {
    let payload = {
      start: start,
      end: end,
      key: selectedKeys,
    }
    let data = await props.request("get-time-range", "GET", payload);
    setData(data);
  });

  useEffect(() => {
    // updateData();
  }, [start, end, selectedKeys, updateData]);

  useEffect(() => {
    props.request("get-history", "GET", { n: 1 }).then(data => {
      let keys = Object.keys(data);
      // 删除时间
      keys.splice(keys.indexOf("time"), 1);
      setKeys(keys);
    });
  }, [props]);

  const handleKeyChange = (key, checked) => {
    if (checked) {
      setSelectedKeys([...selectedKeys, key]);
    } else {
      setSelectedKeys(selectedKeys.filter(k => k !== key));
    }
  }

  const handleTimeRangeChange = (data) => {
    console.log("handleTimeRangeChange", data);
    if (data.start !== undefined) {
      setStart(data.start);
    }
    if (data.end !== undefined) {
      setEnd(data.end);
    }
  }

  return (
    <Panel title="History" {...props} sx={{ height: "100%", overflow: "hidden" }}>
      <Box sx={{ display: "flex", width: "100%", height: "100%", overflow: "hidden", gap: "2rem" }}>
        <Card sx={{ display: "flex", width: "320px", height: "100%", overflow: "hidden scroll", padding: "0 10px" }}>
          <FormGroup sx={{ height: "fit-content" }}>
            {keys.map((key, index) => {
              return (
                <FormControlLabel
                  control={<Checkbox checked={selectedKeys.includes(key)} onChange={(event) => { handleKeyChange(key, event.target.checked) }} />}
                  label={key}
                />
              );
            })}
          </FormGroup>
        </Card >
        <Card sx={{ width: "100%" }}>
          <Toolbox start={start} end={end} onChange={handleTimeRangeChange} />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Box >
    </Panel>
  );
}

const Toolbox = (props) => {
  const handleStartChange = (date) => {
    props.onChange({ start: date });
  }
  const handleEndChange = (date) => {
    console.lo
    props.onChange({ end: date });
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", alignContent: "center", padding: "10px", gap: "10px", justifyContent: "end" }}>
        <Typography variant='h6' sx={{ margin: "auto 0" }}>From</Typography>
        <DateTimePicker id="fromDateTime" value={props.start} onChange={handleStartChange} />
        <Typography variant='h6' sx={{ margin: "auto 0" }}>To</Typography>
        <DateTimePicker id="toDateTime" value={props.start} onChange={handleEndChange} />
      </Box>
    </LocalizationProvider>
  );
}

export default HistoryPanel;
