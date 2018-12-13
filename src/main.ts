import { Config } from "./Config";
import { Authentication } from "./auth/Authentication";
import { HgtEndpoint } from "./hgt/HgtEndpoint";
import { LinkEndpoint } from "./link/LinkEndpoint";
import { MessageEndpoint } from "./message/MessageEndpoint";
import { GommetteEndpoint } from "./gommette/GommetteEndpoint";

var express         = require('express');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var expressResource = require('express-resource');
var compression     = require('compression');

console.log("Server is starting ...");

var app = express();

app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(compression());

console.log("Creating routes ...");

app.use(Authentication.authenticateUser);

app.resource('messages', MessageEndpoint);
app.resource('links', LinkEndpoint);
app.resource('scores/hgt/:channel', HgtEndpoint);
app.resource('scores/gommettes', GommetteEndpoint);
app.get('/scores/hgt/:channel/:year', HgtEndpoint.byYear);
app.get('/scores/hgt/:channel/:year/:week', HgtEndpoint.byWeek);
app.get('/scores/gommettes/:year', GommetteEndpoint.byYear);
app.get('/scores/gommettes/:year/:userId', GommetteEndpoint.byYearAndUser);

console.log("Routes : ");
for (var r of app._router.stack) {
    if (r.route && r.route.path) {
        console.log(r.route.path)
    }
}

app.listen(Config.SERVER_PORT);
console.log("Node server listening on " + Config.SERVER_PORT);