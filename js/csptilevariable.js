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