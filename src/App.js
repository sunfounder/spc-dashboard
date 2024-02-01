import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import RouterView from './router/index';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  green,
  indigo,
  deepPurple,
  amber,
  lightGreen,
  pink,
  blue,
  cyan,
} from '@mui/material/colors';

import './App.css';

let THEMES = {
  dark: {
    name: "dark",
    primary: "#F0F0F0",
    homeBackgroundColor: "#3c3c3c",
    chartBackgroundColor: "#252527",
    cardBackgroundColor: "#1e1e1e",
    cardBorder: "1px solid rgba(250, 250, 250, 0.2)",
    backgroundRed: "rgb(196, 49, 72)",
    backgroundYellow: "rgb(213 189 32)",
    backgroundGreen: "rgb(34, 179, 82)",
    backgroundBlue: "rgb(34, 89, 179)",
    backgroundPurple: "rgb(107 61 171)",
    foregroundRed: "rgb(255, 82, 111)",
    foregroundYellow: "rgb(255, 215, 69)",
    foregroundLightGreen: "rgb(73, 227, 122)",
    foregroundGreen: "rgb(73, 227, 122)",
    foregroundBlue: "rgb(82, 215, 255)",
    foregroundPurple: "rgb(172 123 239)",
    svgBackgroundColor: "#FAFAFA",
    buttonBackgroundColor: "rgba(250, 250, 250, 0.267)",
    sliderBackgroundColor: "#FAFAFA",
    sliderHandleBackgroundColor: "rgb(34, 179, 82)"
  },
  light: {
    name: "light",
    primary: "#333333",
    homeBackgroundColor: "#ececec",
    chartBackgroundColor: "#f3f3f3",
    cardBackgroundColor: "#ffffff",
    cardBorder: "1px solid rgba(64, 64, 64, 0.2)",
    backgroundRed: "rgb(255, 82, 111)",
    backgroundYellow: "rgb(255, 215, 69)",
    backgroundGreen: "rgb(73, 227, 122)",
    backgroundBlue: "rgb(82, 215, 255)",
    backgroundPurple: "rgb(172 123 239)",
    foregroundRed: "rgb(196, 49, 72)",
    foregroundYellow: "rgb(213 189 32)",
    foregroundLightGreen: "rgb(73, 227, 122)",
    foregroundGreen: "rgb(34, 179, 82)",
    foregroundBlue: "rgb(34, 89, 179)",
    foregroundPurple: "rgb(107 61 171)",
    svgBackgroundColor: "#404040",
    sliderBackgroundColor: "rgb(243, 243, 243)",
    sliderHandleBackgroundColor: "rgb(73, 227, 122)"
  }
}
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    fan: {
      main: green[500],
    },
    externalInput: {
      main: indigo[500],
    },
    battery: {
      main: deepPurple[500],
    },
    raspberryPiPower: {
      main: pink[500],
    },
    storage: {
      main: lightGreen[500],
    },
    memory: {
      main: cyan[500],
    },
    processor: {
      main: blue[500],
    },
    network: {
      main: amber[500],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      ::-webkit-scrollbar {
        width: 10px;
      }
      ::-webkit-scrollbar-track {
        background-color: rgb(60, 60, 60);
      }
      ::-webkit-scrollbar-thumb {
        background-color: #888;
      }
      ::-webkit-scrollbar-thumb:hover {
        background-color: #555;
      }
      `,
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    externalInput: {
      main: indigo[100],
    },
    fan: {
      main: green[100],
    },
    battery: {
      main: deepPurple[100],
    },
    raspberryPiPower: {
      main: pink[100],
    },
    storage: {
      main: lightGreen[100],
    },
    memory: {
      main: cyan[100],
    },
    processor: {
      main: blue[100],
    },
    network: {
      main: amber[100],
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        ::-webkit-scrollbar {
          width: 10px;
        }
        ::-webkit-scrollbar-track {
          background-color: rgb(240, 240, 240);
        }
        ::-webkit-scrollbar-thumb {
          background-color: #aaa;
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: #bbb;
        }
      `,
    },
  },
});
const App = () => {
  const [theme, setTheme] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(null);

  const changeTheme = (themeName) => {
    if (Object.keys(THEMES).indexOf(themeName) >= 0) {
      setTheme(THEMES[themeName]);
    }
    if (themeName === 'dark')
      setCurrentTheme(darkTheme);
    else
      setCurrentTheme(lightTheme);
  };

  if (theme === null) {
    let _theme = window.localStorage.getItem("SPCTheme");
    if (_theme === null) _theme = "light"; // default theme
    changeTheme(_theme);
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div className='app'>
        <RouterView onModeChange={changeTheme} theme={theme} />
      </div>
    </ThemeProvider>
  );
}
export default App;