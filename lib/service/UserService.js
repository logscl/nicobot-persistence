var BaseService = require('./BaseService');
var UserDAO     = require('../dao/UserDao');

module.exports = UserService;

function UserService() {
    BaseService.call(this);
    
    this._userDAO = new UserDAO();
}

UserService.prototype = new BaseService();
UserService.prototype.constructor = UserService

/**
 * Get a user
 * @param aToken
 *      The user's token
 * @param callback
 *      A callback function(err, result)
 */
UserService.prototype.get = function(aToken, callback) {
    var self = this;
    
    this._userDAO.read(aToken, function(err, response){
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