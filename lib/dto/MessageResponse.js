var Response = require('./Response');

module.exports = MessageResponse;

function MessageResponse() {
	Response.call(this);
	
	this._messages = undefined;
}

MessageResponse.prototype = new Response();
MessageResponse.prototype.constructor = Response;


MessageResponse.prototype.setMessages = function(messages) {
	this._messages = messages;
}

MessageResponse.prototype.toJSON = function() {
	return {
		messages : this.transform(),
		errors: this._errors
	};
}

MessageResponse.prototype.transform = function(){
	var res = new Array();
	
	for(var i = 0; this._messages && i < this._messages.length; i++) {
		res.push(this._messages[i].toJSON());
	}
	
	return res;
}