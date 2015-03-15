// Plays the events at the selected interval.

function CspVisualizer(variables) {
	this.events = [];
	this.i = 0;
	this.variables = variables;
}


CspVisualizer.prototype.addEvent = function(tile, value) {
	this.events[this.events.length] = [tile, value];
};


CspVisualizer.prototype.play = function() {
	if (this.i >= this.events.length) {
		return;
	}	
	
	var delay = parseInt($("#solveDelay option:selected").val());
	
	if (delay == 0) {
		this.__showFinalAssignment();
	} else {
		var context = this; 
		setTimeout(function() {
			context.__render(context.events[context.i][0], context.events[context.i][1]);
			context.i++;
			context.play();
		}, delay);
	}
}


CspVisualizer.prototype.stop = function() {
	this.i = this.events.length - 1;
}


CspVisualizer.prototype.length = function() {
	return this.events.length;
}


CspVisualizer.prototype.__render = function(tile, value) {
	if (value == "BLUE") {
		tile.dot();
	} else if (value == "RED") {
		tile.wall();
	} else {
		tile.unknown();
	}
}


CspVisualizer.prototype.__showFinalAssignment = function() {
	for (var i = 0; i < this.variables.length; i++) {
		if (this.variables[i].getRenderTile().type !== Tile.Type.Value) {
			this.__render(this.variables[i].getRenderTile(), this.variables[i].getValue());
		}			
	}
}