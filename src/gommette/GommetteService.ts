import { BaseService } from "../common/service/BaseService";
import { GommetteDao } from "./GommetteDao";
import { Gommette } from "./Gommette";

export class GommetteService extends BaseService {
  private gommetteDao: GommetteDao;

  constructor() {
    super();

    this.gommetteDao = new GommetteDao();
  }

  /**
   * Get the gommettes for all users for a given year
   * @param year 
   *      The year
   * @param callback 
   *      A callback function(err, result)
   */
  retrieveYear(year:number, callback:any) {
    var self = this;

    this.gommetteDao.readScoresForAYear(year, function(err:any, response:any){
      if (err || !response) {
        callback(self._handleDAOError(err));
      } else {
        console.log(response);
        callback(undefined, response);
      }
    });
  }

  /**
   * Get the gommettes for a user for a given year
   * @param year 
   *      The year
   * @param callback 
   *      A callback function(err, result)
   */
  retrieveUserAndYear(userId:string, year:number, callback:any) {
    var self = this;

    this.gommetteDao.readScoresForUserAndAYear(userId, year, function(err:any, response:any){
      if (err || !response) {
        callback(self._handleDAOError(err));
      } else {
        console.log(response);
        callback(undefined, response);
      }
    });

  }

  /**
   * Add a gommette
   * @param gommette
   *      The gommette 
   * @param callback 
   *      A callback function(err, result)
   */
  add(gommette:Gommette, callback:any) {
    var self = this;

    this.gommetteDao.create(gommette, function(err:any, response:any) {
      if (err || !response) {
        callback(self._handleDAOError(err));
      } else {
        callback(undefined, response);
      }
    });
  }
}