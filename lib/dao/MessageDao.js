var util			= require('util');

var DBConnection	= require('../DBConnection');
var Message 		= require('../model/Message');
var BaseDAO 		= require('./BaseDao');

module.exports = MessageDAO;

function MessageDAO() {
	BaseDAO.call(this);
	
	MessageDAO.SELECT 		= "SELECT idmessage, timestamp, username, message FROM message ORDER BY timestamp DESC LIMIT %d,%d";
    MessageDAO.SELECT_LAST  = "SELECT idmessage, timestamp, username, message FROM message WHERE timestamp >= %d ORDER BY timestamp DESC LIMIT %d,%d";
    MessageDAO.COUNT        = "SELECT count(idmessage) as count FROM message WHERE %s";
	MessageDAO.INSERT 		= "INSERT INTO message (timestamp, username, message) VALUES ";
	MessageDAO.INSERT_VALUE = "(%s, %s, %s)";
}

MessageDAO.prototype = new BaseDAO();
MessageDAO.prototype.constructor = MessageDAO;

/**
 * Retrieve messages
 * @param start
 *      Start index for paged search
 * @param limit
 * 		Max number of messages to retrieve
 * @param callback
 * 		A callback function(err, result)
 */
MessageDAO.prototype.read = function(start, limit, callback) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err, connection){
        if (err) {
            callback(self._handleDatabaseError(err));
            return;
        }

        var queryString = util.format(
            MessageDAO.SELECT,
            connection.escape(start),
            connection.escape(limit)
        );

        console.log(queryString);

        connection.query(queryString, function(err, result) {
            if (err || !result) {
                callback(self._handleDatabaseError(err));
            }
            else {
                callback(undefined, self._parseResult(result));
            }
        });

        connection.release();
    });
}

/**
 * Retrieve messages
 * @param startDate
 * 		Start date from when to retrieve messages
 * @param start
 *      Start index for paged search
 * @param limit
 * 		Max number of messages to retrieve
 * @param callback
 * 		A callback function(err, result)
 */
MessageDAO.prototype.readLastMessages = function(startDate, start, limit, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){
		if (err) {
			callback(self._handleDatabaseError(err));
			return;
		}
		
		var queryString = util.format(
			MessageDAO.SELECT_LAST,
			connection.escape(startDate.getTime()),
            connection.escape(start),
			connection.escape(limit)
		);
		
		console.log(queryString);
		
		connection.query(queryString, function(err, result) {
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
				callback(undefined, self._parseResult(result));
			}
		});
		
		connection.release();
	});
}

/**
 * Retrieve message count
 * @param startDate
 *      Start date from when to retrieve messages
 * @param callback
 *      A callback function(err, result)
 */
MessageDAO.prototype.count = function(startDate, callback) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err, connection){
        if (err) {
            callback(self._handleDatabaseError(err));
            return;
        }

        var queryParam = "";

        if (startDate) {
            queryParam += "timestamp >= " + connection.escape(startDate.getTime());
        }
        else {
            queryParam = 1;
        }

        var queryString = util.format(
            MessageDAO.COUNT,
            queryParam
        );

        console.log(queryString);

        connection.query(queryString, function(err, result) {
            if (err || !result) {
                callback(self._handleDatabaseError(err));
            }
            else {
                callback(undefined, result[0].count);
            }
        });

        connection.release();
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
				connection.escape(newMessages[i].getTimestamp().getTime()), 
				connection.escape(newMessages[i].getUserName()), 
				connection.escape(newMessages[i].getMessage())
			);
		}
		console.log(MessageDAO.INSERT + insertValues);
		
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
		new Date(res.timestamp),
		res.username,
		res.message
	);
	
	return aMessage;
}