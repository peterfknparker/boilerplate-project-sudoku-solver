const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
	test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle:
					"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
			})
			.end(function (err, res) {
				assert.equal(
					res.body.solution,
					"135762984946381257728459613694517832812936745357824196473298561581673429269145378",
					"Solve a puzzle with a valid puzzle string"
				);
			});
		done();
	});

	test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({})
			.end(function (err, res) {
				assert.equal(
					res.body.error,
					"Required field missing",
					"Solve a puzzle with missing puzzle string: POST request to /api/solve"
				);
			});
		done();
	});

	test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle:
					"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37j",
			})
			.end(function (err, res) {
				assert.equal(
					res.body.error,
					"Invalid characters in puzzle",
					"Solve a puzzle with invalid characters: POST request to /api/solve"
				);
			});
		done();
	});

	test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle:
					"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37",
			})
			.end(function (err, res) {
				assert.equal(
					res.body.error,
					"Expected puzzle to be 81 characters long",
					"Solve a puzzle with incorrect length: POST request to /api/solve"
				);
			});
		done();
	});

	test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
		chai
			.request(server)
			.post("/api/solve")
			.send({
				puzzle:
					"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....1111111111",
			})
			.end(function (err, res) {
				assert.equal(
					res.body.error,
					"Puzzle cannot be solved",
					"Solve a puzzle that cannot be solved: POST request to /api/solve"
				);
			});
		done();
	});

	test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "B1",
				value: "7",
			})
			.end(function (err, res) {
				assert.equal(
					res.body.valid,
					true,
					"Check a puzzle placement with all fields: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "B1",
				value: "3",
			})
			.end(function (err, res) {
				assert.equal(
					res.body.conflict,
					"column",
					"Check a puzzle placement with single placement conflict: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "E1",
				value: "4",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.conflict,
					["column", "region"],
					"Check a puzzle placement with nultiple placement conflicts: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "B1",
				value: "9",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.conflict,
					["column", "row", "region"],
					"Check a puzzle placement with all placement conflicts: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "B1",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.error,
					"Required field(s) missing",
					"Check a puzzle placement with missing required fields: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157......0......53..4...96.415..81..7632..3...28.51",
				coordinate: "B1",
				value: "9",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.error,
					"Invalid characters in puzzle",
					"Check a puzzle placement with invalid characters: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157...............53..4...96.415..81..7632..3...28.51",
				coordinate: "B1",
				value: "9",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.error,
					"Expected puzzle to be 81 characters long",
					"Check a puzzle placement with incorrect length: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "Z1",
				value: "9",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.error,
					"Invalid coordinate",
					"Check a puzzle placement with invalid placement coordinate: POST request to /api/check"
				);
			});
		done();
	});
	test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
		chai
			.request(server)
			.post("/api/check")
			.send({
				puzzle:
					"82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51",
				coordinate: "A1",
				value: "J",
			})
			.end(function (err, res) {
				assert.deepEqual(
					res.body.error,
					"Invalid value",
					"Check a puzzle placement with invalid placement value: POST request to /api/check"
				);
			});
		done();
	});
});
