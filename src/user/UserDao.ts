import { BaseDAO } from "../common/dao/BaseDao";
import { User } from "./User";
import { DBConnection } from "../DBConnection";

var util            = require('util');

export class UserDao extends BaseDAO {

    private static SELECT_BY_TOKEN : string = "SELECT id, name, token FROM user WHERE token = %s";
 
    constructor() {
        super();
    }
    
    /**
     * Retrieve a user by his token
     * @param aToken
     *      The token to retrieve
     * @param callback
     *      A callback function(err, result)
     */
    public read(aToken:string, callback:any) {
        var self = this;
        
        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }
            
            var queryString = util.format(
                UserDao.SELECT_BY_TOKEN,
                connection.escape(aToken)
            );
            
            connection.query(queryString, function(err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    callback(undefined, UserDao.newObject(result));
                }
            });
            
            connection.release();
        });
    }

    private static newObject(res:any) : User | undefined {
        if (res.length != 0) {
            return new User(res[0].id, res[0].name, res[0].token);
        }
        
        return undefined;
    }
}