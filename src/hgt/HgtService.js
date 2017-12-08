var BaseService = require('../common/service/BaseService');
var HgtDAO      = require('./HgtDao');

module.exports  = HgtService;

function HgtService() {
    BaseService.call(this);

    this._hgtDAO = new HgtDAO();
}

HgtService.prototype = new BaseService();
HgtService.prototype.constructor = HgtService

/**
 * Get the score for a given week.
 * @param scoreRequest
 *		Information on requested week
 * @param callback
 *		A callback function(err, result)
 */
HgtService.prototype.retrieveWeek = function(channel, year, week, callback) {
    var self = this;

    this._hgtDAO.readScoresWeekly(channel, year, week, function(err, response){
        if (err || !response) {
            callback(self._handleDAOError(err));
        }
        else {
            console.log(response);
            callback(undefined, response);
        }
    });
}

/**
 * Get the score for a given year.
 * @param scoreRequest
 *		Information on requested year
 * @param callback
 *		A callback function(err, result)
 */
HgtService.prototype.retrieveYear = function(channel, year, callback) {
    var self = this;

    this._hgtDAO.readScoresYearly(channel, year, function(err, response){
        if (err || !response) {
            callback(self._handleDAOError(err));
        }
        else {
            console.log(response);
            callback(undefined, response);
        }
    });
}
