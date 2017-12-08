var util            = require('util');

var DBConnection    = require('../DBConnection');
var Score           = require('./Score');
var BaseDAO         = require('../common/dao/BaseDao');

module.exports = HgtDAO;

function HgtDAO() {
    BaseDAO.call(this);

     HgtDAO.SELECT_WEEKLY	= "SELECT userId, channelId, year, week, count(userId) as count FROM happy_geek_time WHERE channelId = %s AND year = %s AND week = %s GROUP BY userId, week";
     HgtDAO.SELECT_YEARLY	= "SELECT userId, channelId, year, week, count(userId) as count FROM happy_geek_time WHERE channelId = %s AND year = %s GROUP BY userId";
     HgtDAO.INSERT          = "INSERT INTO happy_geek_time (userId, channelId, year, week) VALUES ";
     HgtDAO.INSERT_VALUE    = "(%s, %s, %s, %s)";
}

HgtDAO.prototype = new BaseDAO();
HgtDAO.prototype.constructor = HgtDAO;

/**
 * Retrieve scores for all users for a week
 * @param channel
 *      The channel
 * @param year
 *      The year
 * @param week
 *      The week
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
 * @param channel
 *      The channel
 * @param year
 *      The year
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

/**
 * Persit a collection of scores
 * @param newScores
 * 		New scores to persist
 * @param callback
 * 		A callback function(err, result)
 */
HgtDAO.prototype.create = function(newScores, callback) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err, connection){

        if (err)  {
            callback(self._handleDatabaseError(err));
            return;
        }

        var insertValues = "";

        for(var i in newScores) {
            if (i > 0) {
                insertValues += ",";
            }

            insertValues += util.format(
                HgtDAO.INSERT_VALUE,
                connection.escape(newScores[i].getUserId()),
                connection.escape(newScores[i].getChannelId()),
                connection.escape(newScores[i].getYear()),
                connection.escape(newScores[i].getWeek())
            );
        }

        console.log(HgtDAO.INSERT + insertValues);

        connection.query(HgtDAO.INSERT + insertValues, function(err, result){
            if (err || !result) {
                callback(self._handleDatabaseError(err));
            }
            else {
                callback(undefined, result.affectedRows);
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
        res.userId,
        res.channelId,
        res.year,
        res.week,
        res.count
    );

    return aScore;
}