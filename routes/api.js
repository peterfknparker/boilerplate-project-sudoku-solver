"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {
		let { puzzle, coordinate, value } = req.body;

		if (!puzzle || !coordinate || !value) {
			return res.json({ error: "Required field(s) missing" });
		}

		try {
			solver.validate(puzzle);
		} catch (error) {
			return res.json({ error: error.message });
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

		try {
			solver.checkColPlacement(puzzle, row, column, value);
		} catch (error) {
			conflict.push(error.message);
		}
		try {
			solver.checkRowPlacement(puzzle, row, column, value);
		} catch (error) {
			conflict.push(error.message);
		}
		try {
			solver.checkRegionPlacement(puzzle, row, column, value);
		} catch (error) {
			conflict.push(error.message);
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

		try {
			return res.json({ solution: solver.solve(puzzle) });
		} catch (error) {
			return res.json({ error: error.message });
		}
	});
};
