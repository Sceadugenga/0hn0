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
		// The rest of the variables is sorted according to the most restricted domain and 
		// most constrained first heuristics.
		var domDiff =  a.getDomain().length - b.getDomain().length;
		return (domDiff == 0 ? b.getConstraints().length - a.getConstraints().length : domDiff); 
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
		if (variable.getConstraints().some(function(c) { return !c.isSatisfied(); })) {
			continue;
		}
		var forwardCheckResult = this.__doForwardChecking(indexToAssign);
		if (forwardCheckResult.success) {
			if (this.__solve(indexToAssign+1)) {
				return true;
			}
		}
		this.__restoreDomains(forwardCheckResult.domainReductions);
	}
	variable.setValue(null);
	return false;
};


CspSolver.prototype.__doForwardChecking = function(indexOfLastAssigned) {
	var domainReductions = [];
	for (var i = indexOfLastAssigned + 1; i < this.variables.length; i++) {
		var domainReduction = this.__reduceVariableDomain(i);
		domainReductions = domainReductions.concat(domainReduction);
		if (this.variables[i].getDomain().length == 0) {
			console.log("fw pruned");
			return {success: false, domainReductions: domainReductions};
		}
	}
	return {success: true, domainReductions: domainReductions};
}


CspSolver.prototype.__reduceVariableDomain = function(i) {
	var variable = this.variables[i];
	var domain = variable.getDomain();
	var newDomain = [];
	var domainReduction = [];
	for (var id in domain) {
		variable.setValue(domain[id]);
		if (variable.getConstraints().some(function(c) { return !c.isSatisfied(); })) {
			domainReduction[domainReduction.length] = [variable, domain[id]];
		} else {
			newDomain[newDomain.length] = domain[id];
		}
		variable.setValue(null);
	}
	variable.setDomain(newDomain);
	return domainReduction;
}


CspSolver.prototype.__restoreDomains = function(domainReductions) {
	for (var i = 0; i < domainReductions.length; i++) {
		var domain = domainReductions[i][0].getDomain();
		domain[domain.length] = domainReductions[i][1];
	}
}