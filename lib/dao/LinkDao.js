var util			= require('util');

var DBConnection	= require('../DBConnection');
var Link	 		= require('../model/Link');
var BaseDAO 		= require('./BaseDao');

module.exports = LinkDAO;

function LinkDAO() {
	BaseDAO.call(this);
	
	LinkDAO.SELECT 		= "SELECT idlink, link, count FROM link WHERE link = %s";
	LinkDAO.INSERT 		= "INSERT INTO link (link) VALUES (%s)";
	LinkDAO.UPDATE 		= "UPDATE link set count = count+1 WHERE idlink = %d";
}

LinkDAO.prototype = new BaseDAO();
LinkDAO.prototype.constructor = LinkDAO;

/**
 * Retrieve a link
 * @param aLink
 * 		The link to retrieve
 * @param callback
 * 		A callback function(err, result)
 */
LinkDAO.prototype.read = function(aLink, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){
		if (err) {
			callback(self._handleDatabaseError(err));
			return;
		}
		
		var queryString = util.format(
			LinkDAO.SELECT,
			connection.escape(aLink.getLink())
		);
		
		connection.query(queryString, function(err, result) {
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
				callback(undefined, self._updateIncomingObject(aLink, result));
			}
		});
		
		connection.release();
	});
}

LinkDAO.prototype.create = function(newLink, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){

		if (err)  {
			callback(self._handleDatabaseError(err));
			return;
		}
		
		var queryString = util.format(
			LinkDAO.INSERT, 
			connection.escape(newLink.getLink())
		);
		
		connection.query(queryString, function(err, result){
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
				newLink.setCount(newLink.getCount()+1);
				callback(undefined, newLink);
			}
		});
		
		connection.release();
	});
}

LinkDAO.prototype.update = function(aLink, callback) {
	var self = this;
	
	DBConnection.getConnectionPool().getConnection(function(err, connection){

		if (err)  {
			callback(self._handleDatabaseError(err));
			return;
		}
		
		var queryString = util.format(
			LinkDAO.UPDATE, 
			connection.escape(aLink.getId())
		);
		
		connection.query(queryString, function(err, result){
			if (err || !result) {
				callback(self._handleDatabaseError(err));
			}
			else {
				aLink.setCount(aLink.getCount()+1);
				callback(undefined, aLink);
			}
		});
		
		connection.release();
	});
}

LinkDAO.prototype._updateIncomingObject = function(incomingObject, res) {
	if (res.length != 0) {
		incomingObject = new Link(res[0].idlink, res[0].link, res[0].count);
	}
	
	return incomingObject;
}

