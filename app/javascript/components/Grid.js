import React from 'react';

class Grid extends React.Component {
  constructor(input = EMPTY) {
    let currentRow;
    this.rows = [];

    for (let idx = 0; idx < input.length; idx++) {
      if (idx % 9 === 0) {
        currentRow = [];
        this.rows.push(currentRow);
      }

      currentRow.push(
        new Cell(this.rows.length - 1, currentRow.length, input[idx])
      );
    }
  }

  toString() {
    let output = "";
    for (let i = 0; i < this.rows.length; i++) {
      if (i !== 0 && i % 3 === 0) {
        output += "---------+---------+---------\n";
      }

      let currentRow = this.rows[i];
      for (let j = 0; j < currentRow.length; j++) {
        if (j !== 0 && j % 3 === 0) {
          output += "|";
        }

        output += " " + currentRow[j].toString() + " ";
      }

      output += "\n";
    }

    return output;
  }

  subgrids() {
    if (!this.grids) {
      this.grids = [];
      for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
          this.grids.push(this.sameSubGridAs(new Cell(i, j)));
        }
      }
    }

    return this.grids;
  }

  columns() {
    if (!this._columns) {
      this._columns = [];
      for (let i = 0; i < 9; i++) {
        this._columns.push([]);
      }
      this.rows.forEach(function(row) {
        row.forEach(function(cell, idx) {
          this._columns[idx].push(cell);
        }, this);
      }, this);
    }

    return this._columns;
  }

  sameRowAs(cell) {
    return this.rows[cell.row];
  }

  sameColAs(cell) {
    return this.columns()[cell.col];
  }

  sameSubGridAs(cell) {
    /*
            Get all the cells in the same "sub grid" as the given cell. e.g.
            for the cell "c" below the cells in the "same_sub_grid" (which are
            marked x below) are returned along with the argument cell.

            x x x | . . . | . . .
            x c x | . . . | . . .
            x x x | . . . | . . .
            ------+-------+------
            . . . | . . . | . . .
            . . . | . . . | . . .
            . . . | . . . | . . .
            ------+-------+------
            . . . | . . . | . . .
            . . . | . . . | . . .
            . . . | . . . | . . .
        */

    // row:
    // 0 - 2 -> 0
    // 3 - 5 -> 3
    // 6 - 8 -> 5

    // col:
    // same as above
    if (!cell.subgrid) {
      let index = function(x) {
        if (x <= 2) {
          return 0;
        } else if (x <= 5) {
          return 3;
        } else {
          return 6;
        }
      };

      let startRow = index(cell.row),
        startCol = index(cell.col),
        subgrid = [];
      for (let i = startRow; i < startRow + 3; i++) {
        let row = this.rows[i],
          subGridRow = [];
        for (let j = startCol; j < startCol + 3; j++) {
          subGridRow.push(row[j]);
        }

        subgrid.push(subGridRow);
      }
      cell.subgrid = subgrid;
    }

    return cell.subgrid;
  }

  unsolved() {
    return this.rows.flatten().filter(c => c.value === 0);
  }

  isSolved() {
    return !this.rows.flatten().some(x => x.value === 0);
  }

  peers(cell) {
    /*
            Get the peers for the cell.  The peers for the cell "c" are pictorially
            represented below by the cells marked "x"

            x x x | . . . | . . .
            x c x | x x x | x x x
            x x x | . . . | . . .
            ------+-------+------
            . x . | . . . | . . .
            . x . | . . . | . . .
            . x . | . . . | . . .
            ------+-------+------
            . x . | . . . | . . .
            . x . | . . . | . . .
            . x . | . . . | . . .
        */
    if (!cell.peers) {
      cell.peers = Array.from(
        new Set(
          this.sameColAs(cell)
            .concat(this.sameRowAs(cell))
            .concat(this.sameSubGridAs(cell).flatten())
            .filter(x => x !== cell)
        )
      );
    }

    return cell.peers;
  }

  toFlatString() {
    return this.rows
      .flatten()
      .map(x => x.toString())
      .join("");
  }
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// These are a couple of useful map functions, pulling them up here
// speeds things up.
const valueOfCell = cell => cell.value,
  possibleValuesOfCell = cell => cell.possibleValues;

// filter unsolved cells out of a list cells.
const isUnsolved = cell => cell.value === 0;

class Solver {
  constructor(grid) {
    this.grid = grid;
    this.guesses = 0;
    this._solvedCells = [];
  }

  solve() {
    // work out what the set of possible values is for each unsolve cell.
    this._initPossibleValues();
    // if there are any with only one possible value, set it.
    this._findCellsWithOnePossibleValue();
    // find any cells that have a possible value that doesn't occur
    // anywhere else in the column, row or subgrid it's in
    this._findUniqueValuesInUnits();
    if (!this.grid.isSolved()) {
      // this is a more tricky puzzle, so start searching for a solution.
      this._search();
    }
  }

  _search() {
    // pick the cell with least possible values (more chance of guessing correctly)
    const cell = this.grid.unsolved().sort((x, y) => {
      const xVal = x.possibleValues.length * 100 + (x.row + x.col),
        yVal = y.possibleValues.length * 100 + (y.row + y.col);

      return xVal - yVal;
    })[0];

    for (let value of cell.possibleValues) {
      // remember how many cells we had solved before we begin incase
      // we need to unwind
      let numSolved = this._solvedCells.length;
      this.guesses += 1;

      try {
        this._setValueForCell(cell, value);
        if (!this.grid.isSolved()) {
          // no luck, keep looking...
          this._search();
        }
      } catch (inconsistency) {
        // here's the back tracking part, we've ended up in a position where we
        // can't progress, so before we try another value, undo all the values
        // we set since the last guess.
        let resetPossibilities = [];
        this._solvedCells
          .splice(numSolved, this._solvedCells.length - numSolved)
          .forEach(cell => {
            cell.value = 0;
            resetPossibilities.push(cell);
            resetPossibilities = resetPossibilities.concat(
              this.grid.peers(cell)
            );
          }, this);

        this._initPossibleValues(
          new Set(resetPossibilities.filter(isUnsolved))
        );
      }
    }
    if (!this.grid.isSolved()) {
      // If we get here then we're also stuck since we haven't found a solution despite trying
      // all possible values for a cell.
      throw "Tried all values for this cell  [" +
        cell.row +
        ", " +
        cell.col +
        "]" +
        cell.possibleValues;
    }
  }

  _initPossibleValues(cells) {
    /*
            Initialise the possible values for the provided list of cells or
            all the unsolved cells in the grid if no list was provided.

            To do this we collect the "peers" for each cell (cells not marked . for the cell c):

            x x x | . . . | . . .
            5 c x | x x 2 | x 9 x
            x x 3 | . . . | . . .
            ------+-------+------
            . x . | . . . | . . .
            . x . | . . . | . . .
            . x . | . . . | . . .
            ------+-------+------
            . x . | . . . | . . .
            . 7 . | . . . | . . .
            . x . | . . . | . . .

            Remove from the peers any unsolved cells, then exclude from the list 1..9 any
            numbers already present in the list of solved peers. e.g. in the above grid assuming
            that any cell containing an x or a number is a peer of c and that the cells containing
            the numbers are solved then the possible values for "c" are:

            [1, 2, 3, 4, 5, 6, 7, 8, 9] - [5, 3, 2, 9, 7] = [8, 1, 4, 6]
        */
    (cells || this.grid.unsolved()).forEach(cell => {
      let peerValues = this.grid.peers(cell).map(valueOfCell),
        possibleValues = DIGITS.filter(d => peerValues.indexOf(d) === -1);
      cell.possibleValues = possibleValues;
    });
  }

  _removeValueFromPeers(cell) {
    // Summary:
    //  Remove the value of cell from the possible values of
    //  it's peers.
    this.grid
      .peers(cell)
      .filter(isUnsolved)
      .forEach(p => {
        const idx = p.possibleValues.indexOf(cell.value);
        if (idx !== -1) {
          p.possibleValues.splice(idx, 1);
        }

        if (p.possibleValues.length === 0) {
          throw "No possible values for cell [" +
            p.row +
            ", " +
            p.col +
            "] " +
            p.value;
        }
      });
  }

  _setValueForCell(cell, value) {
    const peers = this.grid.peers(cell);

    if (peers.some(x => x.value === value)) {
      throw "Tried to set a value that already exists in peers";
    }

    cell.value = value;
    cell.possibleValues = [];
    this._solvedCells.push(cell);
    this._removeValueFromPeers(cell);
    this._findCellsWithOnePossibleValue(peers);
    this._findUniqueValuesInUnits(cell);
  }

  _findCellsWithOnePossibleValue(cells) {
    cells = cells || this.grid.unsolved();
    cells.forEach(cell => {
      if (cell.value === 0 && cell.possibleValues.length === 1) {
        this._setValueForCell(cell, cell.possibleValues[0]);
      }
    });
  }

  _findUniqueValuesInUnits(cell) {
    if (cell) {
      [
        this.grid.sameSubGridAs(cell).flatten(),
        this.grid.sameColAs(cell),
        this.grid.sameRowAs(cell)
      ].forEach(this._findUniquePossibiltyInUnit, this);
    } else {
      let subGrids = this.grid.subgrids().map(sg => sg.flatten());

      for (let units of [subGrids, this.grid.columns(), this.grid.rows]) {
        for (let unit of units) {
          this._findUniquePossibiltyInUnit(unit);
        }
      }
    }
  }

  _findUniquePossibiltyInUnit(unit) {
    let unsolved = unit.filter(isUnsolved);
    unsolved.forEach(unsolvedCell => {
      let unique,
        otherCellsPossValues = unit
          .filter(c => c !== unsolvedCell && isUnsolved(c))
          .map(possibleValuesOfCell)
          .flatten();
      //.reduce((a, b) => a.concat(b));

      unique = unsolvedCell.possibleValues.filter(
        x => otherCellsPossValues.indexOf(x) === -1
      );
      if (unique.length === 1) {
        this._setValueForCell(unsolvedCell, unique[0]);
      }
    });
  }
}

export default Grid;