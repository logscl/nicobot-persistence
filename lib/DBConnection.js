var mysql 	= require('mysql');
var Config	= require('./Config');

module.exports = DBConnection;

function DBConnection() {}

DBConnection._connectionPool = undefined;

DBConnection.getConnectionPool = function() {
	if (DBConnection._connectionPool == undefined) {
		console.log("[DBConnection] Connection pool was undefined ... creating a new pool");
		
		DBConnection._createPool();
	}

	return DBConnection._connectionPool;
}

DBConnection._createPool = function() {
	DBConnection._connectionPool = mysql.createPool({
		host: 		Config.DB_HOST,
		port:		Config.DB_PORT,
		user: 		Config.DB_USER,
		password:	Config.DB_PASSWORD,
		database: 	Config.DB_NAME
	});
}