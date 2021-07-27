const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
	test("Logic handles a valid puzzle string of 81 characters", function (done) {
		assert.equal(
			solver.validate(
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
			),
			"Valid input string",
			"Valid Input String"
		);

		done();
	});

	test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function (done) {
		assert.deepEqual(
			solver.validate(
				"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a"
			),
			{ error: "Invalid characters in puzzle" },
			"Invalid characters in puzzle"
		);

		done();
	});

	test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
		assert.deepEqual(
			solver.validate(
				"4..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
			),
			{ error: "Expected puzzle to be 81 characters long" },
			"Incorrect puzzle length"
		);
		done();
	});

	test("Logic handles valid row placement", function (done) {
		assert.deepEqual(
			solver.checkRowPlacement(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				"A",
				"3",
				"3"
			),
			{ valid: true },
			"Logic handles valid row placement"
		);
		done();
	});

	test("Logic handles an invalid row placement", function (done) {
		assert.deepEqual(
			solver.checkRowPlacement(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				"A",
				"3",
				"8"
			),
			{ error: "row" },
			"Logic handles an invalid row placement"
		);
		done();
	});

	test("Logic handles valid column placement", function (done) {
		assert.deepEqual(
			solver.checkColPlacement(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				"A",
				"3",
				"5"
			),
			{ valid: true },
			"Logic handles valid column placement"
		);
		done();
	});

	test("Logic handles an invalid column placement", function (done) {
		assert.deepEqual(
			solver.checkColPlacement(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				"B",
				"1",
				"8"
			),
			{ error: "column" },
			"Logic handles an invalid column placement"
		);
		done();
	});

	test("Logic handles a valid region (3x3 grid) placement", function (done) {
		assert.deepEqual(
			solver.checkRegionPlacement(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				"A",
				"3",
				"5"
			),
			{ valid: true },
			"Logic handles valid region placement"
		);
		done();
	});

	test("Logic handles an invalid region (3x3 grid) placement", function (done) {
		assert.deepEqual(
			solver.checkRegionPlacement(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				"A",
				"3",
				"8"
			),
			{ error: "region" },
			"Logic handles invalid region placement"
		);
		done();
	});

	test("Valid puzzle strings pass the solver", function (done) {
		assert.equal(
			solver.solve(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"
			),
			"827549163531672894649831527496157382218396475753284916962415738185763249374928651",
			"Successful solve"
		);
		done();
	});

	test("Invalid puzzle strings fail the solver", function (done) {
		assert.deepEqual(
			solver.solve(
				"1111a2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.371"
			),
			{ error: "Invalid characters in puzzle" },
			"Invalid puzzle strings fail the solver"
		);
		done();
	});

	test("Solver returns the expected solution for an incomplete puzzle", function (done) {
		assert.equal(
			solver.solve(
				"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"
			),
			"827549163531672894649831527496157382218396475753284916962415738185763249374928651",
			"Solver returns the expected solution for an incomplete puzzle"
		);
		done();
	});
});
