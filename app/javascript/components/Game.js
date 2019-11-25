import React from 'react';
import { Link } from "react-router-dom";
import SudokuBoard from './SudokuBoard';
import produce from 'immer'
import InstructionPopup from './InstructionPopup'
import { generateSudoku, checkSolution} from '../lib/sudoku'


class Game extends React.Component {
  state = produce({}, () => ({
    sudoku: generateSudoku()
  }));

  handleChange = e => {
    this.setState(
      produce(state => {
        state.sudoku.rows[e.row].cols[e.col].value = e.value;
        if (!state.sudoku.solvedTime) {
          const solved = checkSolution(state.sudoku);
          if (solved) {
            state.sudoku.solveTime = new Date();
          }
        }
      })
    );
  };

  solveSudoku = e => {
    this.setState(
      produce(state => {
        state.sudoku.rows.forEach(row =>
          row.cols.forEach(col => {
            col.value = state.sudoku.solution[col.row * 9 + col.col];
          })
        );
      })
    );
  };


  render() {
    return (
      <>
      <div className="game">
        <h1 className="ui inverted header">Play the game below!</h1>
          <SudokuBoard
            sudoku={this.state.sudoku}
            onChange={this.handleChange}
          />
        <button
          className="ui inverted primary button"
          onClick={this.solveSudoku}
        >
          Watson!!
        </button>
        <div className="return-home">
          <Link to="/">Return Home</Link>
        </div>
      </div>
      <div className="instructions">
        <InstructionPopup/>
      </div>
      </>
    );
  }
}
    
export default Game;