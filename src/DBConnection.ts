import { Config } from "./Config";

var mysql 	= require('mysql');

export class DBConnection {
    private static connectionPool : any = undefined;

    public static getConnectionPool() : any {
        if (DBConnection.connectionPool == undefined) {
            console.log("[DBConnection] Connection pool was undefined ... creating a new pool");
            
            DBConnection.createPool();
        }
    
        return DBConnection.connectionPool;
    }
    
    public static createPool() {
        DBConnection.connectionPool = mysql.createPool({
            host: 		Config.DB_HOST,
            port:		Config.DB_PORT,
            user: 		Config.DB_USER,
            password:	Config.DB_PASSWORD,
            database: 	Config.DB_NAME
        });
    }
} 