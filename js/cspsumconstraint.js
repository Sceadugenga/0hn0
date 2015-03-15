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
