import { GommetteService } from "./GommetteService";
import { GommetteScoreResponse } from "./GommetteScoreResponse";
import { Gommette } from "./Gommette";

export class GommetteEndpoint {

  private static gommetteService: GommetteService = new GommetteService();

  public static index(req: any, res: any) {
    console.log("[GommetteEndpoint] Incoming 'this year' request: %j", req.query);

    var now = new Date();

    GommetteEndpoint.retrieveByYear(res, now.getFullYear());
  }

   public static byYear(req:any, res:any) {
    console.log("[GommetteEndpoint] Incoming 'yearly' request: %j", req.query);

    GommetteEndpoint.retrieveByYear(res, req.params.year);
  }

  private static retrieveByYear(res: any, year: number) {
    GommetteEndpoint.gommetteService.retrieveYear(year, function(err: any, result: any) {
     var response = new GommetteScoreResponse();

     if(err) {
       console.log("[GommetteEndpoint] Errors: %j", err);
       response.addErrors(err);
     } else {
       response.setScores(result);
     }

      res.json(response.toJSON());
    });
  }

  public static byYearAndUser(req: any, res:any) {
    console.log("[GommetteEndpoint] Incoming 'yearly user' request: %j", req.query);

    GommetteEndpoint.retrieveByYearAndUserId(res, req.params.year, req.params.userId);
  }

  private static retrieveByYearAndUserId(res: any, year: number, userId: string) {
    GommetteEndpoint.gommetteService.retrieveUserAndYear(userId, year, function(err: any, result: any) {
     var response = new GommetteScoreResponse();

     if(err) {
       console.log("[GommetteEndpoint] Errors: %j", err);
       response.addErrors(err);
     } else {
       response.setScores(result);
     }

     res.json(response.toJSON());
    });
  }

  public static create(req: any, res:any) {
    console.log("[GommetteEndpoint] Incoming 'create' request: %j", req.body);

    var gommette = GommetteEndpoint.parseGommette(req.body.gommette);

    GommetteEndpoint.gommetteService.add(gommette, function(err:any, result:any) {
      var response = new GommetteScoreResponse();

      if (err) {
        console.log("[GommetteEndpoint] Errors: %j", err);
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

  private static parseGommette(item:any): Gommette {
    return new Gommette(
      item.userId,
      item.giverId,
      item.reason,
      item.type,
      item.yesCount,
      item.noCount,
      new Date(item.creationDate),
      item.valid
    );
  }
}