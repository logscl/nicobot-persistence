var BaseService	= require('./BaseService');
var MessageDAO 	= require('../dao/MessageDao');

module.exports = MessageService;

function MessageService() {
	BaseService.call(this);
	
	this._messageDAO = new MessageDAO();
}

MessageService.prototype = new BaseService();
MessageService.prototype.constructor = MessageService

/**
 * Get messages.
 * @param maxMessages
 *		Max number of messages to get
 * @param startDate
 *		Start date from when to get messages
 * @param callback
 *		A callback function(err, result)
 */
MessageService.prototype.get = function(maxMessages, startDate, callback) {
	var self = this;
	
	this._messageDAO.read(maxMessages, startDate, function(err, response){
		if (err || !response) {
			callback(self._handleDAOError(err));
		}
		else {
			callback(undefined, response);
		}
	});
}

/**
 * Add an array of messages.
 * 
 * @param newMessages
 *		Array of new messages
 * @param callback
 * 		A callback function(err, insertId)
 */
MessageService.prototype.add = function(newMessages, callback) {
	var self = this;
	
	var validationResults = self.validateMessages(newMessages);
	
	if (validationResults.nonValidElements.length == 0) {
		this._messageDAO.create(validationResults.validElements, function(err, response) {
			if (err || !response) {
				callback(self._handleDAOError(err));
			}
			else {
				callback(undefined, response);
			}
		});
	}
	else {
		var errors = new Array();
		
		for (var i in validationResults.nonValidElements) {
			errors.push(validationResults.nonValidElements[i].getValidationErrors());
		}
		
		callback(errors);
	}
} 

/**
 * Returns an object with 2 fields. One for valid elements, the other one for non valid elements
 * @param messages
 * 		An array of messages to validate
 */
MessageService.prototype.validateMessages = function(messages) {
	var res = {
		validElements : new Array(),
		nonValidElements : new Array()
	};
	
	for(var i in messages){
		if (messages[i].validate()) {
			res.validElements.push(messages[i]);	
		}
		else {
			res.nonValidElements.push(messages[i]);
		}
	}
	
	return res;
}