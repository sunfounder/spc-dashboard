import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
  InputAdornment,
  MenuList,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarIcon } from '@mui/x-date-pickers';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

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

const QuickSelect = {
  "last-5-minutes": "Last 5 minutes",
  "last-30-minutes": "Last 30 minutes",
  "last-1-hour": "Last 1 hour",
  "last-2-hours": "Last 2 hours",
  "last-4-hours": "Last 4 hours",
  "last-8-hours": "Last 8 hours",
  "last-12-hours": "Last 12 hours",
  "last-24-hours": "Last 24 hours",
  "last-3-days": "Last 3 days",
  "today": "Today",
  "yesterday": "Yesterday",
}

const HistoryPanel = (props) => {
  const [keys, setKeys] = useState([]);
  const [data, setData] = useState([]);
  const [start, setStart] = useState(parseInt(window.localStorage.getItem("spc-dashboard-history-start")) || dayjs().subtract(1, "day").unix());
  const [end, setEnd] = useState(parseInt(window.localStorage.getItem("spc-dashboard-history-end")) || dayjs().unix());
  const [selectedKeys, setSelectedKeys] = useState(JSON.parse(window.localStorage.getItem("spc-dashboard-history-selected-keys")) || []);

  const updateData = useCallback(async () => {
    if (selectedKeys.length === 0) {
      return;
    }
    let payload = {
      start: start * 1000000000,
      end: end * 1000000000,
      key: selectedKeys.join(","),
    }
    let data = await props.request("get-time-range", "GET", payload);
    setData(data);
  }, [props, start, end, selectedKeys]);

  useEffect(() => {
    updateData();
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
    let temp = [];
    if (checked) {
      temp = [...selectedKeys, key];
    } else {
      temp = selectedKeys.filter(k => k !== key);
    }
    window.localStorage.setItem("spc-dashboard-history-selected-keys", JSON.stringify(temp));
    setSelectedKeys(temp);
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
    <Panel title="History" {...props} sx={{ height: "100%", overflow: "hidden" }} navActions={
      <DateTimeRangePicker onChange={handleTimeRangeChange} onError={(msg) => props.showSnackBar("error", msg)} />
    }>
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
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedKeys.map((key, index) => {
                return (
                  <Line type="monotone" dataKey={key} stroke="#8884d8" key={index} isAnimationActive={false} dot={false} />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Box >
    </Panel>
  );
}

const DateTimeRangePicker = (props) => {
  const [start, setStart] = useState(parseInt(window.localStorage.getItem("spc-dashboard-history-start")) || dayjs().subtract(1, "day").unix());
  const [end, setEnd] = useState(parseInt(window.localStorage.getItem("spc-dashboard-history-end")) || dayjs().unix());
  const [quickSelect, setQuickSelect] = useState(window.localStorage.getItem("spc-dashboard-history-quick-select") || "last-24-hours");
  const [label, setLabel] = useState(QuickSelect[quickSelect] || "Last 24 hours");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const openMenu = Boolean(menuAnchorEl);

  const handleMenuShow = (event) => {
    setMenuAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  }

  const handleQuickSelect = (value) => {
    console.log("handleTimeRangeChoose", value);
    window.localStorage.setItem("spc-dashboard-history-quick-select", value);
    setQuickSelect(value);
    setLabel(QuickSelect[value]);
    handleMenuClose();
  }

  const getTimeRange = (value) => {
    let start, end;
    if (value === "today") {
      start = dayjs().startOf("day").unix();
      end = dayjs().endOf("day").unix();
    } else if (value === "yesterday") {
      start = dayjs().subtract(1, "day").startOf("day").unix();
      end = dayjs().subtract(1, "day").endOf("day").unix();
    } else if (value.startsWith("last")) {
      let temp = value.split("-");
      let number = parseInt(temp[1]);
      let unit = temp[2];
      start = dayjs().subtract(parseInt(number), unit).unix();
      end = dayjs().unix();
    }
    return [start, end];
  }

  const handleStartChange = (datetime) => {
    if (datetime.unix() === start) {
      return;
    }
    // 开始时间不能大于结束时间
    if (datetime.unix() > end) {
      props.onError("Start time cannot be greater than end time");
      return;
    }
    window.localStorage.setItem("spc-dashboard-history-start", datetime.unix());
    let startLabel = dayjs.unix(datetime.unix()).format("YYYY-MM-DD HH:mm:ss");
    let endLabel = dayjs.unix(end).format("YYYY-MM-DD HH:mm:ss");
    setLabel(`${startLabel} - ${endLabel}`);
    setStart(datetime.unix());
    setQuickSelect("custom");
    props.onChange({ start: datetime.unix() });
  }

  const handleEndChange = (datetime) => {
    if (datetime.unix() === end) {
      return;
    }
    // 结束时间不能小于开始时间
    if (datetime.unix() < start) {
      props.onError("End time cannot be less than start time");
      return;
    }
    window.localStorage.setItem("spc-dashboard-history-end", datetime.unix());
    let startLabel = dayjs.unix(start).format("YYYY-MM-DD HH:mm:ss");
    let endLabel = dayjs.unix(datetime.unix()).format("YYYY-MM-DD HH:mm:ss");
    setLabel(`${startLabel} - ${endLabel}`);
    setEnd(datetime.unix());
    setQuickSelect("custom");
    props.onChange({ end: datetime.unix() });
  }

  useEffect(() => {
    let interval = setInterval(() => {
      if (quickSelect !== "custom") {
        let [start, end] = getTimeRange(quickSelect);
        console.log("quickSelect", quickSelect, start, end);
        setStart(start);
        setEnd(end);
        props.onChange({ start: start, end: end });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quickSelect, props]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined" size='smaall'>
        <InputLabel htmlFor="datetime-range">Datetime Range</InputLabel>
        <OutlinedInput
          id="datetime-range"
          type='text'
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="datetime-range"
                onClick={handleMenuShow}
                edge="end"
              >
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          }
          label="Datetime Range"
          value={label}
        />
      </FormControl>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <MenuList>
            {Object.keys(QuickSelect).map((key, index) => {
              return (
                <MenuItem
                  key={key}
                  selected={quickSelect === key}
                  onClick={() => { handleQuickSelect(key) }}>
                  {QuickSelect[key]}
                </MenuItem>
              );
            })}
          </MenuList>
          <Box id="custom-datetime-range" sx={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto" }}>
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", padding: "0 10px" }}>
              <DateTimeField
                label="From"
                value={dayjs.unix(start)}
                onChange={handleStartChange}
                format="YYYY-MM-DD HH:mm:ss"
                sx={{ margin: "auto", width: "100%" }}
              />
              <Typography variant="h6" sx={{ margin: "auto 10px" }}>-</Typography>
              <DateTimeField
                label="To"
                value={dayjs.unix(end)}
                onChange={(date) => setEnd(date.unix())}
                format="YYYY-MM-DD HH:mm:ss"
                sx={{ margin: "auto", width: "100%" }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <DateCalendar value={dayjs.unix(start)} onChange={handleStartChange} />
              <DateCalendar value={dayjs.unix(end)} onChange={handleEndChange} />
            </Box>
          </Box>
        </Box>
      </Menu>
    </LocalizationProvider >
  );
}


export default HistoryPanel;
