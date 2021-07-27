class SudokuSolver {
	validate(puzzleString) {
		if (puzzleString.length !== 81) {
			return { error: "Expected puzzle to be 81 characters long" };
		}
		if (puzzleString.match(/[\.*1-9*]{81}/g)) {
			return "Valid input string";
		} else {
			return { error: "Invalid characters in puzzle" };
		}
	}

	checkRowPlacement(puzzleString, row, column, value) {
		let board = createBoard(puzzleString);
		value = parseInt(value);
		row = getRowFromCoordinates(row);

		if (board[row][column - 1] === value) {
			return { valid: true };
		}

		if (board[row].indexOf(value) !== -1) {
			return { error: "row" };
		} else {
			return { valid: true };
		}
	}

	checkColPlacement(puzzleString, row, column, value) {
		let board = createBoard(puzzleString);
		let n = Math.sqrt(puzzleString.length);
		value = parseInt(value);
		row = getRowFromCoordinates(row);
		column = column - 1;

		if (board[row][column] === value) {
			return { valid: true };
		}
		for (let r = 0; r < n; r++) {
			if (board[r][column] === value) {
				return { error: "column" };
			}
		}
		return { valid: true };
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		let board = createBoard(puzzleString);
		let regionSize = Math.sqrt(Math.sqrt(puzzleString.length));
		row = getRowFromCoordinates(row);
		value = parseInt(value);

		if (board[row][column - 1] === value) {
			return { valid: true };
		}
		// work out starting row and column for each region (0,3,9 etc)
		row = row - (row % regionSize);
		column = column - 1 - ((column - 1) % regionSize);

		// the loop through each column and row in the region and check values against arguement given

		for (let i = row; i < row + regionSize; i++) {
			for (let j = column; j < column + regionSize; j++) {
				if (board[i][j] === value) {
					return { error: "region" };
				}
			}
		}
		return { valid: true };
	}
	solve(puzzleString) {
		let validateError = this.validate(puzzleString).error;
		if (validateError) {
			return { error: validateError };
		}
		//from:https://www.geeksforgeeks.org/sudoku-backtracking-7/
		/* A Backtracking program in
Javascript to solve Sudoku problem */

		function isSafe(board, row, col, num) {
			// Row has the unique (row-clash)
			for (let d = 0; d < board.length; d++) {
				// Check if the number we are trying to
				// place is already present in
				// that row, return false;
				if (board[row][d] == num) {
					return false;
				}
			}

			// Column has the unique numbers (column-clash)
			for (let r = 0; r < board.length; r++) {
				// Check if the number
				// we are trying to
				// place is already present in
				// that column, return false;
				if (board[r][col] == num) {
					return false;
				}
			}

			// Corresponding square has
			// unique number (box-clash)
			let sqrt = Math.floor(Math.sqrt(board.length));
			let boxRowStart = row - (row % sqrt);
			let boxColStart = col - (col % sqrt);

			for (let r = boxRowStart; r < boxRowStart + sqrt; r++) {
				for (let d = boxColStart; d < boxColStart + sqrt; d++) {
					if (board[r][d] == num) {
						return false;
					}
				}
			}

			// If there is no clash, it's safe
			return true;
		}

		function solveSudoku(board, n) {
			let row = -1;
			let col = -1;
			let isEmpty = true;
			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) {
					if (board[i][j] == ".") {
						row = i;
						col = j;

						// We still have some remaining
						// missing values in Sudoku
						isEmpty = false;
						break;
					}
				}
				if (!isEmpty) {
					break;
				}
			}

			// No empty space left
			if (isEmpty) {
				return true;
			}

			// Else for each-row backtrack
			for (let num = 1; num <= n; num++) {
				if (isSafe(board, row, col, num)) {
					board[row][col] = num;
					if (solveSudoku(board, n)) {
						// print(board, n);
						return true;
					} else {
						// Replace it
						board[row][col] = ".";
					}
				}
			}
			return false;
		}

		function print(board, N) {
			// We got the answer, just print it
			for (let r = 0; r < N; r++) {
				for (let d = 0; d < N; d++) {
					document.write(board[r][d]);
					document.write(" ");
				}
				document.write("<br>");

				if ((r + 1) % Math.floor(Math.sqrt(N)) == 0) {
					document.write("");
				}
			}
		}

		let board = createBoard(puzzleString);

		let N = board.length;

		if (solveSudoku(board, N)) {
			// Print solution
			let output = "";
			board.map((number) => {
				number.map((int) => {
					output += "" + int;
				});
			});
			return output;
		} else {
			return { error: "Puzzle cannot be solved" };
		}

		// This code is contributed by avanitrachhadiya2155
	}
}

module.exports = SudokuSolver;

function createBoard(puzzleString) {
	// Separate string into Array and convert to integers

	let puzzleStringArray = Array.from(puzzleString).map((number) => {
		if (number == ".") {
			return number;
		}
		return parseInt(number);
	});

	// Get square root of puzzle length to calculate number of rows and columns

	let numbersPerLine = Math.sqrt(puzzleStringArray.length);

	// Make nested array for each row

	let numbersGrid = [];

	for (let i = 0; i < numbersPerLine; i++) {
		numbersGrid.push(puzzleStringArray.splice(0, numbersPerLine));
	}
	return numbersGrid;
}

function getRowFromCoordinates(coords) {
	switch (coords[0]) {
		case "A":
			return 0;
		case "B":
			return 1;
		case "C":
			return 2;
		case "D":
			return 3;
		case "E":
			return 4;
		case "F":
			return 5;
		case "G":
			return 6;
		case "H":
			return 7;
		case "I":
			return 8;
	}
}
