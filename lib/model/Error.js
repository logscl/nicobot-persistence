module.exports = Error;

function Error() {
	this._errors = new Array();
}

Error.prototype.hasError = function() {
	return (this._errors.length == 0) ? false : true;
}

Error.prototype.addFieldError = function(fieldName, errorMessage) {
	this._errors.push({
		field: fieldName,
		message: errorMessage
	});
}

Error.prototype.getErrors = function() {
	return this._errors;
}