import { Config } from "./Config";
import { Authentication } from "./auth/Authentication";
import { HgtEndpoint } from "./hgt/HgtEndpoint";
import { LinkEndpoint } from "./link/LinkEndpoint";

var express         = require('express');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var expressResource = require('express-resource');
var compression     = require('compression');

/*
var MessageEndpoint = require('./message/MessageEndpoint');
var LinkEndpoint    = require('./link/LinkEndpoint');
*/


console.log("Server is starting ...");

var app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(compression());

console.log("Creating routes ...");

app.use(Authentication.authenticateUser);

/*
app.resource('messages', MessageEndpoint);
*/
app.resource('links', LinkEndpoint);
app.resource('scores/:channel', HgtEndpoint);
app.get('/scores/:channel/:year', HgtEndpoint.byYear);
app.get('/scores/:channel/:year/:week', HgtEndpoint.byWeek);

console.log("Routes : ");
for (var r of app._router.stack) {
    if (r.route && r.route.path) {
        console.log(r.route.path)
    }
}

app.listen(Config.SERVER_PORT);
console.log("Node server listening on " + Config.SERVER_PORT);