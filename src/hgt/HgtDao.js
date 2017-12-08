var util            = require('util');

var DBConnection    = require('../DBConnection');
var Score           = require('./Score');
var BaseDAO         = require('../common/dao/BaseDao');

module.exports = HgtDAO;

function HgtDAO() {
    BaseDAO.call(this);

     HgtDAO.SELECT_WEEKLY	= "SELECT userId, week, count(userId) as count FROM happy_geek_time WHERE channelId = %s AND year = %s AND week = %s GROUP BY userId, week";
     HgtDAO.SELECT_YEARLY	= "SELECT userId, year, count(userId) as count FROM happy_geek_time WHERE channelId = %s AND year = %s GROUP BY userId";
}

HgtDAO.prototype = new BaseDAO();
HgtDAO.prototype.constructor = HgtDAO;

/**
 * Retrieve scores for all users for a week
 * @param aLink
 * 		The link to retrieve
 * @param callback
 * 		A callback function(err, result)
 */
HgtDAO.prototype.readScoresWeekly = function(channel, year, week, callback) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err, connection){
        if (err) {
            callback(self._handleDatabaseError(err));
            return;
        }

        var queryString = util.format(
            HgtDAO.SELECT_WEEKLY,
            connection.escape(channel),
            connection.escape(year),
            connection.escape(week)
        );

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
 * Retrieve scores for all users for a year
 * @param aLink
 * 		The link to retrieve
 * @param callback
 * 		A callback function(err, result)
 */
HgtDAO.prototype.readScoresYearly = function(channel, year, callback) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err, connection){
        if (err) {
            callback(self._handleDatabaseError(err));
            return;
        }

        var queryString = util.format(
            HgtDAO.SELECT_YEARLY,
            connection.escape(channel),
            connection.escape(year)
        );

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

HgtDAO.prototype._parseResult = function(result) {
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

HgtDAO.prototype._newObject = function(res) {
    var aScore = new Score(
        res.count,
        res.userId
    );

    return aScore;
}