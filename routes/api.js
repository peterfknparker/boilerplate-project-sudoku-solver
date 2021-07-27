"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {
		let { puzzle, coordinate, value } = req.body;

		if (!puzzle || !coordinate || !value) {
			return res.json({ error: "Required field(s) missing" });
		}

		let puzzleValidationError = solver.validate(puzzle).error;

		if (puzzleValidationError) {
			return res.json({ error: puzzleValidationError });
		}

		if (!coordinate.match(/[a-i][1-9]/gi)) {
			return res.json({ error: "Invalid coordinate" });
		}

		if (!value.match(/^[1-9]$/g)) {
			return res.json({ error: "Invalid value" });
		}

		let conflict = [];

		let row = coordinate[0],
			column = coordinate[1];

		let checkColError = solver.checkColPlacement(
			puzzle,
			row,
			column,
			value
		).error;
		if (checkColError) {
			conflict.push(checkColError);
		}
		let checkRowError = solver.checkRowPlacement(
			puzzle,
			row,
			column,
			value
		).error;
		if (checkRowError) {
			conflict.push(checkRowError);
		}
		let checkRegionError = solver.checkRegionPlacement(
			puzzle,
			row,
			column,
			value
		).error;
		if (checkRegionError) {
			conflict.push(checkRegionError);
		}

		if (conflict.length !== 0) {
			res.json({ valid: false, conflict: conflict });
		} else {
			res.json({ valid: true });
		}
	});

	app.route("/api/solve").post((req, res) => {
		let { puzzle } = req.body;

		if (!puzzle) {
			return res.json({ error: "Required field missing" });
		}

		let solveSolution = solver.solve(puzzle);
		let solveError = solveSolution.error;
		if (solveError) {
			return res.json({ error: solveError });
		} else {
			return res.json({ solution: solveSolution });
		}
	});
};
