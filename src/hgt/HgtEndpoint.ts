var moment = require("moment");

import { ScoreResponse } from "./ScoreResponse";
import { HgtService } from "./HgtService";
import { Score } from "./Score";

export class HgtEndpoint {

    private static hgtService: HgtService = new HgtService();

    public static index(req: any, res:any) {
        console.log("[HgtEndpoint] Incoming 'this week' request : %j", req.query);

        var now = new Date();

        HgtEndpoint.retrieveByWeek(res, req.params.channel, now.getFullYear(), HgtEndpoint.retrieveWeekNumber());
    }

    public static byWeek(req:any, res:any){
        console.log("[HgtEndpoint] Incoming 'weekly' request : %j", req.query);

        HgtEndpoint.retrieveByWeek(res, req.params.channel, req.params.year, req.params.week);
    }

    private static retrieveByWeek(res: any, channel: string, year: number, week:number) {
        HgtEndpoint.hgtService.retrieveWeek(channel, year, week, function(err: any, result: any){
            var response = new ScoreResponse();

            if (err) {
                console.log("[HgtEndpoint] Errors : %j", err);
                response.addErrors(err);
            }
            else {
                response.setScores(result);
            }

            res.json(response.toJSON());
        });
    }

    public static byYear(req:any, res:any) {
        console.log("[HgtEndpoint] Incoming 'yearly' request : %j", req.query);


        HgtEndpoint.hgtService.retrieveYear(req.params.channel, req.params.year, function(err:any, result:any){
            var response = new ScoreResponse();

            if (err) {
                console.log("[HgtEndpoint] Errors : %j", err);
                response.addErrors(err);
            }
            else {
                response.setScores(result);
            }

            res.json(response.toJSON());
        });
    }

    public static create(req:any, res:any){
        console.log("[HgtEndpoint] Incoming 'create' request : %j", req.body);

        var scores = HgtEndpoint.parseScores(req.body.users, req.params.channel);

        HgtEndpoint.hgtService.add(scores, function(err:any, result:any){
            var response = new ScoreResponse();

            if (err) {
                console.log("[HgtEndpoint] Errors : %j", err);
                response.addErrors(err);
            }

            if (result == 0) {
                res.statusCode = 204;
            } else {
                res.statusCode = 201;
            }

            res.json(response.toJSON());
        });
    }

    private static parseScores(items:Array<string>, channelId:string) : Array<Score> {
        var now = new Date();
        var weekOfYear = HgtEndpoint.retrieveWeekNumber();

        var scores:Array<Score> = [];

        if (Array.isArray(items)) {
            scores = items.map(item => new Score(item, channelId, now.getFullYear(), weekOfYear))
            .reduce((scores:Array<Score>, score) => {
                scores.push(score);
                return scores;
            }, []);
        }

        return scores;
    }

    private static retrieveWeekNumber():number {
        return moment().isoWeek();
    }

}