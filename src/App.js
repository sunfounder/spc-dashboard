import './App.css';
import React from 'react'
import Home from './components/home';
import Minimal from './components/minimal';
import RouterView from './router/index';

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
    sliderBackgroundColor:"#FAFAFA",
    sliderHandleBackgroundColor:"rgb(34, 179, 82)"
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
    sliderBackgroundColor:"rgb(243, 243, 243)",
    sliderHandleBackgroundColor:"rgb(73, 227, 122)"
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: THEMES.dark,
      themeName: "dark",
    }
  }

  changeTheme = (themeName) => {
    if (Object.keys(THEMES).indexOf(themeName) >= 0) {
      this.setState({
        theme: THEMES[themeName],
        themeName: themeName
      });
    }

  }

  render() {
    let a = false;
    return (
      <div className='app'>
        <RouterView onModeChange={this.changeTheme} theme={this.state.theme}></RouterView>
         {/* <Home onModeChange={this.changeTheme} theme={this.state.theme}></Home> */}
         {/* <Minimal onModeChange={this.changeTheme} theme={this.state.theme}></Minimal> */}
      </div>
    )
  }
}

export default App
