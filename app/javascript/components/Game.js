import React from 'react';
import { Link } from "react-router-dom";
import generator from "sudoku"; 
import SudokuBoard from './SudokuBoard';

const generateSudoku = () => {
  const raw = generator.makepuzzle()
  const result = {rows: []}

  for(let i=0; i<9; i++){
    const row = {cols: [], index: i};
    for (let j=0; j<9; j++){
      const value = raw[i + 9 + j]
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


class Game extends React.Component {
  state = {
    sudoku: generateSudoku()
  };

  handleChange = e => {
    this.setState(
      produce(state => {
        state.sudoku.rows[e.row].cols[e.col].value = e.value;
        if (!state.sudoku.solvedTime) {
          const solved = checkSolution(state.sudoku);
          if (solved) {
            state.sudoku.solveTime = new Date();
            state.sudoku.shareUrl = shareUrl(state.sudoku);
          }
        }
      })
    );
  };

  render() {
    return (
      <div className="game">
        <h1>Play the game below!</h1>
        <SudokuBoard sudoku={this.state.sudoku} />
      </div>
    );
  }
}
    
export default Game;