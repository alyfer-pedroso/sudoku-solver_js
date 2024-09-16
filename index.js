let validating = false;
const gridSize = 9;

document.addEventListener("DOMContentLoaded", () => {
  const solveButton = document.getElementById("solve-btn");
  const validateButton = document.getElementById("validate-btn");
  const generateButton = document.getElementById("generate-btn");

  solveButton.addEventListener("click", solveSudoku);
  validateButton.addEventListener("click", validateSudoku);
  generateButton.addEventListener("click", generateRandomSudoku);

  const sudokuGrid = document.getElementById("sudoku-grid");

  for (let row = 0; row < gridSize; row++) {
    const newRow = document.createElement("tr");
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.className = "cell";
      input.id = `cell-${row}-${col}`;
      cell.appendChild(input);
      newRow.appendChild(cell);
    }
    sudokuGrid.appendChild(newRow);
  }
});

async function generateRandomSudoku() {
  if (validating) return;

  const sudokuArray = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

  handleActiveButtons();

  if (solveSudokuHelper(sudokuArray)) {
    const cellsToRemove = 40;

    let count = 0;
    while (count < cellsToRemove) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (sudokuArray[row][col] !== 0) {
        sudokuArray[row][col] = 0;
        count++;
      }
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (cell.classList.contains("solved")) {
          cell.classList.remove("solved");
        }

        if (sudokuArray[row][col] !== 0) {
          cell.value = sudokuArray[row][col];
          cell.classList.add("user-input");
          await sleep(20);
        } else {
          cell.value = "";
          cell.classList.remove("user-input");
        }
      }
    }
  } else {
    alert("Erro ao gerar um Sudoku solucionável.");
  }

  handleActiveButtons();
}

async function solveSudoku() {
  if (validating) return;

  const sudokuArray = [];
  handleActiveButtons();

  for (let row = 0; row < gridSize; row++) {
    sudokuArray[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cellValue = document.getElementById(cellId).value;
      sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
    }
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cell = document.getElementById(cellId);

      if (sudokuArray[row][col] !== 0) {
        cell.classList.add("user-input");
      }
    }
  }

  if (solveSudokuHelper(sudokuArray)) {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (!cell.classList.contains("user-input")) {
          cell.value = sudokuArray[row][col];
          cell.classList.add("solved");
          await sleep(20);
        }
      }
    }
  } else {
    alert("Não existe solução para este Sudoku.");
  }

  handleActiveButtons();
}

function solveSudokuHelper(board) {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudokuHelper(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }

  return true;
}

function isValidMove(board, row, col, num) {
  for (let i = 0; i < gridSize; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function validateSudoku() {
  const sudokuArray = [];

  if (validating) return;

  for (let row = 0; row < gridSize; row++) {
    sudokuArray[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cellId = `cell-${row}-${col}`;
      const cellValue = document.getElementById(cellId).value;
      sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
    }
  }

  isValidSudoku(sudokuArray) ? alert("Esse Sudoku é valido") : alert("Esse Sudoku não é valido");
}

function isValidSudoku(board) {
  for (let row = 0; row < gridSize; row++) {
    if (!isValidSet(board[row])) {
      return false;
    }
  }

  for (let col = 0; col < gridSize; col++) {
    const column = [];
    for (let row = 0; row < gridSize; row++) {
      column.push(board[row][col]);
    }
    if (!isValidSet(column)) {
      return false;
    }
  }

  for (let row = 0; row < gridSize; row += 3) {
    for (let col = 0; col < gridSize; col += 3) {
      const block = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          block.push(board[row + i][col + j]);
        }
      }
      if (!isValidSet(block)) {
        return false;
      }
    }
  }

  return true;
}

function isValidSet(numbers) {
  const seen = new Set();
  for (const num of numbers) {
    if (num !== 0) {
      if (seen.has(num)) {
        return false;
      }
      seen.add(num);
    }
  }
  return true;
}

function handleActiveButtons() {
  const generateButton = document.getElementById("generate-btn");
  const solveButton = document.getElementById("solve-btn");
  const validateButton = document.getElementById("validate-btn");

  if (validating) {
    generateButton.disabled = false;
    solveButton.disabled = false;
    validateButton.disabled = false;
    validating = false;
    return;
  }

  generateButton.disabled = true;
  solveButton.disabled = true;
  validateButton.disabled = true;
  validating = true;
}
