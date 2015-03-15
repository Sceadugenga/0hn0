$("#solveButton").click(function() {
	$(this).hide();
	window.cspVisualizer = new CspVisualizer();
	var solver = Create0hn0CspSolver(window.Game.grid);
	//TODO: add time measure and number of steps
	solver.solve();
	window.cspVisualizer.play();
	$(this).show();
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