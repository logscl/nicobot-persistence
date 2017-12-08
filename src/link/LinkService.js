var BaseService	= require('../common/service/BaseService');
var LinkDAO 	= require('./LinkDao');

module.exports = LinkService;

function LinkService() {
	BaseService.call(this);
	
	this._linkDAO = new LinkDAO();
}

LinkService.prototype = new BaseService();
LinkService.prototype.constructor = LinkService

/**
 * Get a link.
 * @param aLink
 *		The link to get
 * @param callback
 *		A callback function(err, result)
 */
LinkService.prototype.get = function(aLink, callback) {
	var self = this;
	
	this._linkDAO.read(aLink, function(err, response){
		if (err || !response) {
			callback(self._handleDAOError(err));
		}
		else {
			console.log(response);
			callback(undefined, response);
		}
	});
}

LinkService.prototype.add = function(aLink, callback) {
	var self = this;
	
	this._linkDAO.read(aLink, function(err, response){
		aLink = response;
		
		if (aLink.getId() != undefined) {
			//le lien existe deja en bdd, il faut maj le compteur
			self._linkDAO.update(aLink, function(err, response) {
				if (err || !response) {
					callback(self._handleDAOError(err));
				}
				else {
					console.log(response);
					callback(undefined, response);
				}
			});
		}
		else {
			self._linkDAO.create(aLink, function(err, response) {
				if (err || !response) {
					callback(self._handleDAOError(err));
				}
				else {
					console.log(response);
					callback(undefined, response);
				}
			});
		}
	});
}