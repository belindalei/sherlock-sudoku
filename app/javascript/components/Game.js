import React from 'react';
import { Link } from "react-router-dom";
import generator from "sudoku"; 
import SudokuBoard from './SudokuBoard';
import produce from 'immer'

const generateSudoku = () => {
  //e + 1 because the NPM library only goes 0-8 instead of 1-9
  const raw = generator.makepuzzle()
  const rawSolution = generator.solvepuzzle(raw)

  const formatted = raw.map(e => e=== null ? null : e + 1)
  const formattedSolution = rawSolution.map(e => e + 1)

  const result = {
     rows: [], 
     solution: formattedSolution,
     startTime: new Date(),
     solvedTime: null
  }



  for(let i=0; i<9; i++){
    const row = {cols: [], index: i};
    for (let j=0; j<9; j++){
      const value = formatted[i + 9 + j]
      const col = {
        row: i,
        col: j, 
        value: value, 
        readonly: value !== null //prefilled fill
      };
      row.cols.push(col);
    }
    result.rows.push(row)
  }
  return result; 
}

const checkSolution = (sudoku) => {
  const candidate = sudoku.rows
    .map(row => row.cols.map(col => col.value))
    .flat()

  for (let i=0; i<candidate.length; i++){
    if(candidate[i] === null || candidate[i] !== sudoku.solution[i]){
      return false; 
    }
  }
  return true; 
}


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
    );
  }
}
    
export default Game;