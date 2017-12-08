var util        = require('util');

var Response    = require('../common/dto/Response');
var User        = require('../user/User');
var UserService = require('../user/UserService');

var userService = new UserService();

/**
 * Checks for a user's token in query params. 
 * Returns a HTTP 401 when it's not found or invalid.
 */
exports.authenticateUser = function authenticateUser(req, res, next) {
    var token = req.query.token;

    userService.get(token, function(err, result){
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