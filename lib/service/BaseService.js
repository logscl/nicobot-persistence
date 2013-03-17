module.exports = BaseService;

function BaseService() {

}

BaseService.prototype._handleDAOError = function(err) {
	console.log("[BaseService] Error from DAO : " + err);

	return {
		message: "Error in the persistence unit."
	};
} 