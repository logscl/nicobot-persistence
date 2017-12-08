var Error = require('../common/model/Error');

module.exports = Message;

function Message(timestamp, username, message) {
	this._timestamp	= new Date(timestamp);
	this._username = username;
	this._message = message;
	this._errors = new Error();
}

function Message(timestamp, username, message, id) {
	this._id = id;
	this._timestamp	= new Date(timestamp);
	this._username = username;
	this._message = message;
	this._errors = new Error();
}

Message.prototype.getTimestamp = function() {
	return this._timestamp;
};

Message.prototype.getUserName = function() {
	return this._username;
};

Message.prototype.getMessage = function() {
	return this._message;
};

Message.prototype.validate = function() {
	//console.log("Validating message...");
	
	if (!this._timestamp) {
		this._errors.addFieldError("timestamp", "Cannot be null");
	}
	
	if (!this._username || this._username.length == 0) { 
		this._errors.addFieldError("username", "Cannot be null or empty");
	}
	
	if (!this._message || this._message.length == 0) {
		this._errors.addFieldError("message", "Cannot be null or empty");
	}
	
	if (this._errors.hasError()) {
		return false;
	}
	
	return true;
};

Message.prototype.getValidationErrors = function() {
	return this._errors.getErrors();
}
