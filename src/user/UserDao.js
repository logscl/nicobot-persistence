var util            = require('util');

var DBConnection    = require('../DBConnection');
var User            = require('./User');
var BaseDAO         = require('../common/dao/BaseDao');

module.exports = UserDAO;

function UserDAO() {
    BaseDAO.call(this);
    
    UserDAO.SELECT_BY_TOKEN = "SELECT id, name, token FROM user WHERE token = %s";
}

UserDAO.prototype = new BaseDAO();
UserDAO.prototype.constructor = UserDAO;

/**
 * Retrieve a user by his token
 * @param aToken
 *      The token to retrieve
 * @param callback
 *      A callback function(err, result)
 */
UserDAO.prototype.read = function(aToken, callback) {
    var self = this;
    
    DBConnection.getConnectionPool().getConnection(function(err, connection){
        if (err) {
            callback(self._handleDatabaseError(err));
            return;
        }
        
        var queryString = util.format(
            UserDAO.SELECT_BY_TOKEN,
            connection.escape(aToken)
        );
        
        connection.query(queryString, function(err, result) {
            if (err || !result) {
                callback(self._handleDatabaseError(err));
            }
            else {
                callback(undefined, self._newObject(result));
            }
        });
        
        connection.release();
    });
}

UserDAO.prototype._newObject = function(res) {
    if (res.length != 0) {
        return new User(res[0].id, res[0].name, res[0].token);
    }
    
    return undefined;
}

