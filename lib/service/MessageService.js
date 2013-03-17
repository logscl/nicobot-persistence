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
 * Add a message.
 * 
 * @param newMessage
 *		The message
 * @param callback
 * 		A callback function(err, insertId)
 */
MessageService.prototype.add = function(newMessage, callback) {
	var self = this;
	
	if (newMessage.validate()) {
		this._messageDAO.create(newMessage, function(err, response) {
			if (err || !response) {
				callback(self._handleDAOError(err));
			}
			else {
				callback(undefined, response.insertId);
			}
		});
	}
	else {
		callback(newMessage.getValidationErrors());
	}
} 