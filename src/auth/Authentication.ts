import { UserService } from "../user/UserService";
import { Response } from "../common/dto/Response";

export class Authentication {
    private static userService : UserService = new UserService();

    /**
     * Checks for a user's token in query params. 
     * Returns a HTTP 401 when it's not found or invalid.
     */
    public static authenticateUser(req:any, res:any, next:any) {
        var token = req.query.token;
        
        Authentication.userService.get(token, function(err:any, result:any){
            if (err) {
                console.log("[Authentication] Errors : %j", err);
                var response = new Response();
                response.addErrors(err);
                res.status(401).json(response);
            } else {
                console.log("[Authentication] user found");
                next();
            }
        });
    }
}
