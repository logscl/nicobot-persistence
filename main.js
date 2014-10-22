var express 		= require('express');
var expressResource = require('express-resource');
var Config			= require('./lib/Config');

var MessageEndpoint = require('./lib/endpoint/MessageEndpoint');
var LinkEndpoint 	= require('./lib/endpoint/LinkEndpoint');

console.log("Server is starting ...");

var app = express();

app.use(express.logger());
app.use(express.bodyParser());

console.log("Creating routes ...");

app.resource('messages', MessageEndpoint);
app.resource('links', LinkEndpoint);

console.log("Routes : ");
console.log(app.routes);

app.listen(Config.SERVER_PORT);
console.log("Node server listening on " + Config.SERVER_PORT);