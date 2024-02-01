import React, { Component } from "react";

import "./toggleSwitch.css";

class ToggleSwitch extends Component {

  handleChange = () => {
    let newState = !this.props.state;
    this.props.onChange(newState);
  }

  render() {
    return (
      <div className={`toggle-switch ${this.props.state ? "active" : ""}`}
        onClick={this.handleChange}>
        <div className="toggle-switch-background"></div>
        <div className="toggle-switch-handle"></div>
      </div>
    )
  }
}

export default ToggleSwitch;