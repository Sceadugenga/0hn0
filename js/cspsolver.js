function CspSolver(variables, constraints) {
	this.variables = variables;
	this.constraints = constraints;
}


CspSolver.prototype.getVariables = function() {
	return this.variables;
};


CspSolver.prototype.getConstraints = function() {
	return this.constraints;
};


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