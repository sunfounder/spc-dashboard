import React, { useEffect, useState } from 'react';
import "./settingPage.css";
import {
  Paper,
  CardHeader,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Modal,
  Button,
  Stack,
  InputAdornment,
  Box,
  TextField,
  Switch,
  MenuItem,
  FormControl,
  Select,
  Input,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  CircularProgress,
  Typography
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Close,
  Check,
} from '@mui/icons-material';
// import  from '@mui/icons-material/Close';
// import Check from '@mui/icons-material/Check';

const SettingPage = (props) => {
  const [themeSwitchChecked, setThemeSwitchChecked] = useState(window.localStorage.getItem("SPCTheme") === "dark" ? true : false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState({});
  const [mqttTestState, setMqttTestState] = useState("idle");
  const [mqttTestErrorMsg, setMqttTestErrorMsg] = useState("");

  const themeSwitching = (isDark) => {
    let theme;
    if (isDark) {
      theme = "dark";
    } else {
      theme = "light";
    }
    props.onModeChange(theme);
    setThemeSwitchChecked(isDark);
    window.localStorage.setItem("SPCTheme", theme);
  };

  const handleDarkMode = (e) => {
    themeSwitching(e.target.checked);
  }

  const handleError = (name, error) => {
    if (error) {
      setHasError({ ...hasError, [name]: error });
    } else {
      let newHasError = { ...hasError };
      delete newHasError[name];
      setHasError(newHasError);
    }
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleTest = async () => {
    let sendData = props.configData.mqtt;
    setMqttTestState("loading");
    console.log(props.getRequest);
    let data = await props.getRequest("test-mqtt", sendData);
    if (data && data.status) {
      setMqttTestState("success");
    } else {
      setMqttTestState("failed");
      setMqttTestErrorMsg(data.error);
    }
  }
  return (
    <Modal
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper className='setting'
        elevation={3}
        sx={{
          width: '50vw',
          height: "70vh",
          borderRadius: "10px",
        }}
      >
        <CardHeader title="Settings" action={
          <IconButton onClick={props.onCancel}>
            <Close />
          </IconButton>
        } />
        <Box sx={{ overflow: 'auto', height: 'auto', overflowX: "hidden" }}>
          <SettingSwitchItem
            title="Dark mode"
            subtitle="Whether to enable Dark Theme mode"
            onChange={handleDarkMode}
            value={themeSwitchChecked} />
          <SettingToggleButtonItem
            title="Temperature Unit"
            subtitle="Set prefer temperature unit"
            onChange={(event) => props.onChange('auto', 'temperature_unit', event.target.value)}
            value={props.configData.auto.temperature_unit}
            options={[
              { value: 'C', name: 'Celius' },
              { value: 'F', name: 'Fahrenheit' },
            ]} />
          <List subheader={<ListSubheader>AUTO</ListSubheader>}>
            <SettingSlider
              title="Shutdown Stratagy"
              subtitle="Set the minimum battery level for automatic device shutdown when external power is lost."
              valueFormat={(value) => value === 100 ? "Instant" : `${value}%`}
              onChange={(event) => props.onChange('auto', 'shutdown_battery_pct', event.target.value)}
              value={props.configData.auto.shutdown_battery_pct}
              sx={{ marginTop: 2, }}
              min={10}
              max={100}
              step={10}
              marks
            />
            {/* rgb设置显示 */}
            {props.peripherals.includes("ws2812") &&
              <>
                <SettingSwitchItem
                  title="RGB Enable"
                  subtitle="Whether enable RGB"
                  onChange={(event) => props.onChange('auto', 'rgb_switch', event.target.checked)}
                  value={props.configData.auto.rgb_switch} />
                <ListItem>
                  <ListItemText primary="RGB Style" />
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120, margin: "0" }}>
                    <Select
                      onChange={(event) => props.onChange('auto', "rgb_style", event.target.value)}
                      value={props.configData.auto.rgb_style}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="breath">Breath</MenuItem>
                      <MenuItem value="leap">Leap</MenuItem>
                      <MenuItem value="flow">Flow</MenuItem>
                      <MenuItem value="raiseUp">Raise up</MenuItem>
                      <MenuItem value="colorful">Rainbow</MenuItem>
                    </Select>
                  </FormControl>
                </ListItem>
                <SettingTextItem
                  title="RGB Color"
                  subtitle="Set RGB Color"
                  value={props.configData.auto.rgb_color.includes("#") ? props.configData.auto.rgb_color.replace("#", "") : props.configData.auto.rgb_color}
                  onChange={(event) => props.onChange('auto', 'rgb_color', event.target.value)}
                  start="#"
                />
                <SettingTextItem
                  title="RGB Speed"
                  subtitle="Set RGB Speed"
                  type="number"
                  value={props.configData.auto.rgb_speed}
                  onChange={(event) => props.onChange('auto', 'rgb_speed', event.target.value)}
                />
                <SettingNumberItem
                  title="RGB Frequency"
                  subtitle="Set RGB Frequency"
                  min={500}
                  max={1500}
                  onError={(error) => handleError('auto_rgb_freq', error)}
                  value={props.configData.auto.rgb_pwm_frequency}
                  onChange={(event) => props.onChange('auto', 'rgb_pwm_frequency', event.target.value)}
                />
                <SettingToggleButtonItem
                  title="RGB Pin"
                  subtitle="Set RGB Pin"
                  onChange={(event) => props.onChange('auto', "rgb_pin", event.target.value)}
                  value={props.configData.auto.rgb_pin}
                  options={[
                    { value: '10', name: 'SPI | 10' },
                    { value: '21', name: 'PCM | 21' },
                    { value: '12', name: 'PWM | 12' },
                  ]} />
              </>
            }
          </List>
          <List subheader={<ListSubheader
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
          >
            <Box>MQTT</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {mqttTestState === "loading" && <CircularProgress sx={{ width: "2rem !important", height: "2rem !important" }} />}
              {mqttTestState === "success" && <Check />}
              {mqttTestState === "failed" && <Typography mt={0.5} color='red' >{mqttTestErrorMsg}</Typography>}
              <Button ml={2} onClick={handleTest}>Test</Button>
            </Box>
          </ListSubheader>}>
            <SettingTextItem
              title="Host"
              subtitle="MQTT broker host"
              value={props.configData.mqtt.host}
              onChange={(event) => props.onChange('mqtt', 'host', event.target.value)}
            />
            <SettingNumberItem
              title="Port"
              subtitle="MQTT broker port, normally 1883"
              value={props.configData.mqtt.port}
              min={1}
              max={65535}
              onError={(error) => handleError('mqtt_port', error)}
              onChange={(event) => props.onChange('mqtt', 'port', event.target.value)}
            />
            <SettingTextItem
              title="Username"
              subtitle="Username to login to MQTT broker"
              value={props.configData.mqtt.username}
              autoComplete="username"
              name="username"
              onChange={(event) => props.onChange('mqtt', 'username', event.target.value)}
            />
            <SettingPasswordItem
              title="Password"
              secondary="Password to login to MQTT broker"
              showPassword={showPassword}
              value={props.configData.mqtt.password}
              onChange={(event) => props.onChange('mqtt', 'password', event.target.value)}
              handleShowPassword={handleShowPassword}
            />
          </List>
        </Box>
        <CardActions>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="flex-start"
            width={"100%"}
            spacing={12}
          >
            <Button variant="contained" onClick={props.onCancel}>Cancel</Button>
            <Button
              disabled={Object.keys(hasError).length !== 0}
              variant="contained"
              onClick={props.onSave}
            >
              Save
            </Button>
          </Stack>
        </CardActions>
        {/* </div> */}
      </Paper >
    </Modal >
  );
};

const SettingToggleButtonItem = (props) => {
  let buttons = props.options.map((option, index) =>
    <ToggleButton value={option.value} key={option.value}>
      {option.name}
    </ToggleButton>
  )
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <ToggleButtonGroup size="small" value={props.value}
        onChange={props.onChange}
        exclusive={true}
        aria-label="Small sizes">
        {buttons}
      </ToggleButtonGroup>
    </SettingItem>
  )
}

const SettingNumberItem = (props) => {
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const validation = (value) => {
    // 如果外部传入校验函数，就直接使用外部校验函数
    if (props.validation) return props.validation(value);

    if (typeof value === "string" && value !== "") {
      // if (value === "" || value === undefined || value === NaN) {
      //   props.onError();
      //   return { status: false, message: "Port is required" };
      // }
      if (! /^\d+$/.test(value)) {
        props.onError(true);
        return { status: false, message: `Number is required` };
      }
    }
    // 如果没有传入最大最小值表示不使用
    if (props.min === undefined || props.max === undefined) return { status: true };
    if (value < props.min || value > props.max) {
      props.onError(true);
      return { status: false, message: `Out of range [${props.min}, ${props.max}]` };
    }
    props.onError(false);
    return { status: true };
  }

  const handleChange = (event) => {
    let newEvent = event;
    let value = event.target.value;
    let result = validation(value)
    if (result.status) {
      setError(false);
      setHelperText("");
      if (value !== "") {
        value = parseInt(value);
      }
      newEvent = { ...event, target: { ...event.target, value: value } };
    } else {
      setError(true);
      setHelperText(result.message);
    }
    props.onChange(newEvent);
  }
  return <SettingTextItem {...props}
    error={error}
    helperText={helperText}
    onChange={handleChange}
  />
}

const SettingTextItem = (props) => {
  let inputProps = null;
  if (props.start) {
    inputProps = {
      startAdornment: <InputAdornment position="start">{props.start}</InputAdornment>,
    }
  } else if (props.end) {
    inputProps = {
      endAdornment: <InputAdornment position="end">{props.end}</InputAdornment>,
    }
  }
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <TextField
        error={props.error || false}
        sx={{ width: "30%" }}
        variant={props.variant || "standard"}
        value={props.value}
        onChange={props.onChange}
        InputProps={inputProps}
        type={props.type || "text"}
        autoComplete={props.autoComplete || "off"}
        name={props.name}
        helperText={props.helperText}
        placeholder={props.placeholder}
      ></TextField>
    </SettingItem>
  )
}

const SettingSwitchItem = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Switch onChange={props.onChange} checked={props.value} />
    </SettingItem>
  )
}

const SettingItem = (props) => {
  return (<>
    <ListItem>
      <ListItemText primary={props.title} secondary={props.subtitle} />
      {props.children}
    </ListItem>
  </>
  )
}

const SettingPasswordItem = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Input
        sx={{ width: '30%' }}
        id="standard-adornment-password"
        type={props.showPassword ? 'text' : 'password'}
        onChange={props.onChange}
        value={props.value}
        autoComplete={props.autoComplete || "password"}
        endAdornment={
          <InputAdornment position="end" >
            <IconButton
              aria-label="toggle password visibility"
              onClick={props.handleShowPassword}
              onMouseDown={props.handleShowPassword}
            >
              {props.showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
    </SettingItem>
  )
}

const SettingSlider = (props) => {
  return (
    <SettingItem
      title={props.title}
      subtitle={props.subtitle}
    >
      <Box
        sx={{ width: "50%", margin: "10px" }}
      >
        <Slider
          onChange={props.onChange}
          value={props.value}
          valueLabelFormat={props.valueFormat}
          valueLabelDisplay="auto"
          marks={props.marks}
          step={props.step}
          min={props.min}
          max={props.max}
        />
      </Box>
    </SettingItem>
  )
}

export default SettingPage;