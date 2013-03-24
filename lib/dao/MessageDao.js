var util			= require('util');

var DBConnection	= require('../DBConnection');
var Message 		= require('../model/Message');
var BaseDAO 		= require('./BaseDao');

module.exports = MessageDAO;

function MessageDAO() {
	BaseDAO.call(this);
	
	MessageDAO.SELECT 		= "SELECT idmessage, timestamp, username, message FROM message WHERE timestamp >= %s ORDER BY timestamp DESC LIMIT 0,%d";
	MessageDAO.INSERT 		= "INSERT INTO message (timestamp, username, message) VALUES ";
	MessageDAO.INSERT_VALUE = "(%s, %s, %s)";
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
 * Persit a collection of messages
 * @param newMessages
 * 		New messages to persist
 * @param callback
 * 		A callback function(err, result)
 */
MessageDAO.prototype.create = function(newMessages, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){

		if (err)  {
			callback(self._handleDatabaseError(err));
			return;
		}
		
		var insertValues = "";
		
		for(var i in newMessages) {
			if (i > 0) {
				insertValues += ",";
			}
			
			insertValues += util.format(
				MessageDAO.INSERT_VALUE, 
				connection.escape(newMessages[i].getTimestamp().toISOString()), 
				connection.escape(newMessages[i].getUserName()), 
				connection.escape(newMessages[i].getMessage())
			);
		}
		
		connection.query(MessageDAO.INSERT + insertValues, function(err, result){
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
			
				callback(undefined, result.affectedRows);
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