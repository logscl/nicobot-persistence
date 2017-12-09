import { BaseService } from "../common/service/BaseService";
import { UserDao } from "./UserDao";

export class UserService extends BaseService {
    private userDao = new UserDao();

    constructor() {
        super();
    }

    /**
     * Get a user
     * @param aToken
     *      The user's token
     * @param callback
     *      A callback function(err, result)
     */
    public get(aToken:string, callback:any) {
        var self = this;
        
        this.userDao.read(aToken, function(err:any, response:any){
            if (err) {
                callback(self._handleDAOError(err));
            }
            else if (!response) {
                callback("user not found");
            }
            else {
                console.log(response);
                callback(undefined, response);
            }
        });
    }
}