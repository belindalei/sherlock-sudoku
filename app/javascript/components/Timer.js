import React, { Component } from "react";

export default class Timer extends Component {
  state = {
    elapsed: 0
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        elapsed: Math.floor(
          (new Date().getTime() - this.props.start.getTime()) / 1000
        )
      });
    });
  }

  componentWillUnmount() {
    console.log("deleting interval")
    delete this.interval;
  }

  render() {
    const { elapsed } = this.state;
    return <h2>Time: {elapsed}</h2>;
  }
}
