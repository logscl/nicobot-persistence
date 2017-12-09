var util = require('util');

import { BaseDAO } from "../common/dao/BaseDao";
import { Message } from "./Message";
import { DBConnection } from "../DBConnection";

export class MessageDao extends BaseDAO {

    private static SELECT 		= "SELECT idmessage, timestamp, username, message FROM message ORDER BY timestamp DESC LIMIT %d,%d";
    private static SELECT_LAST  = "SELECT idmessage, timestamp, username, message FROM message WHERE timestamp >= %d ORDER BY timestamp DESC LIMIT %d,%d";
    private static COUNT        = "SELECT count(idmessage) as count FROM message WHERE %s";
    private static INSERT 		= "INSERT INTO message (timestamp, username, message) VALUES ";
    private static INSERT_VALUE = "(%s, %s, %s)";

    constructor() {
        super();
    }

    /**
     * Retrieve messages
     * @param start
     *      Start index for paged search
     * @param limit
     * 		Max number of messages to retrieve
     * @param callback
     * 		A callback function(err, result)
     */
    read(start:number, limit:number, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryString = util.format(
                MessageDao.SELECT,
                connection.escape(start),
                connection.escape(limit)
            );

            console.log(queryString);

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
     * Retrieve messages
     * @param startDate
     * 		Start date from when to retrieve messages
     * @param start
     *      Start index for paged search
     * @param limit
     * 		Max number of messages to retrieve
     * @param callback
     * 		A callback function(err, result)
     */
    readLastMessages(startDate:Date, start:number, limit:number, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryString = util.format(
                MessageDao.SELECT_LAST,
                connection.escape(startDate.getTime()),
                connection.escape(start),
                connection.escape(limit)
            );

            console.log(queryString);

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
     * Retrieve message count
     * @param startDate
     *      Start date from when to retrieve messages
     * @param callback
     *      A callback function(err, result)
     */
    count(startDate:Date|undefined, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryParam = "";

            if (startDate) {
                queryParam += "timestamp >= " + connection.escape(startDate.getTime());
            }
            else {
                queryParam = "1";
            }

            var queryString = util.format(
                MessageDao.COUNT,
                queryParam
            );

            console.log(queryString);

            connection.query(queryString, function(err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    callback(undefined, result[0].count);
                }
            });

            connection.release();
        });
    }

    /**
     * Persit a collection of messages
     * @param newMessages
     * 		New messages to persist
     * @param callback
     * 		A callback function(err, result)
     */
    create(newMessages:Array<Message>, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function(err:any, connection:any){

            if (err)  {
                callback(self.handleDatabaseError(err));
                return;
            }

            var insertValues = newMessages.map(message => util.format(
                MessageDao.INSERT_VALUE,
                connection.escape(message.getTimestamp().getTime()),
                connection.escape(message.getUserName()),
                connection.escape(message.getMessage())
            ))
            .reduce((values, message) => {
                values.push(message);
                return values;
            }, []);

            console.log(MessageDao.INSERT + insertValues);

            connection.query(MessageDao.INSERT + insertValues, function(err:any, result:any){
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

    private parseResult(result:any): Array<Message> {
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

    private newObject(res:any) : Message {
        var aMessage = new Message(
            res.timestamp,
            res.username,
            res.message,
            res.idmessage
        );

        return aMessage;
    }
}
