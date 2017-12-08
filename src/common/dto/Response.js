module.exports = Response;

function Response() {
	this._errors = undefined;
	this._content = undefined;
}

Response.prototype.setErrors = function(errors) {
	this._errors = errors;
}

Response.prototype.addErrors = function(errors) {
	if (this._errors == undefined) {
		this._errors = new Array();
	}	
	
	if (Array.isArray(errors)) {
		this._errors = this._errors.concat(errors);
	}
	else {
		this._errors.push(errors);
	}
}

Response.prototype.setContent = function(content) {
	this._content = content;
}

Response.prototype.toJSON = function() {	
	return {
		content: this._content,
		errors: this._errors
	};
}
