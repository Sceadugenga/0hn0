$("#solveButton").click(function() {
	var solver = Create0hn0CspSolver(window.Game.grid);
	window.cspVisualizer = new CspVisualizer(solver.getVariables());
	var t0 = performance.now();
	solver.solve();
	var t1 = performance.now();
	$("#solveBar").hide();
	console.log("Solve took " + (t1 - t0) + " milliseconds.");
	console.log("Solve took " + window.cspVisualizer.length() + " steps.");
	setTimeout(function() { window.cspVisualizer.play(); }, 10);
});





function Create0hn0CspSolver(grid) {
	var tileVariablesGrid = new Array(grid.width);
	var variables = [];
	var constraints = [];
	for (var x = 0; x < grid.width; x++) {
		tileVariablesGrid[x] = new Array(grid.width);
		for (var y = 0; y < grid.width; y++) {
			tileVariablesGrid[x][y] = new CspTileVariable(grid.tile(x,y), x, y);
			variables[variables.length] = tileVariablesGrid[x][y];
		}
	}
	// Create constraints. All variables need to be created before this.
	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.width; y++) {
			if (grid.tile(x,y).type === Tile.Type.Value) {
				constraints[constraints.length] = 
					new CspSumConstraint(tileVariablesGrid, x, y, grid.tile(x,y).value);
			}
		}
	}
	
	return new CspSolver(variables, constraints);
}