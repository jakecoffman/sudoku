export function stringToGrid(string) {
  let arr
  if (!Array.isArray(string)) {
    arr = Array.from(string)
  } else {
    arr = string
  }
  const grid = []
  let jump = 0
  for (let i = 0; i < arr.length; i+=3) {
    grid.push([
      {digit: arr[i], cellIndex: 0, groupIndex: jump, pencil: []},
      {digit: arr[i+1], cellIndex: 1, groupIndex: jump, pencil: []},
      {digit: arr[i+2], cellIndex: 2, groupIndex: jump, pencil: []},

      {digit: arr[i+9], cellIndex: 3, groupIndex: jump, pencil: []},
      {digit: arr[i+1+9], cellIndex: 4, groupIndex: jump, pencil: []},
      {digit: arr[i+2+9], cellIndex: 5, groupIndex: jump, pencil: []},

      {digit: arr[i+18], cellIndex: 6, groupIndex: jump, pencil: []},
      {digit: arr[i+1+18], cellIndex: 7, groupIndex: jump, pencil: []},
      {digit: arr[i+2+18], cellIndex: 8, groupIndex: jump, pencil: []},
    ])
    jump++
    if (jump % 3 === 0) {
      i += 18
    }
  }
  return grid
}

export function gridToString(board) {
  // TODO figure out how to roll this loop
  return [
      [board[0][0], board[0][1], board[0][2],
      board[1][0], board[1][1], board[1][2],
      board[2][0], board[2][1], board[2][2]],

      [board[0][3], board[0][4], board[0][5],
      board[1][3], board[1][4], board[1][5],
      board[2][3], board[2][4], board[2][5]],

      [board[0][6], board[0][7], board[0][8],
      board[1][6], board[1][7], board[1][8],
      board[2][6], board[2][7], board[2][8]],

      // board+=3
      [board[3][0], board[3][1], board[3][2],
      board[4][0], board[4][1], board[4][2],
      board[5][0], board[5][1], board[5][2]],

      [board[3][3], board[3][4], board[3][5],
      board[4][3], board[4][4], board[4][5],
      board[5][3], board[5][4], board[5][5]],

      [board[3][6], board[3][7], board[3][8],
      board[4][6], board[4][7], board[4][8],
      board[5][6], board[5][7], board[5][8]],

      // board+=3
      [board[6][0], board[6][1], board[6][2],
      board[7][0], board[7][1], board[7][2],
      board[8][0], board[8][1], board[8][2]],

      [board[6][3], board[6][4], board[6][5],
      board[7][3], board[7][4], board[7][5],
      board[8][3], board[8][4], board[8][5]],

      [board[6][6], board[6][7], board[6][8],
      board[7][6], board[7][7], board[7][8],
      board[8][6], board[8][7], board[8][8]],
  ]
}

// sets error values on the grids
// most of these loops are O(n^2) or worse, but n is small so who cares?
export function setErrors(displayGrid, gridGrid) {
  // duplicates in the same group
  for (let group of displayGrid) {
    const digits = group.map(v => v.digit)
    for (let cell of group) {
      // also setting all errors to false, don't need to do this in later loops
      cell.error = false
      if (cell.digit === '0') {
        continue
      }
      if (digits.filter(v => v === cell.digit).length > 1) {
        cell.error = true
      }
    }
  }

  // duplicates in the same row
  for (let row of gridGrid) {
    const digits = row.map(v => v.digit)
    for (let cell of row) {
      if (cell.digit === '0') {
        continue
      }
      if (digits.filter(v => v === cell.digit).length > 1) {
        cell.error = true
      }
    }
  }

  // duplicates in the same column
  for (let row = 0; row < 9; row++) {
    const digits = []
    for (let column = 0; column < 9; column++) {
      digits.push(gridGrid[column][row].digit)
    }
    for (let column = 0; column < 9; column++) {
      const cell = gridGrid[column][row]
      if (cell.digit === '0') {
        continue
      }
      if (digits.filter(v => v === cell.digit).length > 1) {
        cell.error = true
      }
    }
  }
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function clearSuperfluousPencilMarks(selection, displayGrid, gridGrid) {
  for (let cell of displayGrid[selection.groupIndex]) {
    if (cell !== selection) {
      cell.pencil = cell.pencil.filter(v => v !== selection.digit)
    }
  }

  // find the column it's in
  let row = -1
  let column = -1
  out:
  for (let c = 0; c < 9; c++) {
    for (let r = 0; r < 9; r++) {
      if (gridGrid[r][c] === selection) {
        column = c
        row = r
        break out
      }
    }
  }

  for (let i = 0; i < 9; i++) {
    if (gridGrid[i][column] !== selection) {
      gridGrid[i][column].pencil = gridGrid[i][column].pencil.filter(v => v !== selection.digit)
    }
    if (gridGrid[row][i] !== selection) {
      gridGrid[row][i].pencil = gridGrid[row][i].pencil.filter(v => v !== selection.digit)
    }
  }
}

export function doAutoPencil(displayGrid, gridGrid) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  for (let group of displayGrid) {
    const takenDigits = group.map(v => v.digit).filter(v => v !== '0')
    const pencil = digits.filter(v => !takenDigits.includes(v))
    for (let cell of group) {
      cell.pencil = pencil
    }
  }

  for (let row of gridGrid) {
    const takenDigits = row.map(v => v.digit).filter(v => v !== '0')
    for (let cell of row) {
      cell.pencil = cell.pencil.filter(v => !takenDigits.includes(v))
    }
  }

  for (let row = 0; row < 9; row++) {
    const takenDigits = []
    for (let column = 0; column < 9; column++) {
      if (gridGrid[column][row].digit !== '0') {
        takenDigits.push(gridGrid[column][row].digit)
      }
    }
    for (let column = 0; column < 9; column++) {
      const cell = gridGrid[column][row]
      cell.pencil = cell.pencil.filter(v => !takenDigits.includes(v))
    }
  }
}
