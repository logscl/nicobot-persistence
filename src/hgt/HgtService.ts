import { BaseService } from "../common/service/BaseService";
import { Score } from "./Score";
import { HgtDao } from "./HgtDao";

export class HgtService extends BaseService {
    private hgtDao: HgtDao;

    constructor() {
        super();

        this.hgtDao = new HgtDao();
    }

    /**
     * Get the score for a given week.
     * @param channel
     *      The channel
     * @param year
     *      The year
     * @param week
     *      The week
     * @param callback
     *		A callback function(err, result)
    */
    retrieveWeek(channel:string, year:number, week:number, callback:any) {
        var self = this;

        this.hgtDao.readScoresWeekly(channel, year, week, function(err:any, response:any){
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
     * @param channel
     *      The channel
     * @param year
     *      The year
     * @param callback
     *		A callback function(err, result)
    */
    retrieveYear(channel:string, year:number, callback:any) {
        var self = this;

        this.hgtDao.readScoresYearly(channel, year, function(err:any, response:any){
            if (err || !response) {
                callback(self._handleDAOError(err));
            }
            else {
                callback(undefined, response);
            }
        });
    }

    /**
     * Add users's score for the current week and year.
     * @param channel
     *      The channel
     * @param year
     *      The year
     * @param week
     *      The week
     * @param callback
     *		A callback function(err, result)
    */
    add(scores:Array<Score>, callback:any) {
        var self = this;

        this.hgtDao.create(scores, function(err:any, response:any){
            if (err || !response) {
                callback(self._handleDAOError(err));
            }
            else {
                callback(undefined, response);
            }
        });
    }
}