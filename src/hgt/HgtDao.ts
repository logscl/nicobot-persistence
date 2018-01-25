import { BaseDAO } from "../common/dao/BaseDao";
import { DBConnection } from "../DBConnection";
import { Score } from "./Score";
import { currentId } from "async_hooks";

var util = require('util');

export class HgtDao extends BaseDAO {

    private static SELECT_WEEKLY = "SELECT userId, channelId, year, week, count(userId) as count FROM happy_geek_time WHERE channelId = %s AND year = %s AND week = %s GROUP BY userId, week ORDER BY count DESC";
    private static SELECT_YEARLY = "SELECT userId, channelId, year, week, count(userId) as count FROM happy_geek_time WHERE channelId = %s AND year = %s GROUP BY userId ORDER BY count DESC";
    private static INSERT        = "INSERT INTO happy_geek_time (userId, channelId, year, week) VALUES ";
    private static INSERT_VALUE  = "(%s, %s, %s, %s)";

    constructor() {
        super();
    }

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
    readScoresWeekly(channel:string, year:number, week:number, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryString = util.format(
                HgtDao.SELECT_WEEKLY,
                connection.escape(channel),
                connection.escape(year),
                connection.escape(week)
            );

            connection.query(queryString, function(err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    callback(undefined, self.parseResult(result));
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
    readScoresYearly(channel:string, year:number, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryString = util.format(
                HgtDao.SELECT_YEARLY,
                connection.escape(channel),
                connection.escape(year)
            );

            connection.query(queryString, function(err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    callback(undefined, self.parseResult(result));
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
    create(newScores:Array<Score>, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){

            if (err)  {
                callback(self.handleDatabaseError(err));
                return;
            }

            if (newScores.length == 0) {
                callback(undefined, "0");
                return;
            }

            var insertValues = newScores
                .map(score => util.format(
                    HgtDao.INSERT_VALUE,
                    connection.escape(score.getUserId()),
                    connection.escape(score.getChannelId()),
                    connection.escape(score.getYear()),
                    connection.escape(score.getWeek())
                ))
                .reduce((values, score) => {
                    values.push(score)
                    return values;
                }, []);

            console.log(HgtDao.INSERT + insertValues);

            connection.query(HgtDao.INSERT + insertValues, function(err:any, result:any){
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    callback(undefined, result.affectedRows);
                }
            });

            connection.release();
        });
    }

    private parseResult(result:any): Array<Score> {
        var res = new Array();

        if (Array.isArray(result)) {
            for(var i = 0; i < result.length; i++) {
                res.push(this.newObject(result[i]));
            }
        }
        else {
            res.push(this.newObject(result));
        }

        return res;
    }

    private newObject(res:any) : Score {
        var aScore = new Score(
            res.userId,
            res.channelId,
            res.year,
            res.week,
            res.count
        );

        return aScore;
    }
}