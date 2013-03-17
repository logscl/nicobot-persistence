var express 		= require('express');
var expressResource = require('express-resource');
var Config			= require('./lib/Config');

var app = express();

app.use(express.logger());
app.use(express.bodyParser());

app.resource('messages', require('./lib/endpoint/MessageEndpoint'));

app.listen(Config.SERVER_PORT);
console.log("Node server listening on " + Config.SERVER_PORT);