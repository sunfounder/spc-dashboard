
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  IconButton,
  List,
  ListItem,
  TextField,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import Panel from './panel.jsx';
import DownloadIcon from '@mui/icons-material/Download';
import WrapIcon from '@mui/icons-material/WrapText';
import AutoScrollIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import AutoUpdateIcon from '@mui/icons-material/Autorenew.js';

const LogPanel = (props) => {
  const [logList, setLogList] = useState(JSON.parse(window.localStorage.getItem("spc-dashboard-log-logList")) || []);
  const [fileIndex, setFileIndex] = useState(parseInt(window.localStorage.getItem("spc-dashboard-log-fileIndex")) || 0);
  const [logFile, setLogFile] = useState(window.localStorage.getItem("spc-dashboard-log-logFile") || "");
  const [fileContent, setFileContent] = useState([]);
  const [autoUpdate, setAutoUpdate] = useState(window.localStorage.getItem("spc-dashboard-log-autoUpdate") === "true");
  const [filter, setFilter] = useState(window.localStorage.getItem("spc-dashboard-log-filter") || "");
  const [lines, setLines] = useState(window.localStorage.getItem("spc-dashboard-log-lines") || 100);
  const [level, setLevel] = useState(window.localStorage.getItem("spc-dashboard-log-level") || "INFO");
  const [autoScroll, setAutoScroll] = useState(window.localStorage.getItem("spc-dashboard-log-autoScroll") === "true");
  const [wrap, setWrap] = useState(window.localStorage.getItem("spc-dashboard-log-wrap") === "true");

  const contentRef = useRef(null);

  const getLog = useCallback(async () => {
    if (!logFile) return;
    let payload = {
      log: logFile,
      filter: filter,
      n: lines,
      level: level,
    }
    let result = await props.request('get-log', 'GET', payload);
    setFileContent(result);
  }, [logFile, filter, lines, level, props]);

  const handleFileSelect = async (event, newValue) => {
    let logFile = logList[newValue];
    window.localStorage.setItem("spc-dashboard-log-fileIndex", newValue);
    window.localStorage.setItem("spc-dashboard-log-logFile", logFile);
    setFileIndex(newValue);
    setLogFile(logFile);
  }

  const getLogList = useCallback(async () => {
    let result = await props.request('get-log-list', 'GET');
    result.sort();
    if (result.length > fileIndex) {
      setLogFile(result[fileIndex]);
    }
    setLogList(result);
  }, [fileIndex, props]);

  const handleConfigChange = (config) => {
    console.log("handleConfigChange", config);
    if (config.lines !== undefined) {
      window.localStorage.setItem("spc-dashboard-log-lines", config.lines);
      setLines(config.lines);
    }
    if (config.level !== undefined) {
      window.localStorage.setItem("spc-dashboard-log-level", config.level);
      setLevel(config.level);
    }
    if (config.filter !== undefined) {
      window.localStorage.setItem("spc-dashboard-log-filter", config.filter);
      setFilter(config.filter);
    }
    if (config.autoUpdate !== undefined) {
      window.localStorage.setItem("spc-dashboard-log-autoUpdate", config.autoUpdate);
      setAutoUpdate(config.autoUpdate);
    }
    if (config.autoScroll !== undefined) {
      console.log("autoScroll", config.autoScroll);
      window.localStorage.setItem("spc-dashboard-log-autoScroll", config.autoScroll);
      setAutoScroll(config.autoScroll);
    }
    if (config.wrap !== undefined) {
      window.localStorage.setItem("spc-dashboard-log-wrap", config.wrap);
      setWrap(config.wrap);
    }
  }

  const handleDownload = async () => {
    console.log("download log file", fileContent);
    let content = fileContent.join("");
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = logFile;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  useEffect(() => {
    getLogList();
  }, [getLogList]);

  // 自动更新
  useEffect(() => {
    let interval = setInterval(() => {
      if (autoUpdate && logFile) {
        getLog();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [getLog, lines, level, filter, autoUpdate, logFile]);

  // 自动更新
  useEffect(() => {
    getLog();
  }, [getLog, lines, level, filter, logFile]);

  useEffect(() => {
    if (autoScroll) {
      const contentElement = contentRef.current;
      contentElement.scrollTop = contentElement.scrollHeight;
    }
  }, [fileContent, autoScroll]);

  return (<Panel id="log-panel" title="Log" {...props} sx={{ height: "100%", overflow: "hidden" }}
    navActions={<Tooltip title="Download log file">
      <IconButton aria-label="download" color="primary" onClick={handleDownload}>
        <DownloadIcon />
      </IconButton>
    </Tooltip>}
  >
    <Box sx={{ display: "flex", width: "100%", height: "90%", gap: "2rem" }}>
      <Card id="log-list" sx={{ overflow: "auto" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={fileIndex}
          onChange={handleFileSelect}
        >
          {logList.map((item, index) => {
            return <Tab label={item} key={index} sx={{ padding: "0 20px" }} />
          })}
        </Tabs>
      </Card >
      <Card id="log-content" sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <Toolbox lines={lines} level={level} filter={filter} wrap={wrap} autoUpdate={autoUpdate} autoScroll={autoScroll} onChange={handleConfigChange} />
        <Box ref={contentRef} sx={{ flexGrow: 1, overflow: `${wrap ? "hidden" : "auto"} auto` }}>
          <List>
            {fileContent.map((line, index) => {
              return <ListItem key={index} disablePadding>
                <Typography sx={{ fontFamily: "Courier New", textWrap: wrap ? "wrap" : "nowrap" }}> {line} </Typography>
              </ListItem>
            })}
          </List>
        </Box>
      </Card>
    </Box >
  </Panel >
  );
}

const Toolbox = (props) => {
  const [toggleGroupValues, setToggleGroupValues] = useState([]);

  useEffect(() => {
    let values = [];
    if (props.wrap) values.push("wrap");
    if (props.autoScroll) values.push("autoScroll");
    if (props.autoUpdate) values.push("autoUpdate");
    setToggleGroupValues(values);
  }, [props.wrap, props.autoScroll, props.autoUpdate]);

  const handleToggleGroupChange = (event, newValues) => {
    setToggleGroupValues(newValues);
    console.log("handleToggleGroupChange", newValues)
    props.onChange({
      wrap: newValues.includes("wrap"),
      autoScroll: newValues.includes("autoScroll"),
      autoUpdate: newValues.includes("autoUpdate")
    });
  }

  const handleLinesChange = (event) => {
    props.onChange({ lines: event.target.value });
  }

  const handleLevelChange = (event) => {
    props.onChange({ level: event.target.value });
  }

  const handleFilterChange = (event) => {
    props.onChange({ filter: event.target.value });
  }

  // const handleAutoUpdateChanges = (event) => {
  //   props.onChange({ autoUpdate: event.target.checked });
  // }

  // const handleAutoScrollChanges = (event) => {
  //   props.onChange({ autoScroll: event.target.checked });
  // }

  return (
    <Box sx={{ width: "100%", display: "flex", margin: "10px 0", gap: "10px" }}>
      <TextField id="lines-number" label="Lines" variant="outlined" size="small" value={props.lines} sx={{ width: "100px" }} onChange={handleLinesChange} />
      <FormControl size="small">
        <InputLabel id="level">Level</InputLabel>
        <Select
          labelId="level-label"
          id="level"
          value={props.level}
          label="Level"
          onChange={handleLevelChange}
        >
          <MenuItem value={"DEBUG"}>Debug</MenuItem>
          <MenuItem value={"INFO"}>Info</MenuItem>
          <MenuItem value={"WARNING"}>Warning</MenuItem>
          <MenuItem value={"ERROR"}>Error</MenuItem>
          <MenuItem value={"CRITICAL"}>Critical</MenuItem>
        </Select>
      </FormControl>
      <TextField id="filter" label="Filter" variant="outlined" size="small" value={props.filter} onChange={handleFilterChange} sx={{ flexGrow: 1 }} />
      {/* <FormControlLabel control={<Checkbox defaultChecked value={props.autoUpdate} onChange={handleAutoUpdateChanges} />} label="Auto Update" />
      <FormControlLabel control={<Checkbox defaultChecked value={props.autoScroll} onChange={handleAutoScrollChanges} />} label="Auto Scroll" /> */}
      <ToggleButtonGroup
        value={toggleGroupValues}
        onChange={handleToggleGroupChange}
        size="small"
      >
        <ToggleButton value="wrap" aria-label="wrap">
          <Tooltip title="Line Wrap">
            <WrapIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="autoScroll" aria-label="autoScroll">
          <Tooltip title="Auto Scroll">
            <AutoScrollIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="autoUpdate" aria-label="autoUpdate">
          <Tooltip title="Auto Update">
            <AutoUpdateIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default LogPanel;
