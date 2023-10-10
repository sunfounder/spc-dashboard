import React, { Component } from "react"
import './slider.css'

class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handleLeft: 0,
      isDragging: false,
      value: "Quiet",
      index: 0,
    };
    this.sliderRef = React.createRef();
    this.handleRef = React.createRef();
    this.gridNum = 4;
    this.options = [
      'quiet',
      'normal',
      'performance',
      'auto',
    ],
      this.optionNames = [
        'Quiet',
        'Normal',
        'Performance',
        'Auto',
      ]
  }
  handleMouseDown = (event) => {
    event.preventDefault();
    console.log("handleMouseDown");
    this.setState({ isDragging: true }, () => this.handleMouseMove(event));
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  };

  handleMouseMove = (event) => {
    if (this.state.isDragging) {
      const sliderRect = this.sliderRef.current.getBoundingClientRect();
      const handleRect = this.handleRef.current.getBoundingClientRect();
      const handleWidth = handleRect.width;
      const minX = sliderRect.left;
      const maxX = sliderRect.right - handleWidth;
      const clampedX = Math.max(minX, Math.min(event.clientX, maxX));
      const handleLeft = clampedX - minX;
      this.setState({ handleLeft });
      this.handleMouse(handleLeft)
    }
  };

  positionToIndex = (position) => {
    const sliderRect = this.sliderRef.current.getBoundingClientRect();
    const width = sliderRect.width - 6;
    let x = (this.gridNum - 1) * position / width;
    return Math.round(x);
  }

  indexToPosition = (index) => {
    let width = 160;
    if (this.sliderRef.current) {
      const sliderRect = this.sliderRef.current.getBoundingClientRect();
      width = sliderRect.width - 6;
    }
    console.log(width);
    let position = index * width / (this.gridNum - 1);
    return position;
  }

  handleMouse = (position) => {
    let index = this.positionToIndex(position);
    this.setIndex(index);
  }

  setIndex = (index) => {
    let position = this.indexToPosition(index);
    position += 3;
    position -= 7;
    this.setState({
      index: index,
      handleLeft: position,
      value: this.optionNames[index]
    });
  }

  handleMouseUp = () => {
    this.setState({ isDragging: false });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    const currentLabel = this.state.value;
    console.log(currentLabel)
    // this.sendData(currentLabel);
  };

  sendData = async (data) => {
    await fetch(HOST + "set-fan-mode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
  }
  render() {
    let index = this.options.indexOf(this.props.mode);
    this.setIndex(index);
    return (
      <div className="slider" ref={this.sliderRef}>
        <div className='slider-lable'>
          {this.props.label}
        </div>
        <div className="slider-slider" onMouseDown={this.handleMouseDown}>
          <div
            className="slider-handle"
            style={{
              left: `${this.state.handleLeft}px`,
              backgroundColor: this.props.theme.sliderHandleBackgroundColor
            }}
            ref={this.handleRef}

          ></div>
          <div className="slider-slot" style={{
            backgroundColor: this.props.theme.sliderBackgroundColor,
          }}>
            {this.options.map((key, index) => {
              return (<div className="slider-marker" key={key}></div>)
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Slider;