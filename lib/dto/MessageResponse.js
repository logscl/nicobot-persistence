var Response = require('./Response');
var MessageDto = require('./MessageDto');

module.exports = MessageResponse;

function MessageResponse() {
	Response.call(this);
	
	this._messages = undefined;
    this._paging = undefined;
}

MessageResponse.prototype = new Response();
MessageResponse.prototype.constructor = Response;


MessageResponse.prototype.setMessages = function(messages) {
	this._messages = messages;
}

MessageResponse.prototype.setPaging = function(paging){
    this._paging = paging;
}

MessageResponse.prototype.toJSON = function() {
	return {
		messages : this.transform(),
        paging: this._paging,
		errors: this._errors
	};
}

MessageResponse.prototype.transform = function(){
	var res = new Array();
	
	for(var i = 0; this._messages && i < this._messages.length; i++) {
		res.push(new MessageDto(this._messages[i]).toJSON());
	}
	
	return res;
}