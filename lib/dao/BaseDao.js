module.exports = BaseDAO;

function BaseDAO() {}

BaseDAO.prototype._handleDatabaseError = function(err) {
	console.log("[BaseDAO] Error from database : " + err);
	
	return {
		layer: 'database',
		message: err.code
	};
}