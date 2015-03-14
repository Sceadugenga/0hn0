$("#solveButton").click(function() {
	$(this).hide();
	window.cspVisualizer = new CspVisualizer();
	var solver = Create0hn0CspSolver(window.Game.grid);
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





function CspTileVariable(renderTile, x, y) {
	this.domain = ["BLUE", "RED"];
	this.renderTile = renderTile;
	this.x = x;
	this.y = y;
	this.constraints = [];

	switch (renderTile.type) {
		case Tile.Type.Dot:
		case Tile.Type.Value:
			this.value = "BLUE";
			break;
		case Tile.Type.Wall:
			this.value = "RED";
			break;
		default:
			this.value = null;
			break;
	}
}	


CspTileVariable.prototype.getDomain = function() {
	return this.domain;
};


CspTileVariable.prototype.setValue = function(value) {
	this.value = value;
	window.cspVisualizer.addEvent(this.renderTile, value);
};


CspTileVariable.prototype.getValue = function() {
	return this.value;
};


CspTileVariable.prototype.getConstraints = function() {
	return this.constraints;
};


CspTileVariable.prototype.registerConstraint = function(constraint) {
	this.constraints[this.constraints.length] = constraint;
}





function CspSumConstraint(tileVariablesGrid, centerX, centerY, desiredSum) {
	this.grid = tileVariablesGrid;
	this.centerX = centerX;
	this.centerY = centerY;
	this.desiredSum = desiredSum;
	
	for (var i = 0; i < tileVariablesGrid.length; i++) {
		tileVariablesGrid[centerX][i].registerConstraint(this);
		tileVariablesGrid[i][centerY].registerConstraint(this);
	}
}


CspSumConstraint.prototype.isSatisfied = function() {
	// Constraint is satisfied if the middle dot doesn't directly (without any unknowns or reds in the way)
    // see more blue dots than it should and it is also possible to see the expected number (counting whites too now).
	var minVisible = 0;
	var maxVisible = 0;
	var emptyEncountered;
	
	function processTile(tile) {
		if (tile.getValue() === "RED") {
			return false;
		}
		if (tile.getValue() === null) {
			emptyEncountered = true;
		}
			
		maxVisible++;
		minVisible = emptyEncountered ? minVisible : minVisible + 1;
		return true;
	}
	
	emptyEncountered = false;
	for (var i = this.centerX + 1; i < this.grid.length; i++) {
		if(!processTile(this.grid[i][this.centerY])) {
			break;
		}
	}
	emptyEncountered = false;
	for (var i = this.centerX - 1; i > -1; i--) {
		if(!processTile(this.grid[i][this.centerY])) {
			break;
		}
	}
	emptyEncountered = false;
	for (var i = this.centerY + 1; i < this.grid.length; i++) {
		if(!processTile(this.grid[this.centerX][i])) {
			break;
		}
	}
	emptyEncountered = false;
	for (var i = this.centerY - 1; i > -1; i--) {
		if(!processTile(this.grid[this.centerX][i])) {
			break;
		}
	}
	
	return minVisible <= this.desiredSum && this.desiredSum <= maxVisible;
}





function CspSolver(variables, constraints) {
	this.variables = variables;
	this.constraints = constraints;
}


CspSolver.prototype.solve = function() {
	this.variables.sort(function(a, b) {
		// Already assigned variables should be first. The following ensures it.
		if (a.getValue() === null && b.getValue() !== null) {
			return 1;
		} else if (a.getValue() !== null && b.getValue() === null) {
			return -1;
		}
		// The rest of the variables is sorted according to the most constrained first heuristics.
		return a.getConstraints().length - b.getConstraints().length; 
	});
	
	var startIndex = this.variables.reduce(
		function(total,x){return x.getValue() !== null ? total+1 : total}, 0);
	this.__solve(startIndex);
};


CspSolver.prototype.__solve = function(indexToAssign) {
	if (indexToAssign == this.variables.length) {
		return true;
	}
	var variable = this.variables[indexToAssign];
	var domain = variable.getDomain();
	for (var id in domain) {
		variable.setValue(domain[id]);
		if (!variable.getConstraints().some(function(c) { return !c.isSatisfied(); })) {
			if (this.__solve(indexToAssign+1)) {
				return true;
			}
		}
	}
	variable.setValue(null);
	return false;
};