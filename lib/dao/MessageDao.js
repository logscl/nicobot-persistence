var util			= require('util');

var DBConnection	= require('../DBConnection');
var Message 		= require('../model/Message');
var BaseDAO 		= require('./BaseDao');

module.exports = MessageDAO;

function MessageDAO() {
	BaseDAO.call(this);
	
	MessageDAO.SELECT = "SELECT idmessage, timestamp, username, message FROM message WHERE timestamp >= %s ORDER BY timestamp DESC LIMIT 0,%d";
	MessageDAO.INSERT = "INSERT INTO message (timestamp, username, message) VALUES (%s, %s, %s)";
}

MessageDAO.prototype = new BaseDAO();
MessageDAO.prototype.constructor = MessageDAO;

/**
 * Retrieve messages
 * @param maxMessages
 * 		Max number of messages to retrieve
 * @param startDate
 * 		Start date from when to retrieve messages
 * @param callback
 * 		A callback function(err, result)
 */
MessageDAO.prototype.read = function(maxMessages, startDate, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){
		if (err) {
			callback(self._handleDatabaseError(err));
			return;
		}
		
		var queryString = util.format(
			MessageDAO.SELECT,
			connection.escape(startDate),
			connection.escape(maxMessages)
		);
		
		connection.query(queryString, function(err, result) {
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
				callback(undefined, self._parseResult(result));
			}
		});
		
		connection.end();
	});
}

/**
 * Persit a new message
 * @param newMessage
 * 		A new message to persist
 * @param callback
 * 		A callback function(err, result)
 */
MessageDAO.prototype.create = function(newMessage, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){

		if (err)  {
			callback(self._handleDatabaseError(err));
			return;
		}
	
		var queryString = util.format(
			MessageDAO.INSERT, 
			connection.escape(newMessage.getTimestamp().toISOString()), 
			connection.escape(newMessage.getUserName()), 
			connection.escape(newMessage.getMessage())
		);
		
		connection.query(queryString, function(err, result){
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
				callback(undefined, result);
			}
		});
		
		connection.end();
	});
}

MessageDAO.prototype._parseResult = function(result) {
	var res = new Array();
	
	if (Array.isArray(result)) {
		for(var i = 0; i < result.length; i++) {
			res.push(this._newObject(result[i]));
		}
	}
	else {
		res.push(this._newObject(result));
	}
	
	return res;
}

MessageDAO.prototype._newObject = function(res) {
	var aMessage = new Message(
		res.timestamp,
		res.username,
		res.message
	);
	
	return aMessage;
}