import { BaseDAO } from "../common/dao/BaseDao";
import { DBConnection } from "../DBConnection";
import { Gommette } from "./Gommette";
import { GommetteScore } from "./GommetteScore";

var util = require('util');

export class GommetteDao extends BaseDAO {

  private static INSERT                 = "INSERT INTO gommette (userId, giverId, reason, type, yesCount, noCount, creationDate, valid) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)";

  private static SELECT_SCORE_USER_YEAR = `SELECT userId, SUM(type=0) AS redCount, SUM(type=1) AS greenCount, SUM(CASE WHEN type = 1 THEN 2 ELSE -1 END) AS score FROM gommette 
                                           WHERE valid = 1 AND YEAR(creationDate) = %s AND userId = %s 
                                           GROUP BY userId 
                                           ORDER BY score DESC;`; 

  private static SELECT_SCORE_ALL_YEAR  = `SELECT userId, SUM(type=0) AS redCount, SUM(type=1) AS greenCount, SUM(CASE WHEN type = 1 THEN 2 ELSE -1 END) AS score FROM gommette 
                                           WHERE valid = 1 AND YEAR(creationDate) = %s 
                                           GROUP BY userId 
                                           ORDER BY score DESC;`; 
  constructor() {
    super();
  }

  /**
   * Retrieve scores for a user for a year
   * @param user
   *      The user
   * @param year
   *      The year
   * @param callback
   * 		A callback function(err, result)
   */
  readScoresForUserAndAYear(userId:string, year:number, callback:any) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
      if (err) {
        callback(self.handleDatabaseError(err));
        return;
      }

      var queryString = util.format(
        GommetteDao.SELECT_SCORE_USER_YEAR,
        connection.escape(year),
        connection.escape(userId)
      );

      console.log(queryString);

      connection.query(queryString, function(err:any, result:any) {
        if (err || !result) {
          callback(self.handleDatabaseError(err));
        }
        else {
          callback(undefined, self.parseScoreResult(result));
        }
      });

      connection.release();
    });
  }

  /**
   * Retrieve scores for all users for a year
   * @param year
   *      The year
   * @param callback
   * 		A callback function(err, result)
   */
  readScoresForAYear(year:number, callback:any) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
      if (err) {
        callback(self.handleDatabaseError(err));
        return;
      }

      var queryString = util.format(
        GommetteDao.SELECT_SCORE_ALL_YEAR,
        connection.escape(year)
      );

      console.log(queryString);

      connection.query(queryString, function(err:any, result:any) {
        if (err || !result) {
          callback(self.handleDatabaseError(err));
        }
        else {
          callback(undefined, self.parseScoreResult(result));
        }
      });

      connection.release();
    });
  }

  /**
   * Persit a new gommette
   * @param newGommette
   * 		New gommette to persist
   * @param callback
   * 		A callback function(err, result)
   */
  create(newGommette:Gommette, callback:any) {
    var self = this;

    DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){

      if (err)  {
        callback(self.handleDatabaseError(err));
        return;
      }

      if (newGommette == null) {
        callback(undefined, "0");
        return;
      }

      var insertValue = util.format(
        GommetteDao.INSERT,
        connection.escape(newGommette.getUserId()),
        connection.escape(newGommette.getGiverId()),
        connection.escape(newGommette.getReason()),
        connection.escape(newGommette.getType()),
        connection.escape(newGommette.getYesCount()),
        connection.escape(newGommette.getNoCount()),
        connection.escape(newGommette.getCreationDate()),
        connection.escape(newGommette.isValid())
      )

      console.log(insertValue);

      connection.query(insertValue, function(err:any, result:any){
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

  private parseGommetteResult(result:any): Array<Gommette> {
    var res = new Array();

    if (Array.isArray(result)) {
      res = result.map((r:any) => this.newScore(r));
    } else {
      res.push(this.newGommette(result));
    }

    return res;
  }

  private newGommette(res:any) : Gommette {
    var aGommette = new Gommette(
      res.userId,
      res.giverId,
      res.reason,
      res.type,
      res.yesCount,
      res.noCount,
      new Date(res.creationDate),
      res.valid
    );

    return aGommette;
  }

  private parseScoreResult(result:any): Array<GommetteScore> {
    var res = new Array();

    if (Array.isArray(result)) {
      res = result.map((r:any) => this.newScore(r));
    } else {
      res.push(this.newScore(result));
    }

    return res;
  }

  private newScore(res:any) : GommetteScore {
    var aGommette = new GommetteScore(
      res.userId,
      res.redCount,
      res.greenCount,
      res.score
    );

    return aGommette;
  }
}