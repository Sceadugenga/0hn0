// Plays the events at the selected interval.
// It would also be cool to add scrollbar but that would be just an eye candy.

function CspVisualizer() {
	this.events = [];
	this.i = 0;
}


CspVisualizer.prototype.addEvent = function(tile, value) {
	this.events[this.events.length] = [tile, value];
};


CspVisualizer.prototype.play = function() {
	if (this.i >= this.events.length) {
		return;
	}	
	
	var delay = parseInt($("#solveDelay option:selected").val());
	
	var context = this; 
	setTimeout(function() {
		context.__render();
		context.i++;
		context.play();
	}, delay);
}


CspVisualizer.prototype.stop = function() {
	this.i = this.events.length;
}


CspVisualizer.prototype.__render = function() {
	if (this.events[this.i][1] == "BLUE") {
		this.events[this.i][0].dot();
	} else if (this.events[this.i][1] == "RED") {
		this.events[this.i][0].wall();
	} else {
		this.events[this.i][0].unknown();
	}
}