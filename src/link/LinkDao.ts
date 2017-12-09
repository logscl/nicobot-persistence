import { BaseDAO } from "../common/dao/BaseDao";
import { Link } from "./Link";
import { DBConnection } from "../DBConnection";

var util = require('util');

export class LinkDao extends BaseDAO {

    private static SELECT = "SELECT idlink, link, count FROM link WHERE link = %s";
    private static INSERT = "INSERT INTO link (link) VALUES (%s)";
    private static UPDATE = "UPDATE link set count = count+1 WHERE idlink = %d";

    constructor() {
        super();
    }

    /**
     * Retrieve a link
     * @param aLink
     * 		The link to retrieve
     * @param callback
     * 		A callback function(err, result)
     */
    read(aLink: Link, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function (err:any, connection:any) {
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryString = util.format(
                LinkDao.SELECT,
                connection.escape(aLink.getLink())
            );

            connection.query(queryString, function (err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    callback(undefined, self.updateIncomingObject(aLink, result));
                }
            });
            connection.release();
        });
    }

    private updateIncomingObject(incomingObject:Link, res:any) : Link {
        if (res.length != 0) {
            incomingObject = new Link(res[0].link, res[0].count, res[0].idlink);
        }

        return incomingObject;
    }

    create(newLink:Link, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function (err:any, connection:any) {
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }
            var queryString = util.format(
                LinkDao.INSERT,
                connection.escape(newLink.getLink())
            );

            connection.query(queryString, function (err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    newLink.setCount(newLink.getCount() + 1);
                    callback(undefined, newLink);
                }
            });

            connection.release();
        });
    }

    update(aLink:Link, callback:any) {
        var self = this;

        DBConnection.getConnectionPool().getConnection(function (err:any, connection:any) {
            if (err) {
                callback(self.handleDatabaseError(err));
                return;
            }

            var queryString = util.format(
                LinkDao.UPDATE,
                connection.escape(aLink.getId())
            );

            connection.query(queryString, function (err:any, result:any) {
                if (err || !result) {
                    callback(self.handleDatabaseError(err));
                }
                else {
                    aLink.setCount(aLink.getCount() + 1);
                    callback(undefined, aLink);
                }
            });
            connection.release();
        });
    }
}
