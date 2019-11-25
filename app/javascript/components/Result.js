import React, { Component } from "react";

export default class Result extends Component {
  render() {
    const { sudoku } = this.props;
    const elapsed = Math.floor(
      (sudoku.solveTime.getTime() - sudoku.startTime.getTime()) / 1000
    );

    return (
      <div>
        <p>You solved the sudoku in {elapsed} seconds</p>
      </div>
    );
  }
}
