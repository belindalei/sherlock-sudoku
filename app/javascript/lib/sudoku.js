import generator from "sudoku"; 

export const generateSudoku = () => {
  //e + 1 because the NPM library only goes 0-8 instead of 1-9
  const raw = generator.makepuzzle();
  const rawSolution = generator.solvepuzzle(raw);

  const formatted = raw.map(e => (e === null ? null : e + 1));
  const formattedSolution = rawSolution.map(e => e + 1);

  const result = {
    rows: [],
    solution: formattedSolution,
    startTime: new Date(),
    solvedTime: null,
  };

  for (let i = 0; i < 9; i++) {
    const row = { cols: [], index: i };
    for (let j = 0; j < 9; j++) {
      const value = formatted[i + 9 + j];
      const col = {
        row: i,
        col: j,
        value: value,
        readonly: value !== null //prefilled fill
      };
      row.cols.push(col);
    }
    result.rows.push(row);
  }
  return result;
};

export const checkSolution = sudoku => {
  const candidate = sudoku.rows
    .map(row => row.cols.map(col => col.value))
    .flat();

  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] === null || candidate[i] !== sudoku.solution[i]) {
      return false;
    }
  }
  return true;
};
